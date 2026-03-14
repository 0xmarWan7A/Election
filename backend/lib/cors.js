// lib/cors.js
import cors from "cors";

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      console.log("🚫 CORS blocked origin:", origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

export default corsOptions;
