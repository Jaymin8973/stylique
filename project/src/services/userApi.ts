import axiosClient from "../api/axiosClient";

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

const UserApi = {
  getAllUsers: async (): Promise<UserSummary[]> => {
    const res = await axiosClient.get("/api/user");
    return res.data as UserSummary[];
  },

  toggleUserActive: async (id: number): Promise<{ id: number; isActive: boolean }> => {
    const res = await axiosClient.patch(`/api/user/${id}/toggle-active`);
    return res.data as { id: number; isActive: boolean };
  },
};

export default UserApi;
