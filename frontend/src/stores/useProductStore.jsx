import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  candidates: [],
  loading: false,
  setCandidates: (candidates) => set({ candidates }),

  createCandidate: async (candidate) => {
    set({ loading: true });
    try {
      const { data } = await axios.post("/candidates", candidate);
      toast.success(data.message);
      set((PrevState) => ({
        candidates: [data.candidate, ...PrevState.candidates],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },

  fetchAllCandidates: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/candidates");
      set({ candidates: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },

  fetchCandidatesByPosition: async (position) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/candidates/${position}`);
      set({ candidates: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },

  deleteCandidate: async (candidateId) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/candidates/${candidateId}`);
      set((prevState) => ({
        candidates: prevState.candidates.filter(
          (candidate) => candidate._id !== candidateId
        ),
        loading: false,
      }));

      toast.success(res.data.message);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message);
    }
  },
}));
