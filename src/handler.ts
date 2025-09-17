import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "./config";
import { BGGDataSource, MemoryCache, StorageDataSource } from "./datasources";
import { ApolloContext, resolvers } from "./resolvers";

// AWS Lambda types (inline to avoid dependency)
interface APIGatewayProxyEvent {
  httpMethod: string;
  path: string;
  headers?: { [key: string]: string };
  body?: string;
  queryStringParameters?: { [key: string]: string };
}

interface APIGatewayProxyResult {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

interface Context {
  requestId: string;
}

// Global server instance
let server: ApolloServer<ApolloContext> | null = null;

async function createApolloServer(): Promise<ApolloServer<ApolloContext>> {
  if (server) {
    return server;
  }

  // Read GraphQL schema
  const typeDefs = readFileSync(
    join(__dirname, "../schema/schema.graphql"),
    "utf8"
  );

  // Create cache instance
  const cache = new MemoryCache();

  // Create Apollo Server
  server = new ApolloServer<ApolloContext>({
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

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const apolloServer = await createApolloServer();

    // Handle GraphQL requests
    if (event.path === "/graphql" || event.path === "/") {
      // Initialize data sources
      const dataSources = {
        bggAPI: new BGGDataSource(new MemoryCache()),
        storage: new StorageDataSource(),
      };

      const contextValue: ApolloContext = {
        dataSources,
      };

      // Parse GraphQL query from body or query parameters
      let query = "";
      let variables = {};

      if (event.httpMethod === "POST" && event.body) {
        try {
          const body = JSON.parse(event.body);
          query = body.query || "";
          variables = body.variables || {};
        } catch (e) {
          query = event.body;
        }
      } else if (event.httpMethod === "GET" && event.queryStringParameters) {
        query = event.queryStringParameters.query || "";
        if (event.queryStringParameters.variables) {
          try {
            variables = JSON.parse(event.queryStringParameters.variables);
          } catch (e) {
            // Ignore invalid variables
          }
        }
      }

      if (!query) {
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            error: "No GraphQL query provided",
          }),
        };
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

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
        body: JSON.stringify(result),
      };
    }

    // Handle health check
    if (event.path === "/health") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          environment: config.nodeEnv,
        }),
      };
    }

    // Handle root endpoint
    if (event.path === "/" && event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "BGG GraphQL Proxy API",
          version: "1.0.0",
          endpoints: {
            graphql: "/graphql",
            health: "/health",
          },
        }),
      };
    }

    // Handle OPTIONS requests for CORS
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
        body: "",
      };
    }

    // 404 for other paths
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Not Found",
        message: `Path ${event.path} not found`,
      }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
