import express from 'express';
import SuperAdminController from './superAdminController.js';

const router = express.Router();

// SuperAdmin management
router.post('/create', SuperAdminController.createSuperAdmin);
router.post('/login', SuperAdminController.login);

// SubCity
router.post('/subcities', SuperAdminController.createSubCity);
router.put('/subcities/:id', SuperAdminController.updateSubCity);
router.delete('/subcities/:id', SuperAdminController.deleteSubCity);

// Woreda
router.post('/woredas', SuperAdminController.createWoreda);
router.put('/woredas/:id', SuperAdminController.updateWoreda);
router.delete('/woredas/:id', SuperAdminController.deleteWoreda);

// Admins
router.get('/admins', SuperAdminController.getAllAdmins);
router.get('/admins/location', SuperAdminController.getAdminsByLocation);

// Users
router.get('/users', SuperAdminController.getAllUsers);
router.get('/users/location', SuperAdminController.getUsersByLocation);
// CRUD for SubCity/Woreda admins
router.post('/admin', validateAdmin, SuperAdminController.createAdmin);
router.put('/admin/:id', validateAdmin, SuperAdminController.updateAdmin);
router.delete('/admin/:id', SuperAdminController.deleteAdmin);
router.get('/admins', SuperAdminController.getAdmins);

export default router;
