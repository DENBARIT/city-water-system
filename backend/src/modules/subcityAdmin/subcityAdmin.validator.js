import { z } from 'zod';

const fullNameSchema = z
  .string()
  .min(2)
  .max(100)
  .refine((val) => val.trim().split(/\s+/).length >= 2, {
    message: 'Full name must include both first and last name.',
  });

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .refine((val) => /[A-Z]/.test(val), { message: 'Must contain an uppercase letter.' })
  .refine((val) => /[a-z]/.test(val), { message: 'Must contain a lowercase letter.' })
  .refine((val) => /[0-9]/.test(val), { message: 'Must contain a number.' })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
    message: 'Must contain a special character.',
  });

const phoneNumberSchema = z
  .string()
  .refine((val) => /^\+2519\d{8}$/.test(val), {
    message: 'Phone number must start with +2519 and be 13 digits total.',
  });

const nationalIdSchema = z
  .string()
  .length(14, 'National ID must be exactly 14 characters.');

// ─── Woreda Admin ────────────────────────────────────────────────────────────

export const createWoredaAdminSchema = z.object({
  fullName: fullNameSchema,
  email: z.string().email('A valid email is required.'),
  phoneNumber: phoneNumberSchema,
  nationalId: nationalIdSchema,
  password: passwordSchema,
  woredaId: z.string().min(1, 'Woreda ID is required.'),
});

export const updateWoredaAdminSchema = z.object({
  fullName: fullNameSchema.optional(),
  email: z.string().email('A valid email is required.').optional(),
  phoneNumber: phoneNumberSchema.optional(),
  nationalId: nationalIdSchema.optional(),
  woredaId: z.string().min(1, 'Woreda ID is required.').optional(),
});

// ─── Schedule ────────────────────────────────────────────────────────────────

export const createScheduleSchema = z.object({
  woredaId: z.string().min(1, 'Woreda ID is required.'),
  day: z.enum(
    ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    { message: 'Invalid day of week.' }
  ),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format.'),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format.'),
  note: z.string().max(255).optional(),
}).refine((val) => val.startTime < val.endTime, {
  message: 'End time must be after start time.',
  path: ['endTime'],
});

export const updateScheduleSchema = z.object({
  day: z.enum(
    ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    { message: 'Invalid day of week.' }
  ).optional(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format.')
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format.')
    .optional(),
  note: z.string().max(255).optional(),
});