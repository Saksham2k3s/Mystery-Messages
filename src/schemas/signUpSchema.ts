import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must have 4 characters")
  .max(20, "Username must be less then 20 charachters")
  .regex(/^[a-zA-Z0-9_]+$/, "");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be have 8 characters" }),
});
