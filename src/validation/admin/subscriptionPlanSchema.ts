import { z } from "zod";

export const planSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, "Name is required")
    .max(30, "Name shall not exceed 30 characters"),
    
  price: z
    .number()
    .min(0, "Price must be non-negative"),
    
  durationInDays: z
    .number()
    .min(1, "Duration must be at least 1 day"),

  description: z
    .string()
    .min(5, "Description is required"),

  privileges: z.object({
    maxActiveEvents: z
      .number()
      .min(1, "Must be at least 1"),

    maxFeaturedEvents: z
      .number()
      .min(0, "Must be non-negative"),

    commissionRate: z
      .number()
      .min(0)
      .max(100),

    payout: z.object({
      frequency: z.enum(["within-1-week", "within-2-weeks", "within-1-month"]),
      delayDays: z
        .number()
        .min(0, "Delay must be non-negative"),
    }),

    supportLevel: z.enum(["email", "priority"]),
  }),
});

export type PlanFormData = z.infer<typeof planSchema>;
