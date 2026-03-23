"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const startServer = async () => {
    try {
        await db_1.prisma.$connect();
        console.log("[DATABASE] Connected successfully");
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`[SERVER] Running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error("[SERVER ERROR] Failed to start:", error);
        process.exit(1);
    }
};
startServer();
