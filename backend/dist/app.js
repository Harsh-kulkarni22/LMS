"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const subjects_routes_1 = __importDefault(require("./modules/subjects/subjects.routes"));
const videos_routes_1 = __importDefault(require("./modules/videos/videos.routes"));
const progress_routes_1 = __importDefault(require("./modules/progress/progress.routes"));
const explore_routes_1 = __importDefault(require("./modules/explore/explore.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/health", health_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/subjects", subjects_routes_1.default);
app.use("/api/videos", videos_routes_1.default);
app.use("/api/progress", progress_routes_1.default);
app.use("/api/explore", explore_routes_1.default);
// Error Handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
