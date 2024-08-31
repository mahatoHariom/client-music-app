import api from "@/lib/axios-instance";
import { Music } from "@/types/music";

export const getMusicByArtistId = async (
  artistId: number,
  search: string = "",
  page: number = 1,
  limit: number = 5
) => {
  const response = await api.get(`/music/artist/${artistId}`, {
    params: {
      search,
      page,
      limit,
    },
  });
  return response.data;
};

export const createMusic = async (artist_id: number, data: Music) => {
  const response = await api.post(`/music/artist/${artist_id}`, data);
  return response.data;
};
export const updateMusicById = async (data: { id: number } & Music) => {
  const response = await api.put(`/music/${data.id}`, data);
  return response.data;
};

export const deleteMusicById = async (id: number) => {
  await api.delete(`/music/${id}`);
};
