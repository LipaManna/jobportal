import { z } from "zod";

export const org_types_schema = z.enum([
  "Private",
  "Public",
  "Government",
  "Non-profit",
  "Startup",
  "Other",
]);
export const team_size_schema = z.enum([
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001+",
]);

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const employerProfilSchema = z.object({
    image: z
    .any()
    .refine((file) => file instanceof File || typeof file === "string", "Image is required.")
    .refine((file) => {
      // If it's an existing string (from DB), it's valid
      if (typeof file === "string") return true;
      // Otherwise, validate the File object
      return file?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine((file) => {
      if (typeof file === "string") return true;
      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),

    username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9_ ]+$/,
      "Username must contain only alphabets, numbers, underscores and spaces",
    ),
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters long")
    .max(255, "Company name must not exceed 255 characters"),
    email: z
    .string()
    .email("Please enter valid email address")
    .trim()
    .max(255, "Email must be at most 255 characters long")
    .toLowerCase(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description must not exceed 2000 characters"),
  yearOfEstablishment: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Year of establishment must be a 4-digit number")
    .refine((value) => {
      const year = parseInt(value, 10);
      const currentYear = new Date().getFullYear();
      return year >= 1800 && year <= currentYear;
    }, "Year of establishment must be between 1800 and the current year"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters long")
    .max(255, "Location must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(255, "Website URL must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  orgType: org_types_schema,
  teamSize: team_size_schema,
});

export type EmployerProfileData = z.infer<typeof employerProfilSchema>;