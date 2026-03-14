import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Cache the database connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  try {
    if (cached.conn) {
      console.log("✅ Using cached MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false, // Don't buffer commands when disconnected
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 0, // Allow connections to scale down to 0
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        retryWrites: true,
        retryReads: true,
      };

      console.log("🔄 Connecting to MongoDB...");
      console.log(
        "MongoDB URI:",
        process.env.MONGO_URI?.replace(/:[^:]*@/, ":****@"),
      ); // Hide password in logs

      cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
    }

    cached.conn = await cached.promise;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Full error:", error);
    cached.promise = null;
    throw error;
  }
};

// Add disconnect handler
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB connection error:", err);
});
