import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import auth from "./routes/auth.routes.js";
import vote from "./routes/vote.routes.js";
import candidates from "./routes/candidates.routes.js";
import contactUs from "./routes/contact-us.routes.js";
import { timeoutHandler } from "./middleware/timeout.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://election-brown.vercel.app", // Add your actual frontend URL
];

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(...process.env.CORS_ORIGIN.split(","));
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      console.log("🚫 Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // MUST be true for cookies
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

app.use(cors(corsOptions));

// Important: Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Add this middleware to log cookies
app.use((req, res, next) => {
  console.log("🍪 Incoming cookies:", req.cookies);
  console.log("🔑 Has accessToken:", !!req.cookies?.accessToken);
  next();
});

app.use(cors(corsOptions));

// Important: Handle preflight requests
app.options("*", cors(corsOptions));

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", auth);
app.use("/api/candidates", candidates);
app.use("/api/vote", vote);
app.use("/api/contact-us", contactUs);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use("/api", timeoutHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed",
      allowedOrigins,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Allowed origins:`, allowedOrigins);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer();
}

export default app;
