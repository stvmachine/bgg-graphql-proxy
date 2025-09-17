import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import helmet from "helmet";
import http from "http";
import { join } from "path";
import { config } from "./config";
import { BGGDataSource, MemoryCache, StorageDataSource } from "./datasources";
import { ApolloContext, resolvers } from "./resolvers";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Read GraphQL schema
  const typeDefs = readFileSync(
    join(__dirname, "../schema/schema.graphql"),
    "utf8"
  );

  // Create cache instance (use memory cache for development, Redis for production)
  const cache = new MemoryCache();

  // Create Apollo Server
  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: config.nodeEnv !== "production",
    cache,
  });

  await server.start();

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
        // Initialize data sources
        const dataSources = {
          bggAPI: new BGGDataSource(cache),
          storage: new StorageDataSource(),
        };

        return {
          req,
          dataSources,
        };
      },
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "BGG GraphQL Proxy API",
      version: "1.0.0",
      endpoints: {
        graphql: "/graphql",
        health: "/health",
      },
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
