import { ApolloContext } from "./resolvers";
import {
  VercelRequest,
  VercelResponse,
  createDataSources,
  createErrorResponse,
  createHealthResponse,
  createRootResponse,
  createVercelApolloServer,
  handleCorsPreflight,
  parseGraphQLRequest,
  setCorsHeaders,
} from "./utils";

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

const handler = async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  // Prevent multiple responses
  let responseSent = false;
  const originalEnd = res.end;
  res.end = function(data?: string) {
    if (responseSent) {
      console.log('⚠️ Attempted to send response after already sent');
      return;
    }
    responseSent = true;
    return originalEnd.call(this, data);
  };

  try {
    const url = new URL(req.url || '', 'http://localhost');
    const path = url.pathname;
    const method = req.method || 'GET';

    console.log('🚀 Handler started:', { path, method });
    
    // Handle OPTIONS requests for CORS (must be first)
    if (method === "OPTIONS") {
      console.log('🔧 Handling OPTIONS request for CORS');
      
      // Check for bypass token in headers
      const bypassToken = req.headers?.['x-vercel-protection-bypass'];
      if (bypassToken) {
        console.log('🔑 Bypass token found in OPTIONS request');
      }
      
      handleCorsPreflight(res);
      return;
    }

    const apolloServer = await createApolloServer();

    // Handle GraphQL requests
    if (path === "/graphql" || path === "/") {
      // Initialize data sources (no cache)
      const dataSources = createDataSources();

      const contextValue: ApolloContext = {
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
      res.json(result);
    }

    // Handle health check
    if (path === "/health") {
      res.setHeader("Content-Type", "application/json");
      setCorsHeaders(res);
      res.status(200);
      res.json(createHealthResponse());
      return;
    }

    // Handle root endpoint
    if (path === "/" && method === "GET") {
      res.setHeader("Content-Type", "application/json");
      setCorsHeaders(res);
      res.status(200);
      res.json(createRootResponse());
      return;
    }

    // 404 for other paths
    res.setHeader("Content-Type", "application/json");
    setCorsHeaders(res);
    res.status(404);
    res.json({
      error: "Not Found",
      message: `Path ${path} not found`,
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.setHeader("Content-Type", "application/json");
    setCorsHeaders(res);
    res.status(500);
    res.json(createErrorResponse(error));
  }
};

// Export as default for Vercel
export default handler;
