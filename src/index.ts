import express from "express";
import http from "http";
import { config } from "./config";
import { unifiedHandler } from "./utils/unifiedHandler";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Use the unified handler for all routes
  app.all("*", (req, res) => {
    unifiedHandler(req as any, res as any);
  });

  const port = config.port;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  console.log(`📊 Health check available at http://localhost:${port}/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);

  if (config.nodeEnv !== "production") {
    console.log(
      `🎮 GraphQL Playground available at http://localhost:${port}/graphql`
    );
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  // Note: Data sources will be cleaned up automatically
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down server...");
  // Note: Data sources will be cleaned up automatically
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
