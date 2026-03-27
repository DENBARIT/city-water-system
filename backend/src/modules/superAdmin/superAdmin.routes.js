import { Router } from "express";
import * as controller from "./superAdmin.controller.js";
import * as validation from "./superAdmin.validator.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
const router = Router();

router.use(authMiddleware, allowRoles("SYSTEM_ADMIN"));

// Super Admin
router.post("/create", validate(validation.createSuperAdminSchema), controller.createSuperAdmin);
router.patch("/update/:id", validate(validation.updateSuperAdminSchema), controller.updateSuperAdmin);
router.delete("/delete/:id", controller.deleteSuperAdmin);
router.get("/getAll", controller.getSuperAdmins);

// Subcity Admin
router.post("/create-subcity-admin", validate(validation.createSubcityAdminSchema), controller.createSubcityAdmin);
router.patch("/update-subcity-admin/:id", validate(validation.updateSubcityAdminSchema), controller.updateSubcityAdmin);
router.delete("/delete-subcity-admin/:id", controller.deleteSubcityAdmin);
router.get("/get-subcity-admins", controller.getSubcityAdmins);
router.get("/get-subcity-admins/subcity/:subcityId", controller.getSubcityAdminsBySubcity);

// Users
router.get("/users", controller.getUsers);
router.get("/users/location", controller.getUsersByLocation);

// Billing
router.get("/billing-reports", controller.getBillingReports);

// Tariff
router.post("/tariff", validate(validation.tariffSchema), controller.setTariff);
router.get("/tariff/effective", controller.getEffectiveTariff);
export default router;