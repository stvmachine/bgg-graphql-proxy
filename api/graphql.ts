import { ApolloServer } from "apollo-server-micro";
import { send } from "micro";
import Cors from "micro-cors";
import { readFileSync } from 'fs';
import { join } from 'path';
import { BGGDataSource } from '../src/datasources/bggDataSource';
import { resolvers } from '../src/resolvers';

// Load GraphQL schema
const typeDefs = readFileSync(join(__dirname, '../src/schema/schema.graphql'), 'utf8');

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    dataSources: {
      bggAPI: new BGGDataSource(process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2'),
    },
  }),
});

export default apolloServer.start().then(() => {
  const handler = apolloServer.createHandler({ path: "/api/graphql" });

  return cors((req, res) => {
    return req.method === "OPTIONS" ? send(res, 200, "ok") : handler(req, res);
  });
});
