import { getUserById, updateUser } from "@/api/user";

export const mutationKeys = {
  register: "registerUser",
  login: "loginUser",
  getAllUsers: "getAllUsers",
  deleteUser: "deleteUsers",
  updateUser: "updateUser",
};

export const queryKeys = {
  getAllUsers: "getAllUsers",
  getUserById: "getUserById",
};
