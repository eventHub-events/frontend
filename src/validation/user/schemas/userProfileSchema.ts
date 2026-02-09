import { z } from "zod";

// ---------------- REGEX RULES ----------------
const nameRegex = /^(?=.{3,20}$)[A-Z][a-zA-Z]*(?: [A-Z][a-zA-Z]*)*$/
;
const phoneRegex = /^[0-9]{10}$/;
const addressRegex = /^[A-Z][A-Za-z0-9\s,]{0,34}$/;
const cityStateCountryRegex = /^[A-Z][a-zA-Z]{0,14}$/;
const pinRegex = /^[0-9]{6}$/;

// ---------------- SCHEMA ----------------
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(nameRegex, "Must start with a capital letter, only English letters, max 20 characters"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Phone must contain exactly 10 digits"),

  address: z.object({
    line1: z
      .string()
      .min(1, "Address is required")
      .regex(addressRegex, "Must start with a capital letter, max 35 characters"),
    line2: z.string()
    .min(1, "Address is required")
      .regex(addressRegex, "Must start with a capital letter, max 35 characters").
    optional(),
    city: z
      .string()
      .min(1, "City is required")
      .regex(cityStateCountryRegex, "Must start with a capital letter, only letters, max 15 characters"),
    state: z
      .string()
      .min(1, "State is required")
      .regex(cityStateCountryRegex, "Must start with a capital letter, only letters, max 15 characters"),
    country: z
      .string()
      .min(1, "Country is required")
      .regex(cityStateCountryRegex, "Must start with a capital letter, only letters, max 15 characters"),
    pin: z
      .string()
      .min(1, "PIN Code is required")
      .regex(pinRegex, "PIN Code must contain exactly 6 digits"),
  }),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
