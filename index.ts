import { ApolloServer } from '@apollo/server';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import { expressMiddleware } from '@as-integrations/express4';
import KeyvRedis from "@keyv/redis";
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import http from 'http';
import Keyv from "keyv";
import { join } from 'path';
import { BGGDataSource } from './src/datasources/bggDataSource';
import { resolvers } from './src/resolvers';

interface ContextValue {
  dataSources: {
    bggAPI: BGGDataSource;
  };
}
// Load GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'src/schema/schema.graphql'), 'utf8');

// Read Redis URL from environment, default to local Redis
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Initialize Redis cache with error handling
  let cache;
  try {
    console.log(`🔗 Connecting to Redis at: ${redisUrl}`);
    cache = new KeyvAdapter(
      new Keyv(new KeyvRedis(redisUrl))
    );
    console.log('✅ Redis cache initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Redis cache:', error);
    console.log('⚠️  Falling back to in-memory cache');
    cache = undefined; // Apollo will use in-memory cache
  }

  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      responseCachePlugin({
        // Use Redis cache for response caching
        ...(cache && { cache }),
      }),
    ],
    ...(cache && { cache }),
  });

  await server.start();

  app.use('/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({
        dataSources: {
          bggAPI: new BGGDataSource(process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2'),
        },
      }),
    }));

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
    console.log(`🚀 Server ready on port ${port}`);
    console.log(`📊 GraphQL endpoint: /graphql`);
    console.log(`📊 Health check: /health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
