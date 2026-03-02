// modules/subcityAdmin/subcityAdminRoutes.js

import express from 'express';
import SubcityAdminController from './subcityAdminController.js';
import {
  loginValidator,
  createAdminValidator,
  createOfficerValidator,
  createFieldOfficerValidator,
} from './subcityAdminValidators.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { authorizeRoles } from '../../middlewares/authorizeRoles.js';

const router = express.Router();

// LOGIN
router.post('/login', loginValidator, validateRequest, SubcityAdminController.login);

// Protected routes
router.use(verifyToken, authorizeRoles('SUBCITY_ADMIN'));

// WOREDA ADMINS
router.post(
  '/woreda-admin',
  createAdminValidator,
  validateRequest,
  SubcityAdminController.createWoredaAdmin
);

router.get('/woreda-admin', SubcityAdminController.getWoredaAdmins);

router.get('/woreda-admin/:woredaId', SubcityAdminController.getWoredaAdminsByWoreda);

// BILLING OFFICER
router.post(
  '/billing-officer',
  createOfficerValidator,
  validateRequest,
  SubcityAdminController.createBillingOfficer
);

// COMPLAINT OFFICER
router.post(
  '/complaint-officer',
  createOfficerValidator,
  validateRequest,
  SubcityAdminController.createComplaintOfficer
);

// FIELD OFFICER
router.post(
  '/field-officer',
  createFieldOfficerValidator,
  validateRequest,
  SubcityAdminController.createFieldOfficer
);

// USERS
router.get('/users', SubcityAdminController.getUsers);

router.get('/users/:woredaId', SubcityAdminController.getUsersByWoreda);

export default router;
