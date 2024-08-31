import { z } from "zod";

export const createMusicSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  album_name: z.string().min(1, { message: "Album name is required" }),
  genre: z.enum(["rnb", "country", "classic", "rock", "jazz"], {
    errorMap: () => ({ message: "Invalid genre" }),
  }),
});

export type CreateMusicFormData = z.infer<typeof createMusicSchema>;
