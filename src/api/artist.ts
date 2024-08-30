import api from "@/lib/axios-instance";
import { Artist } from "@/types/artist";
import { Pagination } from "@/types/pagination";

interface GetArtistsResponse {
  artists: Artist[];
  pagination: Pagination;
}

export const getArtists = async (
  page = 1,
  limit = 5,
  search = ""
): Promise<GetArtistsResponse> => {
  const { data } = await api.get<GetArtistsResponse>("/artist", {
    params: { page, limit, search },
  });
  return data;
};

export const getArtistById = async (id: number) => {
  const { data } = await api.get(`/artist/${id}`);
  return data;
};

export const createArtist = async (artist: Artist) => {
  const { data } = await api.post(`/artist`, artist);
  return data;
};

export const updateArtistById = async ({
  id,
  ...artist
}: {
  id: number;
  artist: Partial<Artist>;
}): Promise<any> => {
  const { data } = await api.put(`/artist/update/${id}`, artist);
  return data;
};

export const deleteArtist = async (id: number) => {
  const { data } = await api.delete(`/artist/${id}`);
  return data;
};
