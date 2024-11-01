import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  register: async ({
    fullname,
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("passwords do not match");
    }
    try {
      set({ loading: true });
      const { data } = await api.post("/auth/register", {
        fullname,
        username,
        email,
        password,
      });
      toast.success(data.message);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  login: async (username, password) => {
    try {
      set({ loading: true });
      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      toast.success(data.message);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await api.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.log(error.response?.data?.message);
    }
  },
}));
