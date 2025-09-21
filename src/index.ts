import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { config } from "./config";
import { MemoryCache } from "./datasources";
import {
  createDataSources,
  createExpressApolloServer,
  createHealthResponse,
  createRootResponse,
} from "./utils";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Create cache instance (use memory cache for development, Redis for production)
  const cache = new MemoryCache();

  // Create Apollo Server using shared utility
  const server = await createExpressApolloServer(httpServer, cache);

  // Apply middleware
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin:
        config.nodeEnv === "production"
          ? ["https://yourdomain.com"] // Replace with your production domain
          : true,
      credentials: true,
    }),
    helmet({
      contentSecurityPolicy:
        config.nodeEnv === "production" ? undefined : false,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Initialize data sources using shared utility
        const dataSources = createDataSources(cache);

        console.log(`🔧 Data sources initialized:`, {
          bggAPI: 'BGGDataSource',
          storage: dataSources.storage.constructor.name
        });

        return {
          req,
          dataSources,
        };
      },
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json(createHealthResponse());
  });

  // Root endpoint
  app.get("/", (req, res) => {
    const rootResponse = createRootResponse();
    res.json({
      ...rootResponse,
      documentation: "https://github.com/yourusername/bgg-graphql-proxy",
    });
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
