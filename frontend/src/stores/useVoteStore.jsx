import { toast } from "react-hot-toast";
import api from "../lib/axios";
import { create } from "zustand";

export const useVoteStore = create((set, get) => ({
  votes: [],
  loading: false,

  createVote: async (candidateId) => {
    // Remove userId, get from auth
    set({ loading: true });
    try {
      const { data } = await api.post("/vote", { candidateId });
      toast.success(data.message);

      // Refresh votes list after voting
      await get().getVotes();
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to vote");
    }
  },

  getVotes: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/vote");
      set({ votes: data, loading: false });
    } catch (error) {
      set({ loading: false });
      if (error.response?.status !== 401) {
        // Don't show error for unauthorized
        toast.error(error.response?.data?.message || "Failed to fetch votes");
      }
    }
  },

  clearVote: async (userId) => {
    set({ loading: true });
    try {
      const { data } = await api.delete(`/vote/${userId}`);
      toast.success(data.message);

      // Update local state
      set((state) => ({
        votes: state.votes.map((vote) =>
          vote.id === userId
            ? { ...vote, hasVoted: false, votedTo: null, voteDate: null }
            : vote,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to clear vote");
    }
  },
}));
