import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { create } from "zustand";

export const useVoteStore = create((set) => ({
  votes: [],
  loading: false,
  createVote: async (candidateId, userId) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/vote", { candidateId, userId });
      toast.success(data.message);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },

  getVotes: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/vote");
      set({ votes: data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },

  clearVote: async (userId) => {
    set({ loading: true });
    try {
      const { data } = await api.delete(`/vote/${userId}`);
      toast.success(data.message);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },
}));
