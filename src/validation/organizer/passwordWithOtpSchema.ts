
import {z} from "zod"
import { basePasswordSchema } from "./baseSchema";

import { passwordBaseSchema } from "./passwordBaseSchema";

export const setPasswordWithOtpSchema = basePasswordSchema
  .omit({ currentPassword: true })
  .extend({
    otp: z.string().length(6, "OTP must be 6 digits"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type SetPasswordWithOtpSchemaType =
  z.infer<typeof setPasswordWithOtpSchema>;
