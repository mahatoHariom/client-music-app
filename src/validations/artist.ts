import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dob: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["M", "F", "O"], { required_error: "Gender is required" }),
  first_release_year: z
    .string()
    .refine((val) => /^\d{4}$/.test(val), {
      message: "Must be a 4-digit year",
    })
    .transform((val) => parseInt(val, 10)),
  address: z.string().min(1, { message: "Address is required" }),
  no_of_albums_released: z.string().transform((val) => parseInt(val, 10)),
});

export type CreateArtistFormData = z.infer<typeof createArtistSchema>;

export const updateArtistSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  dob: z.date({ required_error: "Date of birth is required" }).optional(),
  gender: z
    .enum(["M", "F", "O"], { required_error: "Gender is required" })
    .optional(),
  first_release_year: z
    .string()
    .refine((val) => /^\d{4}$/.test(val), {
      message: "Must be a 4-digit year",
    })
    .transform((val) => parseInt(val, 10))
    .optional(),
  address: z.string().min(1, { message: "Address is required" }).optional(),
  no_of_albums_released: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
});

export type UpdateArtistFormData = z.infer<typeof updateArtistSchema>;
