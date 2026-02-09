import { z } from "zod";

export const basePasswordSchema = z.object({
  currentPassword: z.string()
    .min(8, "Current password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[a-z]/, "Must include lowercase")
    .regex(/[0-9]/, "Must include number")
    .regex(/[^a-zA-Z0-9]/, "Must include special character"),

  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[a-z]/, "Must include lowercase")
    .regex(/[0-9]/, "Must include number")
    .regex(/[^a-zA-Z0-9]/, "Must include special character"),

  confirmNewPassword: z.string()
    .min(8, "Confirm password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[a-z]/, "Must include lowercase")
    .regex(/[0-9]/, "Must include number")
    .regex(/[^a-zA-Z0-9]/, "Must include special character"),
});
