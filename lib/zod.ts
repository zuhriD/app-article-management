
import { object, string } from "zod";

export const signInSchema = object({
    username: string({ required_error: "Username is required" })
        .min(1, "Username is required"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export const editUserSchema = object({
    first_name: string({ required_error: "First name is required" })
        .min(1, "First name is required"),
    last_name: string({ required_error: "Last name is required" })
        .min(1, "Last name is required"),
    username: string({ required_error: "Username is required" })
        .min(1, "Username is required"),
    email: string({ required_error: "Email is required" })
        .email("Invalid email address")
        .min(1, "Email is required"),
});