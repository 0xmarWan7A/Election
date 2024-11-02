import axios from "axios";

const api = axios.create({
  baseURL: "https://election-api-ten.vercel.app/api",
  withCredentials: true,
});

export default api;
