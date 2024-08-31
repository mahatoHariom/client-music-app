import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dob: z.string({ required_error: "Date of birth is required" }),
  gender: z.enum(["M", "F", "O"], { required_error: "Gender is required" }),
  first_release_year: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1900, {
      message: "Invalid year",
    }),
  address: z.string().min(1, { message: "Address is required" }),
  no_of_albums_released: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Number of albums released cannot be negative",
    }),
});

export type CreateArtistFormData = z.infer<typeof createArtistSchema>;
