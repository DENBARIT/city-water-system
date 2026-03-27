import prisma from '../../config/db.js';
import { AppError } from "../../utils/ApiError.js";
import bcrypt from 'bcrypt';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const woreda_admin_select = {
  id: true,
  fullName: true,
  email: true,
  phoneE164: true,
  nationalId: true,
  role: true,
  status: true,
  createdAt: true,
  woreda: {
    select: { id: true, name: true },
  },
  subCity: {
    select: { id: true, name: true },
  },
};

const schedule_select = {
  id: true,
  day: true,
  startTime: true,
  endTime: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  woreda: {
    select: { id: true, name: true },
  },
  createdBy: {
    select: { id: true, fullName: true },
  },
  updatedBy: {
    select: { id: true, fullName: true },
  },
};

const user_select = {
  id: true,
  fullName: true,
  email: true,
  phoneE164: true,
  nationalId: true,
  role: true,
  status: true,
  createdAt: true,
  woreda: {
    select: { id: true, name: true },
  },
  subCity: {
    select: { id: true, name: true },
  },
  meter: {
    select: { id: true, meterNumber: true },
  },
};

// ─── Guard: ensure woreda belongs to subcity admin's subcity ─────────────────

const ensureWoredaBelongsToSubcity = async (woredaId, subCityId) => {
  const woreda = await prisma.woreda.findFirst({
    where: { id: woredaId, subCityId },
  });
  if (!woreda) throw new AppError('Woreda does not belong to your subcity.', 403);
  return woreda;
};

// ─── Woreda Admin Management ─────────────────────────────────────────────────

export const createWoredaAdmin = async (data, subcityAdminId, subCityId) => {
  await ensureWoredaBelongsToSubcity(data.woredaId, subCityId);

  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) throw new AppError('Email already exists.');

  const existingPhone = await prisma.user.findUnique({ where: { phoneE164: data.phoneNumber } });
  if (existingPhone) throw new AppError('Phone number already exists.');

  const existingNationalId = await prisma.user.findUnique({ where: { nationalId: data.nationalId } });
  if (existingNationalId) throw new AppError('National ID already exists.');

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phoneE164: data.phoneNumber,
      nationalId: data.nationalId,
      passwordHash,
      emailVerified: true,
      role: 'WOREDA_ADMIN',
      subCity: { connect: { id: subCityId } },
      woreda: { connect: { id: data.woredaId } },
    },
    select: woreda_admin_select,
  });
};

export const getAllWoredaAdmins = async (subCityId) => {
  return prisma.user.findMany({
    where: { role: 'WOREDA_ADMIN', subCityId },
    select: woreda_admin_select,
    orderBy: { createdAt: 'desc' },
  });
};

export const getWoredaAdminById = async (id, subCityId) => {
  const admin = await prisma.user.findFirst({
    where: { id, role: 'WOREDA_ADMIN', subCityId },
    select: woreda_admin_select,
  });
  if (!admin) throw new AppError('Woreda admin not found.', 404);
  return admin;
};

export const updateWoredaAdmin = async (id, data, subCityId) => {
  const admin = await prisma.user.findFirst({
    where: { id, role: 'WOREDA_ADMIN', subCityId },
  });
  if (!admin) throw new AppError('Woreda admin not found.', 404);

  if (data.woredaId) {
    await ensureWoredaBelongsToSubcity(data.woredaId, subCityId);
  }

  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (existing) throw new AppError('Email already in use.');
  }

  if (data.phoneNumber) {
    const existing = await prisma.user.findFirst({
      where: { phoneE164: data.phoneNumber, NOT: { id } },
    });
    if (existing) throw new AppError('Phone number already in use.');
  }

  if (data.nationalId) {
    const existing = await prisma.user.findFirst({
      where: { nationalId: data.nationalId, NOT: { id } },
    });
    if (existing) throw new AppError('National ID already in use.');
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.email && { email: data.email }),
      ...(data.phoneNumber && { phoneE164: data.phoneNumber }),
      ...(data.nationalId && { nationalId: data.nationalId }),
      ...(data.woredaId && { woreda: { connect: { id: data.woredaId } } }),
    },
    select: woreda_admin_select,
  });
};

