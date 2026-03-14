import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Simple in-memory store as fallback
const memoryStore = new Map();

class RedisClient {
  constructor() {
    this.client = null;
    this.isRedisConnected = false;
    this.init();
  }

  init() {
    // Don't try to connect to Redis in production if URI is not set
    if (!process.env.UPSTASH_REDIS_URI) {
      console.warn("⚠️  UPSTASH_REDIS_URI not found, using in-memory store");
      return;
    }

    try {
      this.client = new Redis(process.env.UPSTASH_REDIS_URI, {
        retryStrategy: (times) => {
          // Don't retry in production, just use memory store
          if (process.env.NODE_ENV === "production") {
            console.warn(
              "⚠️  Redis connection failed in production, using in-memory store",
            );
            this.isRedisConnected = false;
            return null; // Stop retrying
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 1,
        lazyConnect: true, // Don't connect immediately
      });

      this.client.on("connect", () => {
        console.log("✅ Redis connected successfully");
        this.isRedisConnected = true;
      });

      this.client.on("error", (err) => {
        console.error("❌ Redis error:", err.message);
        this.isRedisConnected = false;
        // Don't crash the app
      });

      // Try to connect
      this.client.connect().catch((err) => {
        console.error("❌ Redis connection failed:", err.message);
        this.isRedisConnected = false;
      });
    } catch (error) {
      console.error("❌ Redis initialization error:", error.message);
      this.isRedisConnected = false;
    }
  }

  async set(key, value, ...args) {
    try {
      if (this.isRedisConnected && this.client) {
        return await this.client.set(key, value, ...args);
      } else {
        // Use memory store
        memoryStore.set(key, value);
        if (args.includes("EX")) {
          const seconds = args[args.indexOf("EX") + 1];
          setTimeout(() => memoryStore.delete(key), seconds * 1000);
        }
        return "OK";
      }
    } catch (error) {
      console.error("Redis set error:", error);
      // Fallback to memory
      memoryStore.set(key, value);
      return "OK";
    }
  }

  async get(key) {
    try {
      if (this.isRedisConnected && this.client) {
        return await this.client.get(key);
      } else {
        return memoryStore.get(key) || null;
      }
    } catch (error) {
      console.error("Redis get error:", error);
      return memoryStore.get(key) || null;
    }
  }

  async del(key) {
    try {
      if (this.isRedisConnected && this.client) {
        return await this.client.del(key);
      } else {
        return memoryStore.delete(key) ? 1 : 0;
      }
    } catch (error) {
      console.error("Redis del error:", error);
      memoryStore.delete(key);
      return 1;
    }
  }
}

export const redis = new RedisClient();
