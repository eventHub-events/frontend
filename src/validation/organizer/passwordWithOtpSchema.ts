
import {z} from "zod"
import { passwordSchema } from "./changePasswordValidation";


export const setPasswordWithOtpSchema = passwordSchema
  .omit({ currentPassword: true })
  .extend({
    otp: z
      .string()
      .length(6, "OTP must be 6 digits"),
  });

export type SetPasswordWithOtpSchemaType = z.infer<
  typeof setPasswordWithOtpSchema
>;
