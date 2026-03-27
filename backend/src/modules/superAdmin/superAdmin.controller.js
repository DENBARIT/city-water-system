import * as service from "./superAdmin.service.js";

export const createSuperAdmin = async (req, res, next) => {
  try {
    await service.createSuperAdmin(req.body);
    res.status(201).json({ message: "Super admin created successfully." });
  } catch (err) {
    next(err);
  }
}

export const updateSuperAdmin = async (req, res, next) => {
  try {
    const admin = await service.updateSuperAdmin(req.params.id, req.body);
    res.json({
      message: "Super admin updated successfully.",
      data: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        nationalId: admin.nationalId,
        phoneE164: admin.phoneE164,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSuperAdmin = async (req, res, next) => {
  try {
    await service.deleteSuperAdmin(req.params.id);
    res.json({ message: "Super admin deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export const getSuperAdmins = async (req, res, next) => {
  try {
    const admins = await service.getAllSuperAdmins();
    res.json({
      message: "Super admins fetched successfully.",
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    next(err);
  }
};


export const createSubcityAdmin = async (req, res, next) => {
  try {
    const admin = await service.createSubcityAdmin(req.body);
    res.status(201).json({
      message: "Subcity admin created successfully.",
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSubcityAdmin = async (req, res, next) => {
  try {
    const admin = await service.updateSubcityAdmin(req.params.id, req.body);
    res.json({
      message: "Subcity admin updated successfully.",
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSubcityAdmin = async (req, res, next) => {
  try {
    await service.deleteSubcityAdmin(req.params.id);
    res.json({ message: "Subcity admin deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export const getSubcityAdmins = async (req, res, next) => {
  try {
    const admins = await service.getSubcityAdmins();
    res.json({
      message: "Subcity admins fetched successfully.",
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    next(err);
  }
};

export const getSubcityAdminsBySubcity = async (req, res, next) => {
  try {
    const admins = await service.getSubcityAdminsBySubcity(req.params.subcityId);
    res.json({
      message: "Subcity admins fetched successfully.",
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await service.getUsers();
    res.json({
      message: "Users fetched successfully.",
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersByLocation = async (req, res, next) => {
  try {
    const { subcityId, woredaId } = req.query;
    const users = await service.getUsersByLocation(subcityId, woredaId);
    res.json({
      message: "Users fetched successfully.",
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getBillingReports = async (req, res, next) => {
  try {
    const reports = await service.getBillingReports();
    res.json({
      message: "Billing reports fetched successfully.",
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};

export const setTariff = async (req, res, next) => {
  try {
    const tariff = await service.setTariff(req.body.pricePerM3, req.body.effectiveFrom);
    res.status(201).json({
      message: "Tariff set successfully.",
      data: tariff,
    });
  } catch (err) {
    next(err);
  }
};


export const getEffectiveTariff = async (req, res, next) => {
  try {
    const tariff = await service.getEffectiveTariff();

    if (!tariff) {
      return res.status(404).json({ message: "No active tariff found." });
    }

    res.json({
      message: "Effective tariff fetched successfully.",
      data: tariff,
    });
  } catch (err) {
    next(err);
  }
};