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

      // Check if cookies were set
      console.log("📝 Login response headers:", data);
      console.log("🍪 Cookies after login:", document.cookie);

      toast.success(data.message);
      set({ user: data.user, loading: false });

      // Test if cookies are working
      setTimeout(() => {
        console.log("🍪 Cookies after delay:", document.cookie);
      }, 1000);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
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
