import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("[DATABASE] Connected successfully");

    app.listen(env.PORT, () => {
      console.log(`[SERVER] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("[SERVER ERROR] Failed to start:", error);
    process.exit(1);
  }
};

startServer();
