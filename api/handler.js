const { ApolloServer } = require("@apollo/server");
const { startServerAndCreateVercelHandler } = require("@apollo/server/vercel");
const { readFileSync } = require("fs");
const { join } = require("path");
const { BGGDataSource } = require("../dist/datasources");
const { resolvers } = require("../dist/resolvers");

// Load GraphQL schema
const typeDefs = readFileSync(
  join(__dirname, "../dist/schema/schema.graphql"),
  "utf8"
);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

// Export the handler
module.exports = startServerAndCreateVercelHandler(server, {
  context: async () => ({
    dataSources: {
      bggAPI: new BGGDataSource(
        process.env.BGG_API_BASE_URL || "https://boardgamegeek.com/xmlapi2"
      ),
    },
  }),
});
