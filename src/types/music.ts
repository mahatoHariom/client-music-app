export type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

export interface Music {
  id: number;
  title: string;
  album_name: string;
  artist_id: number;
  genre: Genre;
  created_at?: string; // Optional, if you are not always getting this field
  updated_at?: string; // Optional, if you are not always getting this field
}
