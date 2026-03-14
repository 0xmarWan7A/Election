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
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 0, // Allow connections to scale down to 0
      };

      console.log("🔄 Connecting to MongoDB...");
      cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
    }

    cached.conn = await cached.promise;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    cached.promise = null;
    throw error; // Re-throw to handle in the route
  }
};
