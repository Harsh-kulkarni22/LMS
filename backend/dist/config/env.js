"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from backend root
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
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
