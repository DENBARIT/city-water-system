import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendPasswordResetOtp, sendOtp } from '../../config/email.js';
import { AppError } from "../../utils/ApiError.js";


const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'superrefreshsecret';
const JWT_EXPIRY = '1hr';
const JWT_REFRESH_EXPIRY = '7d';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerUser(data) {
  const { fullName, phoneE164, email, password, nationalId, meterNumber, subCityId, woredaId } = data;


  // Check for existing meter number
  const existingMeter = await prisma.meter.findUnique({
    where: { meterNumber }
  });
  if (existingMeter) throw new Error('Meter number already registered');

  // Check for existing user by email, phone, or nationalId
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phoneE164 }, { nationalId }] }
  });
  if (existingUser) throw new Error('User already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      fullName, phoneE164, email, nationalId, passwordHash,
      subCityId, woredaId, role: 'CUSTOMER',
      otp: otpHash, otpExpiry,
      emailVerified: false
    }
  });

  await prisma.meter.create({
    data: { meterNumber, customerId: user.id }
  });

  await sendOtp(user.email, otp);

  return user;
}

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      subCityId: user.subCityId ?? null,
      woredaId: user.woredaId ?? null,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY }
  );

  return { accessToken, refreshToken };
};

export async function loginUser({ emailOrPhone, password }) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrPhone }, { phoneE164: emailOrPhone }] },
    select: {
      id: true,
      role: true,
      passwordHash: true,
      emailVerified: true,
      status: true,
      subCityId: true,
      woredaId: true,
    },
  });

  if (!user) throw new AppError('Invalid credentials.', 401);
  if (!user.emailVerified) throw new AppError('Email not verified. Please verify your email before logging in.', 401);
  if (user.status === 'SUSPENDED') throw new AppError('Your account has been suspended. Please contact the administrator.', 403);
  if (user.status === 'INACTIVE') throw new AppError('Your account is inactive. Please contact the administrator.', 403);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new AppError('Invalid credentials.', 401);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const { accessToken, refreshToken } = generateTokens(user);

  return { accessToken, refreshToken };
}

export async function validateOtp(email, otp) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('User not found');
  if (user.emailVerified) throw new Error('Email already verified');
  if (!user.otp || !user.otpExpiry) throw new Error('No OTP found, request a new one');
  if (user.otpExpiry < new Date()) throw new Error('OTP expired');

  const isValid = await bcrypt.compare(otp, user.otp);
  if (!isValid) throw new Error('Invalid OTP');

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true, otp: null, otpExpiry: null }
  });

  return { message: 'Email verified successfully' };
}

export async function resendOtp(email) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('User not found');
  if (user.emailVerified) throw new Error('Email already verified');

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { otp: otpHash, otpExpiry }
  });

  await sendOtp(email, otp);

  return { message: 'OTP resent successfully' };
}



export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('User not found');
  if (!user.emailVerified) throw new Error('Email not verified');

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { otp: otpHash, otpExpiry }
  });

  await sendPasswordResetOtp(email, otp);

  return { message: 'Password reset OTP sent to your email.' };
}

export async function resetPassword({ email, otp, newPassword }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('User not found');
  if (!user.otp || !user.otpExpiry) throw new Error('No OTP found, request a new one');
  if (user.otpExpiry < new Date()) throw new Error('OTP expired');

  const isValid = await bcrypt.compare(otp, user.otp);
  if (!isValid) throw new Error('Invalid OTP');

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash, otp: null, otpExpiry: null }
  });

  return { message: 'Password reset successfully.' };
}

export async function getNewToken(refreshToken) {
  let payload;

  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) throw new Error('User not found');

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  return { accessToken, refreshToken: newRefreshToken };
}


