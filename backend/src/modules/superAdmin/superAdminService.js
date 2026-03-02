import { prisma } from '../../src/utils/prismaClient.js';
import { hashPassword, comparePassword } from '../../src/utils/hashtoken.js';
import jwt from 'jsonwebtoken';

class SuperAdminService {
  // 1) Create SuperAdmin
  static async createSuperAdmin(data) {
    const existing = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN', phoneE164: data.phoneE164 },
    });
    if (existing) throw new Error('SuperAdmin already exists');

    const passwordHash = await hashPassword(data.password);
    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        nationalId: data.nationalId,
        role: 'SUPER_ADMIN',
        passwordHash,
        status: 'ACTIVE',
      },
    });
  }

  // 2) Login
  static async login(phoneOrEmail, password) {
    const user = await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
        OR: [{ phoneE164: phoneOrEmail }, { email: phoneOrEmail }],
      },
    });
    if (!user) throw new Error('SuperAdmin not found');

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
  }

  // 3) SubCity CRUD
  static async createSubCity(data) {
    return prisma.subCity.create({ data });
  }
  static async updateSubCity(id, data) {
    return prisma.subCity.update({ where: { id }, data });
  }
  static async deleteSubCity(id) {
    return prisma.subCity.delete({ where: { id } });
  }

  // 4) Woreda CRUD
  static async createWoreda(data) {
    return prisma.woreda.create({ data });
  }
  static async updateWoreda(id, data) {
    return prisma.woreda.update({ where: { id }, data });
  }
  static async deleteWoreda(id) {
    return prisma.woreda.delete({ where: { id } });
  }

  // 5) Get Admins
  static async getAllAdmins(role) {
    return prisma.user.findMany({ where: { role } });
  }
  static async getAdminsByLocation(subCityId, woredaId) {
    return prisma.user.findMany({ where: { subCityId, woredaId } });
  }

  // 6) Get Users
  static async getAllUsers() {
    return prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  }
  static async getUsersByLocation(subCityId, woredaId) {
    return prisma.user.findMany({ where: { role: 'CUSTOMER', subCityId, woredaId } });
  }
  // Create Admin
  static async createAdmin(data) {
    const { fullName, email, phone, password, role, subCityId, woredaId } = data;

    // Validate role
    if (!['SUBCITY_ADMIN', 'WOREDA_ADMINS'].includes(role)) {
      throw new Error('Invalid role');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    return prisma.user.create({
      data: {
        fullName,
        email,
        phoneE164: phone,
        passwordHash,
        role,
        subCityId: subCityId || null,
        woredaId: woredaId || null,
      },
    });
  }

  // Update Admin
  static async updateAdmin(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete Admin
  static async deleteAdmin(id) {
    // Cannot delete seeded superadmin
    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin) throw new Error('Admin not found');
    if (admin.role === 'SUPER_ADMIN' && !admin.canBeDeleted)
      throw new Error('Cannot delete seeded superadmin');

    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DEACTIVATED' },
    });
  }

  // Get Admins
  static async getAdmins({ role, subCityId, woredaId }) {
    const filters = { role, subCityId, woredaId, deletedAt: null };
    Object.keys(filters).forEach((key) => filters[key] === undefined && delete filters[key]);

    return prisma.user.findMany({ where: filters });
  }
  // Get Complaint Officers
  static async getComplaintOfficers({ subCityId, woredaId }) {
    return prisma.user.findMany({
      where: {
        role: {
          in: ['SUBCITY_COMPLAINT_OFFICER', 'WOREDA_COMPLAINT_OFFICER'],
        },
        ...(subCityId && { subCityId }),
        ...(woredaId && { woredaId }),
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        subCityId: true,
        woredaId: true,
      },
    });
  }
  static async getBillingOfficers({ subCityId, woredaId }) {
    return prisma.user.findMany({
      where: {
        role: {
          in: ['SUBCITY_BILLING_OFFICER', 'WOREDA_BILLING_OFFICER'],
        },
        ...(subCityId && { subCityId }),
        ...(woredaId && { woredaId }),
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        role: true,
        subCityId: true,
        woredaId: true,
      },
    });
  }
}

export default SuperAdminService;
