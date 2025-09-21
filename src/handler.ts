import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "./config";
import { BGGDataSource, MemoryCache, StorageDataSource } from "./datasources";
import { ApolloContext, resolvers } from "./resolvers";

// Vercel serverless function types
interface VercelRequest {
  method?: string;
  url?: string;
  headers?: { [key: string]: string | string[] | undefined };
  body?: any;
  query?: { [key: string]: string | string[] | undefined };
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: (data?: string) => void;
}

// Global server instance
let server: ApolloServer<ApolloContext> | null = null;

// Global cache instance
let globalCache: MemoryCache | null = null;

async function createApolloServer(): Promise<ApolloServer<ApolloContext>> {
  if (server) {
    return server;
  }

  // Read GraphQL schema
  let typeDefs: string;
  try {
    typeDefs = readFileSync(
      join(__dirname, "schema/schema.graphql"),
      "utf8"
    );
    console.log('✅ GraphQL schema loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load GraphQL schema:', error);
    throw new Error('Failed to load GraphQL schema');
  }

  // Create shared cache instance
  globalCache = new MemoryCache();

  // Create Apollo Server
  server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: true,
    cache: globalCache,
  });

  await server.start();
  return server;
}

const handler = async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  try {
    const url = new URL(req.url || '', 'http://localhost');
    const path = url.pathname;
    const method = req.method || 'GET';

    console.log('🚀 Handler started:', { path, method });
    const apolloServer = await createApolloServer();

    // Handle GraphQL requests
    if (path === "/graphql" || path === "/") {
      // Ensure we have the shared cache
      if (!globalCache) {
        throw new Error('Cache not initialized');
      }

      // Initialize data sources with shared cache
      const dataSources = {
        bggAPI: new BGGDataSource(globalCache),
        storage: StorageDataSource.create(),
      };

      const contextValue: ApolloContext = {
        dataSources,
      };

      // Parse GraphQL query from body or query parameters
      let query = "";
      let variables = {};

      if (method === "POST" && req.body) {
        try {
          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
          query = body.query || "";
          variables = body.variables || {};
        } catch (e) {
          query = req.body;
        }
      } else if (method === "GET" && req.query) {
        query = Array.isArray(req.query.query) ? req.query.query[0] : req.query.query || "";
        if (req.query.variables) {
          try {
            const vars = Array.isArray(req.query.variables) ? req.query.variables[0] : req.query.variables;
            variables = JSON.parse(vars);
          } catch (e) {
            // Ignore invalid variables
          }
        }
      }

      if (!query) {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(400);
        res.end(JSON.stringify({
          error: "No GraphQL query provided",
        }));
        return;
      }

      // Execute GraphQL operation
      const result = await apolloServer.executeOperation(
        {
          query,
          variables,
        },
        {
          contextValue,
        }
      );

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.status(200);
      res.json(result);
    }

    // Handle health check
    if (path === "/health") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200);
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
      return;
    }

    // Handle root endpoint
    if (path === "/" && method === "GET") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200);
      res.json({
        message: "BGG GraphQL Proxy API",
        version: "1.0.0",
        endpoints: {
          graphql: "/graphql",
          health: "/health",
        },
      });
      return;
    }

    // Handle OPTIONS requests for CORS
    if (method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Max-Age", "86400");
      res.status(200);
      res.end("");
      return;
    }

    // 404 for other paths
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(404);
    res.json({
      error: "Not Found",
      message: `Path ${path} not found`,
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500);
    res.json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Export as default for Vercel
export default handler;
