import { RegisterFormData } from "@/app/(auth)/register/page";
import api from "@/lib/axios-instance";

export const registerUser = async (data: RegisterFormData) => {
  const response = await api.post("/users", data);
  return response.data;
};
