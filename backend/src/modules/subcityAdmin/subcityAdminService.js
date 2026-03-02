import { prisma } from '../../config/db.js';
import { comparePassword, hashPassword } from '../../utils/hashtoken.js';
import jwt from 'jsonwebtoken';

class SubcityAdminService {
  // SubcityAdmin LOGIN
  static async login(identifier, password) {
    const admin = await prisma.user.findFirst({
      where: {
        role: 'SUBCITY_ADMIN',
        deletedAt: null,
        status: 'ACTIVE',
        OR: [{ email: identifier }, { phoneE164: identifier }],
      },
    });

    if (!admin) throw new Error('SubCity admin not found');

    const match = await comparePassword(password, admin.passwordHash);
    if (!match) throw new Error('Invalid credentials');

    return jwt.sign(
      {
        userId: admin.id,
        role: admin.role,
        subCityId: admin.subCityId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
  }
  // Create Woreda Admin
  static async createWoredaAdmin(data, subCityId) {
    const hashed = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        nationalId: data.nationalId,
        passwordHash: hashed,
        role: 'WOREDA_ADMINS',
        subCityId,
        woredaId: data.woredaId,
      },
    });
  }
  // Get Woreda Admins by SubCity
  static async getWoredaAdmins(subCityId) {
    return prisma.user.findMany({
      where: {
        role: 'WOREDA_ADMINS',
        subCityId,
        deletedAt: null,
      },
    });
  }
  // Get Woreda Admins by Woreda
  static async getWoredaAdminsByWoreda(subCityId, woredaId) {
    return prisma.user.findMany({
      where: {
        role: 'WOREDA_ADMINS',
        subCityId,
        woredaId,
        deletedAt: null,
      },
    });
  }
  // Create SubCity Billing Officer
  static async createSubcityBillingOfficer(data, subCityId, adminId) {
    const hashed = await hashPassword(data.password);

    const officer = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        nationalId: data.nationalId,
        passwordHash: hashed,
        role: 'SUBCITY_BILLING_OFFICER',
        subCityId,
      },
    });

    await prisma.billingOfficerAssignment.create({
      data: {
        subCityId,
        officerId: officer.id,
        isSubCityLevel: true,
        assignedById: adminId,
      },
    });

    return officer;
  }
  // Create SubCity Complaint Officer
  static async createSubcityComplaintOfficer(data, subCityId, adminId) {
    const hashed = await hashPassword(data.password);

    const officer = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        nationalId: data.nationalId,
        passwordHash: hashed,
        role: 'SUBCITY_COMPLAINT_OFFICER',
        subCityId,
      },
    });

    await prisma.complaintOfficerAssignment.create({
      data: {
        subCityId,
        officerId: officer.id,
        isSubCityLevel: true,
        assignedById: adminId,
      },
    });

    return officer;
  }
  // create field officer
  static async createFieldOfficer(data, subCityId, adminId) {
    const hashed = await hashPassword(data.password);

    const officer = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        nationalId: data.nationalId,
        passwordHash: hashed,
        role: 'FIELD_OFFICER',
        fieldOfficerType: data.fieldOfficerType,
        subCityId,
      },
    });

    await prisma.fieldOfficerWoredaAssignment.create({
      data: {
        subCityId,
        woredaId: data.woredaId,
        officerId: officer.id,
        assignedById: adminId,
      },
    });

    return officer;
  }
  // GET USERS BY subcity
  static async getUsers(subCityId) {
    return prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        subCityId,
        deletedAt: null,
      },
    });
  }
  // GET USERS BY WOREDA
  static async getUsersByWoreda(subCityId, woredaId) {
    return prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        subCityId,
        woredaId,
        deletedAt: null,
      },
    });
  }
}

export default SubcityAdminService;
