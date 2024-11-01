import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useContactStore = create((set) => ({
  mail: null,
  loading: false,

  sendMail: async (name, email, subject, message) => {
    set({ loading: true });
    try {
      const { data } = await axios.post(
        "/contact-us",
        name,
        email,
        subject,
        message
      );
      set({ mail: data, loading: false });
      toast.success(data.message);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },
}));