export const deleteWoredaAdmin = async (id, subCityId) => {
  const admin = await prisma.user.findFirst({
    where: { id, role: 'WOREDA_ADMIN', subCityId },
  });
  if (!admin) throw new AppError('Woreda admin not found.', 404);
  return prisma.user.delete({ where: { id } });
};

// ─── Schedule Management ─────────────────────────────────────────────────────

export const createSchedule = async (data, subcityAdminId, subCityId) => {
  await ensureWoredaBelongsToSubcity(data.woredaId, subCityId);

  const existing = await prisma.schedule.findFirst({
    where: { woredaId: data.woredaId, day: data.day },
  });
  if (existing) throw new AppError(`A schedule for ${data.day} already exists for this woreda.`);

  return prisma.schedule.create({
    data: {
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      note: data.note,
      woreda: { connect: { id: data.woredaId } },
      createdBy: { connect: { id: subcityAdminId } },
    },
    select: schedule_select,
  });
};

export const getAllSchedules = async (subCityId) => {
  return prisma.schedule.findMany({
    where: { woreda: { subCityId } },
    select: schedule_select,
    orderBy: { day: 'asc' },
  });
};

export const getSchedulesByWoreda = async (woredaId, subCityId) => {
  await ensureWoredaBelongsToSubcity(woredaId, subCityId);
  return prisma.schedule.findMany({
    where: { woredaId },
    select: schedule_select,
    orderBy: { day: 'asc' },
  });
};

export const updateSchedule = async (id, data, subcityAdminId, subCityId) => {
  const schedule = await prisma.schedule.findFirst({
    where: { id, woreda: { subCityId } },
  });
  if (!schedule) throw new AppError('Schedule not found.', 404);

  if (data.day && data.day !== schedule.day) {
    const existing = await prisma.schedule.findFirst({
      where: { woredaId: schedule.woredaId, day: data.day, NOT: { id } },
    });
    if (existing) throw new AppError(`A schedule for ${data.day} already exists for this woreda.`);
  }

  return prisma.schedule.update({
    where: { id },
    data: {
      ...(data.day && { day: data.day }),
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime && { endTime: data.endTime }),
      ...(data.note !== undefined && { note: data.note }),
      updatedBy: { connect: { id: subcityAdminId } },
    },
    select: schedule_select,
  });
};

export const deleteSchedule = async (id, subCityId) => {
  const schedule = await prisma.schedule.findFirst({
    where: { id, woreda: { subCityId } },
  });
  if (!schedule) throw new AppError('Schedule not found.', 404);
  return prisma.schedule.delete({ where: { id } });
};

// ─── Users & Reports ─────────────────────────────────────────────────────────

export const getUsersBySubcity = async (subCityId) => {
  return prisma.user.findMany({
    where: { role: 'CUSTOMER', subCityId },
    select: user_select,
    orderBy: { createdAt: 'desc' },
  });
};

export const getUsersByWoreda = async (woredaId, subCityId) => {
  await ensureWoredaBelongsToSubcity(woredaId, subCityId);
  return prisma.user.findMany({
    where: { role: 'CUSTOMER', woredaId },
    select: user_select,
    orderBy: { createdAt: 'desc' },
  });
};

export const getBillingReportBySubcity = async (subCityId) => {
  const woredas = await prisma.woreda.findMany({
    where: { subCityId },
    select: { id: true, name: true },
  });

  const report = await Promise.all(
    woredas.map(async (woreda) => {
      const bills = await prisma.bill.findMany({
        where: { customer: { woredaId: woreda.id } },
        select: {
          id: true,
          amount: true,
          consumption: true,
          status: true,
        },
      });

      const totalBills = bills.length;
      const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
      const totalConsumption = bills.reduce((sum, b) => sum + b.consumption, 0);
      const paidBills = bills.filter((b) => b.status === 'PAID').length;
      const unpaidBills = bills.filter((b) => b.status === 'UNPAID').length;

      return {
        woreda: woreda.name,
        woredaId: woreda.id,
        totalBills,
        totalAmount,
        totalConsumption,
        paidBills,
        unpaidBills,
      };
    })
  );

  return report;
};