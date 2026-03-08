import { z } from "zod";

const fullNameSchema = z
  .string()
  .min(2)
  .max(100)
  .refine((val) => val.trim().split(/\s+/).length >= 2, {
    message: "Full name must include both first and last name.",
  });

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter." })
  .refine((val) => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter." })
  .refine((val) => /[0-9]/.test(val), { message: "Password must contain at least one number." })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), { message: "Password must contain at least one special character." });

const phoneNumberSchema = z
  .string()
  .regex(/^\+251\d{9}$/, {
    message: "Phone number must start with +251 and be followed by 9 digits.",
  })

const nationalIdSchema = z
  .string()
  .length(14, "National ID must be exactly 14 characters.");

export const createSuperAdminSchema = z.object({
  email: z.string().email("A valid email is required."),
  phoneNumber: phoneNumberSchema,
  fullName: fullNameSchema,
  nationalId: nationalIdSchema,
  password: passwordSchema,
});

export const updateSuperAdminSchema = z.object({
  email: z.string().email("A valid email is required.").optional(),
  phoneNumber: phoneNumberSchema.optional(),
  fullName: fullNameSchema.optional(),
  nationalId: nationalIdSchema.optional(),
});

export const createSubcityAdminSchema = z.object({
  email: z.string().email("A valid email is required."),
  phoneNumber: phoneNumberSchema,
  fullName: fullNameSchema,
  nationalId: nationalIdSchema,
  password: passwordSchema,
  subcityId: z.string().min(1, "Subcity ID is required."),
});

export const updateSubcityAdminSchema = z.object({
  email: z.string().email("A valid email is required.").optional(),
  fullName: fullNameSchema.optional(),
  nationalId: nationalIdSchema.optional(),
  phoneNumber: phoneNumberSchema.optional(),
  subcityId: z.string().min(1, "Subcity ID is required.").optional(),
});

export const tariffSchema = z.object({
  pricePerM3: z.number().positive("Price per m³ must be a positive number."),
  effectiveFrom: z.string().datetime("effectiveFrom must be a valid ISO datetime string."),
});