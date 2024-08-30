export type Gender = "M" | "F" | "O";

export interface Artist {
  id: number;
  name: string;
  dob?: Date;
  gender: Gender;
  address?: string;
  first_release_year?: Date;
  no_of_albums_released?: number;
  created_at: Date;
  updated_at: Date;
}
