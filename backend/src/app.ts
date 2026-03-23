import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";

import healthRoutes from "./modules/health/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import subjectsRoutes from "./modules/subjects/subjects.routes";
import videosRoutes from "./modules/videos/videos.routes";
import progressRoutes from "./modules/progress/progress.routes";
import exploreRoutes from "./modules/explore/explore.routes";

const app: Express = express();

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/explore", exploreRoutes);

// Error Handling
app.use(errorHandler);

export default app;
