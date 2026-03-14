import axios from "axios";

const getBaseURL = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // Use production backend URL
    return (
      import.meta.env.VITE_API_URL || "https://election-api-ten.vercel.app/api"
    );
  }
  // Development - use localhost
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method.toUpperCase(), config.url);
    console.log("🌍 Base URL:", config.baseURL);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "🌐 Network Error - Check if backend is running and CORS is configured",
      );
      console.error("Request URL:", error.config?.url);
      console.error("Base URL:", error.config?.baseURL);
    }

    if (error.response) {
      console.error(
        "❌ API Error:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
