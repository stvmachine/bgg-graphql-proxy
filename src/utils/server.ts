import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "../config";
import { BGGDataSource, MemoryCache, StorageDataSource } from "../datasources";
import { ApolloContext, resolvers } from "../resolvers";

// Vercel serverless function types
export interface VercelRequest {
  method?: string;
  url?: string;
  headers?: { [key: string]: string | string[] | undefined };
  body?: any;
  query?: { [key: string]: string | string[] | undefined };
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: (data?: string) => void;
}

/**
 * Loads the GraphQL schema from the schema file
 */
export function loadGraphQLSchema(): string {
  try {
    const schemaPath = join(__dirname, "../schema/schema.graphql");
    const typeDefs = readFileSync(schemaPath, "utf8");
    console.log('✅ GraphQL schema loaded successfully');
    return typeDefs;
  } catch (error) {
    console.error('❌ Failed to load GraphQL schema:', error);
    throw new Error('Failed to load GraphQL schema');
  }
}

/**
 * Creates data sources with the provided cache instance
 */
export function createDataSources(cache: MemoryCache) {
  return {
    bggAPI: new BGGDataSource(cache),
    storage: StorageDataSource.create(),
  };
}

/**
 * Creates an Apollo Server instance for Vercel serverless functions
 */
export async function createVercelApolloServer(cache: MemoryCache): Promise<ApolloServer<ApolloContext>> {
  const typeDefs = loadGraphQLSchema();

  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: true,
    cache,
  });

  await server.start();
  return server;
}

/**
 * Creates an Apollo Server instance for Express applications
 */
export async function createExpressApolloServer(httpServer: any, cache: MemoryCache): Promise<ApolloServer<ApolloContext>> {
  const typeDefs = loadGraphQLSchema();

  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: config.nodeEnv !== "production",
    cache,
  });

  await server.start();
  return server;
}

/**
 * Sets common CORS headers for responses
 */
export function setCorsHeaders(res: VercelResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

/**
 * Creates a health check response
 */
export function createHealthResponse(): any {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  };
}

/**
 * Creates a root endpoint response
 */
export function createRootResponse(): any {
  return {
    message: "BGG GraphQL Proxy API",
    version: "1.0.0",
    endpoints: {
      graphql: "/graphql",
      health: "/health",
    },
  };
}

/**
 * Creates an error response
 */
export function createErrorResponse(error: unknown, statusCode: number = 500): any {
  return {
    error: statusCode === 500 ? "Internal Server Error" : "Error",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

/**
 * Handles CORS preflight requests
 */
export function handleCorsPreflight(res: VercelResponse): void {
  setCorsHeaders(res);
  res.setHeader("Access-Control-Max-Age", "86400");
  res.status(200);
  res.end("");
}

/**
 * Parses GraphQL query and variables from request
 */
export function parseGraphQLRequest(req: VercelRequest): { query: string; variables: any } {
  const method = req.method || 'GET';
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

  return { query, variables };
}
