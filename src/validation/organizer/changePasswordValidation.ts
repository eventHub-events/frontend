
 import {z} from "zod"

import { passwordBaseSchema } from "./passwordBaseSchema";




// export const passwordSchema= z.object({
//   currentPassword:z.string().min(8,"Current password must be at least 8 characters").regex(/[A-Z]/, "Must include at least one uppercase letter")
//       .regex(/[a-z]/, "Must include at least one lowercase letter")
//       .regex(/[0-9]/, "Must include at least one number")
//       .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
//   newPassword:z.string().min(8,"New password must be at least 8 characters").regex(/[A-Z]/, "Must include at least one uppercase letter")
//       .regex(/[a-z]/, "Must include at least one lowercase letter")
//       .regex(/[0-9]/, "Must include at least one number")
//       .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
//   confirmNewPassword: z
//       .string()
//       .min(8, "Confirm password must be at least 8 characters").regex(/[A-Z]/, "Must include at least one uppercase letter")
//       .regex(/[a-z]/, "Must include at least one lowercase letter")
//       .regex(/[0-9]/, "Must include at least one number")
//       .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
//   })
//   .refine((data) => data.newPassword === data.confirmNewPassword, {
//     message: "Passwords do not match",
//     path: ["confirmNewPassword"],

// })
// export type PasswordSchemaType = z.infer<typeof passwordSchema>;


export const passwordSchema = passwordBaseSchema.refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  }
);

export type PasswordSchemaType = z.infer<typeof passwordSchema>;
