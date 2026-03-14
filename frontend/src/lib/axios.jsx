import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://election-api-ten.vercel.app/api",
  withCredentials: true, // This is crucial for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add request interceptor to log cookies
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method.toUpperCase(), config.url);
    console.log("📦 With Credentials:", config.withCredentials);
    console.log("🍪 Cookies present:", document.cookie ? "Yes" : "No");
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
    if (error.response?.status === 401) {
      console.log("🔐 Authentication required - redirecting to login");
      // You might want to redirect to login here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Add to your axios configuration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await api.post("/auth/refresh-token");
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.log("Session expired, please login again");
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
