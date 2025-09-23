import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BGGDataSource } from './src/datasources/bggDataSource';
import { resolvers } from './src/resolvers';

// Load GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'src/schema/schema.graphql'), 'utf8');

async function startServer() {
  const app = express();
  
  // Add CORS and JSON parsing middleware
  app.use(cors());
  app.use(express.json());
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: () => ({
      dataSources: {
        bggAPI: new BGGDataSource(process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2'),
      },
    }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' } as any);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'BGG GraphQL Proxy',
      graphql: '/graphql',
      health: '/health',
      documentation: 'https://github.com/stvmachine/bgg-graphql-proxy'
    });
  });

  const port = process.env.PORT || 4000;
  
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
