import { prisma } from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/hashtoken.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
class AuthService {
  /**
   * Register a new customer
   * @param {Object} data - registration data
   * @param {string} data.phoneE164 - phone number in E164 format
   * @param {string} data.nationalId - unique national ID
   * @param {string} data.password - plain password
   * @param {string} data.fullName - full name
   * @param {string} data.subCityId - sub-city ID (required)
   * @param {string} data.woredaId - woreda ID (required)
   * @param {string} [data.email] - optional email
   * @param {string} [data.houseNumber] - optional house number
   * @param {string} [data.profileImageUrl] - optional profile image
   * @returns {Promise<User>}
   */
  async register(data) {
    // Check if phone or national ID already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ phoneE164: data.phoneE164 }, { nationalId: data.nationalId }],
      },
    });

    if (existingUser) {
      throw new Error('Phone number or National ID already registered');
    }

    // Validate required location fields
    if (!data.subCityId || !data.woredaId) {
      throw new Error('SubCity and Woreda are required');
    }

    // Verify that the woreda belongs to the given subCity
    const woreda = await prisma.woreda.findUnique({
      where: { id: data.woredaId },
      select: { subCityId: true },
    });

    if (!woreda || woreda.subCityId !== data.subCityId) {
      throw new Error('Invalid Woreda for the selected SubCity');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        phoneE164: data.phoneE164,
        nationalId: data.nationalId,
        passwordHash: hashedPassword,
        fullName: data.fullName,
        email: data.email,
        houseNumber: data.houseNumber,
        profileImageUrl: data.profileImageUrl,
        role: 'CUSTOMER',
        subCityId: data.subCityId,
        woredaId: data.woredaId,
        // Create default preferences
        preference: {
          create: {}, // uses default values from schema
        },
      },
      include: {
        preference: true,
      },
    });

    // Optionally create an audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTRATION',
        entity: 'User',
        entityId: user.id,
        description: `New customer registered: ${user.phoneE164}`,
      },
    });

    return user;
  }

  /**
   * Login with phone and password
   * @param {string} phoneE164
   * @param {string} password
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  async login(phoneE164, password) {
    const user = await prisma.user.findUnique({
      where: { phoneE164 },
    });

    if (!user || user.deletedAt || user.status !== 'ACTIVE') {
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        description: `User logged in`,
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  /**
   * Get current user profile
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getMe(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        phoneE164: true,
        email: true,
        nationalId: true,
        role: true,
        status: true,
        subCityId: true,
        woredaId: true,
        meters: {
          select: {
            id: true,
            meterNumber: true,
            status: true,
          },
        },
        preference: true,
      },
    });
  }

  /**
   * Change password for authenticated user
   * @param {string} userId
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: userId,
        action: 'UPDATE',
        entity: 'User',
        entityId: userId,
        description: 'Password changed',
      },
    });
  }

  /**
   * Update user's location (subCity and woreda) after password confirmation
   * @param {string} userId
   * @param {Object} data
   * @param {string} data.subCityId - new subCity ID
   * @param {string} data.woredaId - new woreda ID
   * @param {string} password - current password for confirmation
   * @returns {Promise<user>}
   */
  async updateLocation(userId, data, password) {
    // Fetch user with current data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        passwordHash: true,
        status: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt || user.status !== 'ACTIVE') {
      throw new Error('User not found or inactive');
    }

    // Verify password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Password is incorrect');
    }

    // Validate that the woreda belongs to the new subCity
    const woreda = await prisma.woreda.findUnique({
      where: { id: data.woredaId },
      select: { subCityId: true },
    });

    if (!woreda || woreda.subCityId !== data.subCityId) {
      throw new Error('Invalid Woreda for the selected SubCity');
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subCityId: data.subCityId,
        woredaId: data.woredaId,
      },
      select: {
        id: true,
        fullName: true,
        phoneE164: true,
        subCityId: true,
        woredaId: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: userId,
        action: 'UPDATE',
        entity: 'User',
        entityId: userId,
        description: `User location updated to subCity: ${data.subCityId}, woreda: ${data.woredaId}`,
      },
    });

    return updatedUser;
  }
  /**
   * Load translations from JSON file
   * @param {string} lang - language code (e.g., 'en', 'am')
   * @param {string} key - translation key (e.g., 'reset_password')
   */
  async resetPassword(token, newPassword) {
    // Hash the incoming token to find the record
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new Error('Invalid or expired reset token');
    }

    const user = resetRecord.user;
    if (user.deletedAt || user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });

    // Delete any other unused tokens for this user (cleanup)
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: user.id,
        description: 'Password reset via forgot password flow',
      },
    });

    return { success: true, message: 'Password reset successfully.' };
  }
}
export default new AuthService();
