import express from 'express';
import * as authController from './auth.controller.js';
import { registerValidation, loginValidation, otpValidation,getNewTokenValidation, forgotPasswordValidation,resendOtpValidation, resetPasswordValidation } from './auth.validation.js';

const router = express.Router();

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/validate-otp', otpValidation, authController.validateOtpController);
router.post('/resend-otp', resendOtpValidation, authController.resendOtpController);
//Password
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPasswordController);
router.post('/reset-password', resetPasswordValidation, authController.resetPasswordController);

// Token
router.post('/refresh-token', getNewTokenValidation, authController.getNewTokenController);

export default router;