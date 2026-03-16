import * as service from './subcityAdmin.service.js';

// ─── Woreda Admin ─────────────────────────────────────────────────────────────

export const createWoredaAdmin = async (req, res, next) => {
  try {
    const admin = await service.createWoredaAdmin(
      req.body,
      req.user.id,
      req.user.subCityId
    );
    res.status(201).json({
      message: 'Woreda admin created successfully.',
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllWoredaAdmins = async (req, res, next) => {
  try {
    const admins = await service.getAllWoredaAdmins(req.user.subCityId);
    res.json({
      message: 'Woreda admins fetched successfully.',
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    next(err);
  }
};

export const getWoredaAdminById = async (req, res, next) => {
  try {
    const admin = await service.getWoredaAdminById(
      req.params.id,
      req.user.subCityId
    );
    res.json({
      message: 'Woreda admin fetched successfully.',
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const updateWoredaAdmin = async (req, res, next) => {
  try {
    const admin = await service.updateWoredaAdmin(
      req.params.id,
      req.body,
      req.user.subCityId
    );
    res.json({
      message: 'Woreda admin updated successfully.',
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteWoredaAdmin = async (req, res, next) => {
  try {
    await service.deleteWoredaAdmin(req.params.id, req.user.subCityId);
    res.json({ message: 'Woreda admin deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// ─── Schedule ─────────────────────────────────────────────────────────────────

export const createSchedule = async (req, res, next) => {
  try {
    const schedule = await service.createSchedule(
      req.body,
      req.user.id,
      req.user.subCityId
    );
    res.status(201).json({
      message: 'Schedule created successfully.',
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await service.getAllSchedules(req.user.subCityId);
    res.json({
      message: 'Schedules fetched successfully.',
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

export const getSchedulesByWoreda = async (req, res, next) => {
  try {
    const schedules = await service.getSchedulesByWoreda(
      req.params.woredaId,
      req.user.subCityId
    );
    res.json({
      message: 'Schedules fetched successfully.',
      count: schedules.length,
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await service.updateSchedule(
      req.params.id,
      req.body,
      req.user.id,
      req.user.subCityId
    );
    res.json({
      message: 'Schedule updated successfully.',
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    await service.deleteSchedule(req.params.id, req.user.subCityId);
    res.json({ message: 'Schedule deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// ─── Users & Reports ──────────────────────────────────────────────────────────

export const getUsersBySubcity = async (req, res, next) => {
  try {
    const users = await service.getUsersBySubcity(req.user.subCityId);
    res.json({
      message: 'Users fetched successfully.',
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersByWoreda = async (req, res, next) => {
  try {
    const users = await service.getUsersByWoreda(
      req.params.woredaId,
      req.user.subCityId
    );
    res.json({
      message: 'Users fetched successfully.',
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getBillingReportBySubcity = async (req, res, next) => {
  try {
    const report = await service.getBillingReportBySubcity(req.user.subCityId);
    res.json({
      message: 'Billing report fetched successfully.',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};