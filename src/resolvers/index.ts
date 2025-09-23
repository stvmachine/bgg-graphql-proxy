import { BGGDataSource } from "../datasources";
import { Resolvers } from "../generated/graphql";

export type ApolloContext = {
  dataSources: {
    bggAPI: BGGDataSource;
  };
};

export const resolvers: Partial<Resolvers<ApolloContext>> = {
  Query: {
    thing: async (_, { id }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getThing(id);
    },

    things: async (_, { ids }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getThings(ids);
    },

    search: async (_, { query, type, exact }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.searchThings(
        query,
        type || undefined,
        exact || undefined
      );
    },

    user: async (_, { username }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getUser(username);
    },

    userCollection: async (_, { username, subtype }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getUserCollection(
        username,
        subtype || undefined
      );
    },

    userPlays: async (
      _,
      { username, id, mindate, maxdate, page },
      { dataSources }
    ) => {
      const params = {
        id: id || undefined,
        mindate: mindate || undefined,
        maxdate: maxdate || undefined,
        page: page || undefined,
      };

      // Get directly from BGG API
      const plays = await dataSources.bggAPI.getUserPlays(username, params);

      return {
        total: plays.length,
        page: page || 1,
        plays,
      };
    },

    geeklist: async (_, { id }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getGeeklist(id);
    },

    geeklists: async (_, { username, page }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getGeeklists(
        username!,
        page || undefined
      );
    },

    hotItems: async (_, { type }, { dataSources }) => {
      // Get directly from BGG API
      return await dataSources.bggAPI.getHotItems(type || undefined);
    },
  },
};
