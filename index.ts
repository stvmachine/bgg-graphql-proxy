import { ApolloServer } from "@apollo/server";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import { expressMiddleware } from "@as-integrations/express4";
import KeyvRedis from "@keyv/redis";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import Keyv from "keyv";
import { join } from "path";
import { BGGDataSource } from "./src/datasources/bggDataSource";
import { resolvers } from "./src/resolvers";

interface ContextValue {
  dataSources: {
    bggAPI: BGGDataSource;
  };
}

// Load GraphQL schema
const typeDefs = readFileSync(
  join(__dirname, "src/schema/schema.graphql"),
  "utf8"
);

// Read Redis URL from environment, default to local Redis
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const app = express();

// Initialize Redis cache with error handling
let cache;
const cacheControl = { defaultMaxAge: 3600 };
try {
  console.log(`🔗 Connecting to Redis at: ${redisUrl}`);
  cache = new KeyvAdapter(new Keyv<string>(new KeyvRedis(redisUrl)));
  console.log("✅ Redis cache initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Redis cache:", error);
  console.log("⚠️  Falling back to in-memory cache");
  cache = undefined; // Apollo will use in-memory cache
}

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    responseCachePlugin({
      // Use Redis cache for response caching
      ...(cache && { cache }),
    }),
  ],
  ...(cache && { cache, cacheControl }),
});

// Initialize Apollo Server and set up routes
async function setupServer() {
  try {
    await server.start();
    console.log("✅ Apollo Server started");

    // GraphQL endpoint
    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async () => ({
          dataSources: {
            bggAPI: new BGGDataSource(
              process.env.BGG_API_BASE_URL ||
                "https://boardgamegeek.com/xmlapi2"
            ),
          },
        }),
      })
    );
  } catch (error) {
    console.error("❌ Failed to start Apollo Server:", error);
  }
}

// Set up the server
setupServer();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "BGG GraphQL Proxy",
    graphql: "/graphql",
    health: "/health",
    documentation: "https://github.com/stvmachine/bgg-graphql-proxy",
  });
});

// Track last keepalive execution
let lastKeepaliveExecution: {
  timestamp: string;
  success: boolean;
  error?: string;
} | null = null;

// Keepalive endpoint for Redis - called by cron job to prevent Redis from stalling
app.get("/api/keepalive", async (req, res) => {
  // Prevent caching for cron jobs
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });
  
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const executionTime = new Date().toISOString();
  const isCronJob = req.headers["user-agent"]?.includes("vercel-cron") || 
                    req.headers["x-vercel-cron"] === "1" ||
                    req.query.secret === process.env.CRON_SECRET;
  
  console.log(`[KEEPALIVE] ${executionTime} - Request received`, {
    isCronJob,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    headers: {
      "x-vercel-cron": req.headers["x-vercel-cron"],
      "user-agent": req.headers["user-agent"],
    },
  });
  
  try {
    // Create a temporary Redis connection to ping it
    const keyvRedis = new KeyvRedis(redisUrl);
    const testKeyv = new Keyv<string>(keyvRedis);
    
    // Perform a simple operation to keep Redis alive
    const testKey = "keepalive:ping";
    const timestamp = Date.now().toString();
    
    // Set a test key with current timestamp
    await testKeyv.set(testKey, timestamp, 60); // Expires in 60 seconds
    
    // Get it back to verify connection
    const value = await testKeyv.get(testKey);
    
    // Store last execution timestamp in Redis for persistence
    const lastExecKey = "keepalive:last_execution";
    await testKeyv.set(lastExecKey, executionTime, 86400 * 7); // Keep for 7 days
    
    // Clean up test key
    await testKeyv.delete(testKey);
    await testKeyv.disconnect();
    
    const success = value === timestamp;
    
    // Update in-memory tracking
    lastKeepaliveExecution = {
      timestamp: executionTime,
      success,
    };
    
    console.log(`[KEEPALIVE] ${executionTime} - Success: ${success}`);
    
    res.json({
      status: "ok",
      message: "Redis keepalive successful",
      timestamp: executionTime,
      redisConnected: success,
      isCronJob,
      nextScheduledRun: "Daily at 00:00 UTC",
      cronSchedule: "0 0 * * *",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[KEEPALIVE] ${executionTime} - Error:`, errorMessage);
    
    // Update in-memory tracking
    lastKeepaliveExecution = {
      timestamp: executionTime,
      success: false,
      error: errorMessage,
    };
    
    res.status(500).json({
      status: "error",
      message: "Redis keepalive failed",
      error: errorMessage,
      timestamp: executionTime,
      isCronJob,
    });
  }
});

// Status endpoint to check last keepalive execution
app.get("/api/keepalive/status", async (req, res) => {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  
  try {
    // Try to get last execution from Redis
    const keyvRedis = new KeyvRedis(redisUrl);
    const testKeyv = new Keyv<string>(keyvRedis);
    const lastExecKey = "keepalive:last_execution";
    const lastExecFromRedis = await testKeyv.get(lastExecKey);
    await testKeyv.disconnect();
    
    res.json({
      status: "ok",
      lastExecution: lastKeepaliveExecution || (lastExecFromRedis ? {
        timestamp: lastExecFromRedis,
        success: true,
      } : null),
      cronSchedule: "0 0 * * * (Daily at 00:00 UTC)",
      endpoint: "/api/keepalive",
      vercelCronConfigured: true,
    });
  } catch (error) {
    res.json({
      status: "ok",
      lastExecution: lastKeepaliveExecution,
      cronSchedule: "0 0 * * * (Daily at 00:00 UTC)",
      endpoint: "/api/keepalive",
      vercelCronConfigured: true,
      note: "Could not fetch from Redis, showing in-memory status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// For local development, start the server
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready on port ${port}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
  });
}

export default app;
