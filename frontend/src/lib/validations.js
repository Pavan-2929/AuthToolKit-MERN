import { z } from "zod";

const requiredString = z.string().trim().min(1, "required");

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .regex(
      /^(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._\s]{2,19}$/,
      "Invalid username. Start with a letter and use only letters, numbers, underscores, dots, or spaces without consecutive dots, underscores, or spaces."
    ),
  email: z.string().trim().min(1, "required").email("Invalid email address"),
  password: z.string().trim().min(8, "Password should be 8 letters long."),
});

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "required").email("Invalid email address"),
  password: requiredString,
});

export const MagicLinkSchema = z.object({
  email: z.string().trim().min(1, "required").email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().trim().min(8, "Password should be 8 letters long."),
  confirmPassword: z.string().min(8, "Passwords must match."),
});

export const ProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .regex(
      /^(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._\s]{2,19}$/,
      "Invalid username. Start with a letter and use only letters, numbers, underscores, dots, or spaces without consecutive dots, underscores, or spaces."
    ),
});
