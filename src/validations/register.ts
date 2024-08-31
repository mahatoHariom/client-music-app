import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
    dob: z.date({ required_error: "A date of birth is required" }),
  gender: z.enum(["M", "F", "O"], { required_error: "Gender is required" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
