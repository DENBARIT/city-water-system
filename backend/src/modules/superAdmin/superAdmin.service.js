import prisma from '../../config/db.js';
import bcrypt from "bcrypt";
import { AppError } from "../../utils/ApiError.js";

export const createSuperAdmin = async (data) => {
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) throw new AppError("Email already exists.");

  const existingPhone = await prisma.user.findUnique({ where: { phoneE164: data.phoneNumber } });
  if (existingPhone) throw new AppError("Phone number already exists.");

  const existingNationalId = await prisma.user.findUnique({ where: { nationalId: data.nationalId } });
  if (existingNationalId) throw new AppError("National ID already exists.");

  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      nationalId: data.nationalId,
      phoneE164: data.phoneNumber,
      passwordHash: hashed,
      role: "SYSTEM_ADMIN",
    },
  });
};


export const updateSuperAdmin = async (id, data) => {
  const admin = await prisma.user.findUnique({ where: { id } });
  if (!admin || admin.role !== "SYSTEM_ADMIN") {
    throw new AppError("Super admin not found.", 404);
  }

  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id } }
    });
    if (existing) throw new AppError("Email already in use by another user.");
  }

  if (data.phoneNumber) {
    const existing = await prisma.user.findFirst({
      where: { phoneE164: data.phoneNumber, NOT: { id } }
    });
    if (existing) throw new AppError("Phone number already in use by another user.");
  }

  if (data.nationalId) {
    const existing = await prisma.user.findFirst({
      where: { nationalId: data.nationalId, NOT: { id } }
    });
    if (existing) throw new AppError("National ID already in use by another user.");
  }

  return prisma.user.update({
    where: { id },
    data
  });
};



export const deleteSuperAdmin = async (id) => {
  const admin = await prisma.user.findUnique({ where: { id } });
  if (!admin || admin.role !== "SYSTEM_ADMIN") {
    throw new AppError("Super admin not found.", 404);
  }
  return prisma.user.delete({
    where: { id }
  });
};


export const getAllSuperAdmins = async () => {
  return prisma.user.findMany({
    where: { role: "SYSTEM_ADMIN" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
    },
  });
};


export const createSubcityAdmin = async (data) => {
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) throw new AppError("Email already exists.");

  const existingPhone = await prisma.user.findUnique({ where: { phoneE164: data.phoneNumber } });
  if (existingPhone) throw new AppError("Phone number already exists.");

  const existingNationalId = await prisma.user.findUnique({ where: { nationalId: data.nationalId } });
  if (existingNationalId) throw new AppError("National ID already exists.");

  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      nationalId: data.nationalId,
      phoneE164: data.phoneNumber,
      passwordHash: hashed,
      role: "SUBCITY_ADMIN",
      subCity: { connect: { id: data.subcityId } }
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
      subCity: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });
};

export const updateSubcityAdmin = async (id, data) => {
  const admin = await prisma.user.findUnique({ where: { id } });
  if (!admin || admin.role !== "SUBCITY_ADMIN") {
    throw new AppError("Subcity admin not found.", 404);
  }

  if (data.email) {
    const existing = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } } });
    if (existing) throw new AppError("Email already in use by another user.");
  }

  if (data.phoneNumber) {
    const existing = await prisma.user.findFirst({ where: { phoneE164: data.phoneNumber, NOT: { id } } });
    if (existing) throw new AppError("Phone number already in use by another user.");
  }

  if (data.nationalId) {
    const existing = await prisma.user.findFirst({ where: { nationalId: data.nationalId, NOT: { id } } });
    if (existing) throw new AppError("National ID already in use by another user.");
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.email && { email: data.email }),
      ...(data.phoneNumber && { phoneE164: data.phoneNumber }),
      ...(data.nationalId && { nationalId: data.nationalId }),
      ...(data.subcityId && { subCity: { connect: { id: data.subcityId } } }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
      subCity: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteSubcityAdmin = async (id) => {
  return prisma.user.delete({ where: { id } });
};

export const getSubcityAdmins = async () => {
  return prisma.user.findMany({
    where: { role: "SUBCITY_ADMIN" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
      subCity: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getSubcityAdminsBySubcity = async (subcityId) => {
  return prisma.user.findMany({
    where: {
      role: "SUBCITY_ADMIN",
      subCity: { id: subcityId },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
      subCity: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
      subCity: {
        select: {
          id: true,
          name: true,
        },
      },
      woreda: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getUsersByLocation = async (subcityId, woredaId) => {
  return prisma.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(subcityId && { subCity: { id: subcityId } }),
      ...(woredaId && { woreda: { id: woredaId } }),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneE164: true,
      nationalId: true,
      role: true,
      subCity: {
        select: {
          id: true,
          name: true,
        },
      },
      woreda: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getBillingReports = async () => {
  return prisma.bill.groupBy({
    by: ["subcityId"],
    _sum: {
      amount: true,
      consumption: true,
    },
  });
};

export const setTariff = async (pricePerM3, effectiveFrom) => {
  return prisma.tariff.create({
    data: {
      pricePerCubicMeter: pricePerM3,
      effectiveFrom: new Date(effectiveFrom),
    },
    select: {
      id: true,
      pricePerCubicMeter: true,
      effectiveFrom: true,
      createdAt: true,
    },
  });
};

export const getEffectiveTariff = async () => {
  return prisma.tariff.findFirst({
    where: { effectiveFrom: { lte: new Date() } },
    orderBy: { effectiveFrom: "desc" },
    select: {
      id: true,
      pricePerCubicMeter: true,
      effectiveFrom: true,
      createdAt: true,
    },
  });
};