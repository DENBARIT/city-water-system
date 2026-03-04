import { body } from 'express-validator';

export const registerValidation = [
  body('fullName')
    .notEmpty().withMessage('Full name is required.')
    .custom(value => {
      if (value.trim().split(' ').length < 2) {
        throw new Error('Full name must include both first and last name.');
      }
      return true;
    }),
  
  body('phoneE164')
    .notEmpty().withMessage('Phone number is required (include country code, e.g., +251912345678).'),
  
  body('email')
    .isEmail().withMessage('A valid email address is required.'),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/\d/).withMessage('Password must contain at least one number.')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@, $, !, %, *, ?, &).'),
  
  body('nationalId')
    .notEmpty().withMessage('National ID is required.'),
  
  body('meterNumber')
    .notEmpty().withMessage('Meter number is required.'),
  
  body('subCityId')
    .notEmpty().withMessage('SubCity selection is required.'),
  
  body('woredaId')
    .notEmpty().withMessage('Woreda selection is required.'),
];

export const loginValidation = [
  body("emailOrPhone")
    .notEmpty().withMessage("Email or Phone is required.")
    .custom(value => {
      // Check if value is a valid email or E.164 phone number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+\d{10,15}$/;
      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error("Must be a valid email or phone number (E.164 format, e.g., +251912345678).");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required.")
];

export const otpValidation = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('otp').notEmpty().withMessage('OTP is required.'),
];

export const resendOtpValidation = [
  body('email').isEmail().withMessage('A valid email is required.'),    
]

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('A valid email is required.'),
];

export const resetPasswordValidation = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('otp').notEmpty().withMessage('OTP is required.'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
];

export const getNewTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
];