import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to, subject, text, html) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

export async function sendOtp(to, otp) {
  const subject = 'Your AquaConnect OTP Code';

  const text = `Hello,

Your One-Time Password (OTP) for AquaConnect verification is: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone.

If you did not request this, please ignore this email.

Thank you,
AquaConnect Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2e86de;">AquaConnect Verification</h2>
        <p>Hello,</p>
        <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for verifying your AquaConnect account is:</p>
        <p style="font-size: 32px; font-weight: bold; color: #2e86de; letter-spacing: 6px; margin: 24px 0;">${otp}</p>
        <p style="color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">If you did not request this OTP, please ignore this email.</p>
        <p style="font-size: 14px; color: #555;">Thank you,<br/><strong>AquaConnect Team</strong></p>
      </div>
    </div>
  `;

  await sendEmail(to, subject, text, html);
  console.log(`OTP sent to ${to}`);
}

export async function sendPasswordResetOtp(to, otp) {
  const subject = 'AquaConnect Password Reset Request';

  const text = `Hello,

We received a request to reset your AquaConnect account password.

Your Password Reset OTP is: ${otp}

This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email and your password will remain unchanged.

Thank you,
AquaConnect Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #e74c3c;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your <strong>AquaConnect</strong> account password.
        </p>
        <p style="font-size: 14px; color: #555;">Use the OTP below to proceed:</p>
        <p style="font-size: 32px; font-weight: bold; color: #e74c3c; letter-spacing: 6px; margin: 24px 0;">${otp}</p>
        <p style="color: #555;">This OTP is valid for <strong>10 minutes</strong> and can only be used once.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 13px; color: #e74c3c;">
          ⚠️ If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <p style="font-size: 14px; color: #555; margin-top: 16px;">Thank you,<br/><strong>AquaConnect Team</strong></p>
      </div>
    </div>
  `;

  await sendEmail(to, subject, text, html);
  console.log(`Password reset OTP sent to ${to}`);
}