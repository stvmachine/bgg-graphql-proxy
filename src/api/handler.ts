import { VercelRequest, VercelResponse } from "../utils/server";
import {
  createDataSources,
  createErrorResponse,
  createHealthResponse,
  createRootResponse,
  createVercelApolloServer,
  handleCorsPreflight,
  parseGraphQLRequest,
  setCorsHeaders,
} from "../utils/server";

// Global server instance
let server: any = null;

async function createApolloServer(): Promise<any> {
  if (server) {
    return server;
  }

  // Create Apollo Server using shared utility (no cache)
  server = await createVercelApolloServer();
  return server;
}

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const url = new URL(req.url || '', 'http://localhost');
    const path = url.pathname;
    const method = req.method || 'GET';

    // Handle OPTIONS requests for CORS (must be first)
    if (method === "OPTIONS") {
      handleCorsPreflight(res);
      return;
    }

    const apolloServer = await createApolloServer();

    // Handle health check
    if (path === "/health") {
      res.setHeader("Content-Type", "application/json");
      setCorsHeaders(res);
      res.status(200);
      res.end(JSON.stringify(createHealthResponse()));
      return;
    }

    // Handle root endpoint
    if (path === "/" && method === "GET") {
      res.setHeader("Content-Type", "application/json");
      setCorsHeaders(res);
      res.status(200);
      res.end(JSON.stringify(createRootResponse()));
      return;
    }

    // Handle GraphQL requests
    if (path === "/graphql") {
      // Initialize data sources (no cache)
      const dataSources = createDataSources();

      const contextValue = {
        dataSources,
      };

      // Parse GraphQL query from body or query parameters
      const { query, variables } = parseGraphQLRequest(req);

      if (!query) {
        res.setHeader("Content-Type", "application/json");
        setCorsHeaders(res);
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
      setCorsHeaders(res);
      res.status(200);
      res.end(JSON.stringify(result));
      return;
    }

    // 404 for other paths
    res.setHeader("Content-Type", "application/json");
    setCorsHeaders(res);
    res.status(404);
    res.end(JSON.stringify({
      error: "Not Found",
      message: `Path ${path} not found`,
    }));
  } catch (error) {
    console.error("Handler error:", error);
    res.setHeader("Content-Type", "application/json");
    setCorsHeaders(res);
    res.status(500);
    res.end(JSON.stringify(createErrorResponse(error)));
  }
}
