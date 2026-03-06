import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9_ ]+$/,
      "Name must contain only alphabets, numbers, underscores and spaces",
    ),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long"),
  email: z
    .email("Please enter valid email address")
    .trim()
    .max(255, "Email must be at most 255 characters long")
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
    ),
  role: z.enum(["applicant", "employer", "admin"]).default("applicant"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const registerWithConfirmSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterWithConfirmSchema = z.infer<
  typeof registerWithConfirmSchema
>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
