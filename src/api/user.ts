import api from "@/lib/axios-instance";
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
