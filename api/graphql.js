import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from '../src/config';
import { BGGDataSource, MemoryCache, StorageDataSource } from '../src/datasources';
import { resolvers } from '../src/resolvers';

// Read GraphQL schema
const typeDefs = readFileSync(join(process.cwd(), 'src/schema/schema.graphql'), 'utf8');

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  introspection: true,
  cache: new MemoryCache(),
});

// Start server
await server.start();

// Create handler for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Create data sources
  const cache = new MemoryCache();
  const dataSources = {
    bggAPI: new BGGDataSource(cache),
    storage: StorageDataSource.create(),
  };

  // Execute GraphQL request
  const result = await server.executeOperation(
    {
      query: req.body.query,
      variables: req.body.variables || {},
    },
    {
      contextValue: { dataSources },
    }
  );

  res.status(200).json(result);
}
