// import Joi from 'joi';
// import { body } from 'express-validator';
// export const validateCreateSuperAdmin = (data) => {
//   const schema = Joi.object({
//     fullName: Joi.string().min(3).required(),
//     phoneE164: Joi.string()
//       .pattern(/^\+251\d{9}$/)
//       .required(),
//     email: Joi.string().email().required(),
//     nationalId: Joi.string().required(),
//     password: Joi.string().min(8).required(),
//   });
// };
// export const validateAdmin = [
//   body('fullName').notEmpty().withMessage('Full name required'),
//   body('email').isEmail().withMessage('Valid email required'),
//   body('phone').notEmpty().withMessage('Phone required'),
//   body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
//   body('role').notEmpty().withMessage('Role required'),
// ];
// return schema.validate(data);
