import { Router } from 'express';
import * as controller from './subcityAdmin.controller.js';
import * as validation from './subcityAdmin.validator.js';
import { allowRoles } from "../../middlewares/role.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.use(authMiddleware, allowRoles('SUBCITY_ADMIN'));

// ─── Woreda Admin ─────────────────────────────────────────────────────────────
router.post('/woreda-admins', validate(validation.createWoredaAdminSchema), controller.createWoredaAdmin);
router.get('/woreda-admins', controller.getAllWoredaAdmins);
router.get('/woreda-admins/:id', controller.getWoredaAdminById);
router.patch('/woreda-admins/:id', validate(validation.updateWoredaAdminSchema), controller.updateWoredaAdmin);
router.delete('/woreda-admins/:id', controller.deleteWoredaAdmin);

// ─── Schedule ─────────────────────────────────────────────────────────────────
router.post('/schedules', validate(validation.createScheduleSchema), controller.createSchedule);
router.get('/schedules', controller.getAllSchedules);
router.get('/schedules/woreda/:woredaId', controller.getSchedulesByWoreda);
router.patch('/schedules/:id', validate(validation.updateScheduleSchema), controller.updateSchedule);
router.delete('/schedules/:id', controller.deleteSchedule);

// ─── Users ────────────────────────────────────────────────────────────────────
router.get('/users', controller.getUsersBySubcity);
router.get('/users/woreda/:woredaId', controller.getUsersByWoreda);

// ─── Reports ──────────────────────────────────────────────────────────────────
router.get('/reports/billing', controller.getBillingReportBySubcity);

export default router;