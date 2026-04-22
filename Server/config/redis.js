import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis reconnection failed after 10 attempts");
        return new Error("Redis reconnection failed");
      }
      return Math.min(retries * 100, 3000);
    },
    timeout: 5000
  }
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Redis Client Connected"));
redisClient.on("reconnecting", () => console.log("🔄 Redis Client Reconnecting..."));