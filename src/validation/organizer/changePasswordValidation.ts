
import {z} from "zod"
import { basePasswordSchema } from "./baseSchema";




export const passwordSchema = basePasswordSchema.refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  }
);

export type PasswordSchemaType = z.infer<typeof passwordSchema>;
