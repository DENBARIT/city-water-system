import * as authService from './auth.service.js';
import { validationResult } from 'express-validator';

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Group all messages per field
    const groupedErrors = {};
    errors.array().forEach(err => {
      if (!groupedErrors[err.param]) {
        groupedErrors[err.param] = [];
      }
      groupedErrors[err.param].push(err.msg);
    });

    // Convert to array of objects: [{ field, messages: [...] }]
    const formattedErrors = Object.keys(groupedErrors).map(field => ({
      field,
      messages: groupedErrors[field]
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed. Please correct the errors below.',
      errors: formattedErrors
    });
  }

  try {
    const user = await authService.registerUser(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully. OTP has been sent to your email.',
      userId: user.id
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const tokens = await authService.loginUser(req.body);
    res.json(tokens);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



export async function validateOtpController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, otp } = req.body;
    const result = await authService.validateOtp(email, otp);
    return res.status(200).json(result);

  } catch (error) {
    const statusMap = {
      'User not found': 404,
      'Email already verified': 400,
      'No OTP found, request a new one': 400,
      'OTP expired': 400,
      'Invalid OTP': 400,
    };

    const status = statusMap[error.message] || 500;
    return res.status(status).json({ message: error.message });
  }
}




export async function resendOtpController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const result = await authService.resendOtp(email);
    return res.status(200).json(result);

  } catch (error) {
    const statusMap = {
      'User not found': 404,
      'Email already verified': 400,
    };

    const status = statusMap[error.message] || 500;
    return res.status(status).json({ message: error.message });
  }
}



export async function forgotPasswordController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.status(200).json(result);

  } catch (error) {
    const statusMap = {
      'User not found': 404,
      'Email not verified': 400,
    };

    const status = statusMap[error.message] || 500;
    return res.status(status).json({ message: error.message });
  }
}

export async function resetPasswordController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword({ email, otp, newPassword });
    return res.status(200).json(result);

  } catch (error) {
    const statusMap = {
      'User not found': 404,
      'No OTP found, request a new one': 400,
      'OTP expired': 400,
      'Invalid OTP': 400,
    };

    const status = statusMap[error.message] || 500;
    return res.status(status).json({ message: error.message });
  }
}

export async function getNewTokenController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { refreshToken } = req.body;
    const result = await authService.getNewToken(refreshToken);
    return res.status(200).json(result);

  } catch (error) {
    const statusMap = {
      'Invalid or expired refresh token': 401,
      'User not found': 404,
    };

    const status = statusMap[error.message] || 500;
    return res.status(status).json({ message: error.message });
  }
}