import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import auth from "./routes/auth.routes.js";
import vote from "./routes/vote.routes.js";
import candidates from "./routes/candidates.routes.js";
import contactUs from "./routes/contact-us.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Get allowed origins from environment variable
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", auth);
app.use("/api/candidates", candidates);
app.use("/api/vote", vote);
app.use("/api/contact-us", contactUs);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV,
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle CORS errors specifically
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Origin not allowed",
      allowedOrigins: allowedOrigins,
    });
  }

  res.status(500).json({ message: "Something went wrong!" });
});

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    console.log("CORS enabled for origins:", allowedOrigins);
    connectDB();
  });
}

// For Vercel
export default app;
