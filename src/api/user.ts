import api from "@/lib/axios-instance";
import { User } from "@/types/user";
import { LoginFormData } from "@/validations/login";
import { RegisterFormData } from "@/validations/register";

export const registerUser = async (data: RegisterFormData) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const loginUser = async (data: LoginFormData) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
export const getUserById = async (userId: number) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: number, data: RegisterFormData) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  await api.delete(`/users/delete/${userId}`);
};
