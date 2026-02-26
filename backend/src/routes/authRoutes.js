import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authenticate } from '../middleware/authMiddleware.js'; // your auth middleware

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new customer
 * @access Public
 */
router.post('/register', AuthController.register);

/**
 * @route POST /api/auth/login
 * @desc Login with phone and password
 * @access Public
 */
router.post('/login', AuthController.login);

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user profile
 * @access Private
 */
router.get('/me', authenticate, AuthController.getMe);

/**
 * @route PUT /api/auth/change-password
 * @desc Change password for authenticated user
 * @access Private
 */
router.put('/change-password', authenticate, AuthController.changePassword);

/**
 * @route PUT /api/auth/update-location
 * @desc Update user's subCity and woreda (requires password confirmation)
 * @access Private
 */
router.put('/update-location', authenticate, AuthController.updateLocation);

export default router;
