import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useContactStore = create((set) => ({
  mail: null,
  loading: false,

  sendMail: async (formData) => {
    // Accept single object instead of multiple params
    set({ loading: true });
    try {
      const { data } = await axios.post("/contact-us", formData); // Send as object
      set({ mail: data, loading: false });
      toast.success(data.message);
      return data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to send message");
      throw error;
    }
  },
}));
