import dotenv from "dotenv";
import path from "path";

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [
      "http://localhost:3000",
      "https://lms-tau-navy.vercel.app"
    ],
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
  /** YouTube Data API v3 key for /api/explore */
  YOUTUBE_API_KEY: (process.env.YOUTUBE_API_KEY || "").trim(),
};

// Validate critical env variables
['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[WARNING] Missing environment variable: ${key}`);
  }
});
