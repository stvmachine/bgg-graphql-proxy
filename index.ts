import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BGGDataSource } from './src/datasources/bggDataSource';
import { resolvers } from './src/resolvers';

// Load GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'src/schema/schema.graphql'), 'utf8');

async function startServer() {
  const app = express();
  
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

  const port = process.env.PORT || 4000;
  
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
