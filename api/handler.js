const { ApolloServer } = require("apollo-server-micro");
const { readFileSync } = require("fs");
const { join } = require("path");
const { BGGDataSource } = require("../dist/datasources");
const { resolvers } = require("../dist/resolvers");

// Load GraphQL schema
const typeDefs = readFileSync(
  join(__dirname, "../dist/schema/schema.graphql"),
  "utf8"
);

module.exports = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: () => ({
    dataSources: {
      bggAPI: new BGGDataSource(
        process.env.BGG_API_BASE_URL || "https://boardgamegeek.com/xmlapi2"
      ),
    },
  }),
}).createHandler({
  path: "/api/graphql",
});
