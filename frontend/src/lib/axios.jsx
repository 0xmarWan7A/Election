import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://election-api-ten.vercel.app/api",
  withCredentials: true, // MUST be true for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to ensure credentials are sent
api.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is always true
    config.withCredentials = true;

    console.log("🚀 Request:", config.method.toUpperCase(), config.url);
    console.log("📦 With Credentials:", config.withCredentials);
    console.log("🍪 Cookies in document:", document.cookie || "None");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🔐 Authentication required");
      // You might want to trigger a refresh token flow here
    }
    return Promise.reject(error);
  },
);

export default api;
