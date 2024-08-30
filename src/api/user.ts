import api from "@/lib/axios-instance";
import { Pagination } from "@/types/pagination";
import { User } from "@/types/user";
import { LoginFormData } from "@/validations/login";
import { RegisterFormData } from "@/validations/register";

interface GetUsersResponse {
  users: User[];
  pagination: Pagination;
}
export const registerUser = async (data: RegisterFormData) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const loginUser = async (data: LoginFormData) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const getUsers = async (
  currentPage: number = 1,
  limit: number = 5,
  search: string = ""
): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>("/users", {
    params: {
      page: currentPage,
      limit,
      search,
    },
  });
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
