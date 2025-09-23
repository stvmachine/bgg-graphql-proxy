import { ApolloServer } from '@apollo/server';
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

// Read Upstash Redis URL from environment
const redisUrl = process.env.UPSTASH_REDIS_URL as string;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    cache: new KeyvAdapter(
      new Keyv(new KeyvRedis(redisUrl))
    ),
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
