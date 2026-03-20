import { z } from "zod";

export const createUserDto = z.object({
  email: z.email("Incorrect email format")
    .min(1, "Email is required")
    .max(255, "Email is too long"),

  username: z.string()
    .min(1, "Username is required")
    .max(100, "The username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "The username can only contain letters, numbers, and underscores"),

  password: z.string()
    .min(1, "Password required")
    .min(6, "The password must be at least 6 characters long")
    .max(255, "Password is too long")
});

export const loginUserDto = z.object({
  email: z.email("Incorrect email format")
    .min(1, "Email is required"),

  password: z.string()
    .min(1, "Password required")
});