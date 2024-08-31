import { getArtistById } from "@/api/artist";
import { getUserById, updateUser } from "@/api/user";

export const mutationKeys = {
  register: "registerUser",
  login: "loginUser",
  getAllUsers: "getAllUsers",
  deleteUser: "deleteUsers",
  updateUser: "updateUser",
  createArtist: "createArtist",
  updateArtist: "updateArtist",
  createMusic: "createMusic",
  updateMusic: "updateMusic",
};

export const queryKeys = {
  getAllUsers: "getAllUsers",
  getUserById: "getUserById",
  getArtistById: "getArtistById",
};
