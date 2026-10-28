import { z } from "zod";
import { OTP_LENGTH } from "@/lib/auth";
import { isValidEmail } from "@/utils/Validator";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .refine(isValidEmail, "Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  code: z
    .array(z.string().regex(/^\d$/))
    .length(OTP_LENGTH, `Enter all ${OTP_LENGTH} digits.`),
});
export type OtpValues = z.infer<typeof otpSchema>;