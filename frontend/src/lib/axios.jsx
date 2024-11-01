import axios from "axios";

const api = axios.create({
  baseURL: "https://election-lmbm.vercel.app/api",
  withCredentials: true,
});

export default api;
