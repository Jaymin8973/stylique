import axiosClient from "../api/axiosClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: number; email: string; roleId: number };
};

const AuthApi = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const res = await axiosClient.post("/api/auth/login", data);
    return res.data;
  },
};

export default AuthApi;
