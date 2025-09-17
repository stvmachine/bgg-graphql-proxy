import { BGGDataSource, StorageDataSource } from "../datasources";
import { Resolvers } from "../generated/graphql";

export type ApolloContext = {
  dataSources: {
    bggAPI: BGGDataSource;
    storage: StorageDataSource;
  };
};

export const resolvers: Partial<Resolvers<ApolloContext>> = {
  Query: {
    thing: async (_, { id }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedThing(id);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const thing = await dataSources.bggAPI.getThing(id);
      if (thing) {
        // Cache the result
        await dataSources.storage.cacheThing(id, thing);
      }
      return thing;
    },

    things: async (_, { ids }, { dataSources }) => {
      // For multiple things, get from BGG API directly
      const things = await dataSources.bggAPI.getThings(ids);

      // Cache each thing
      for (const thing of things) {
        await dataSources.storage.cacheThing(thing.id, thing);
      }

      return things;
    },

    search: async (_, { query, type, exact }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedSearchResults(
        query,
        type || undefined,
        exact || undefined
      );
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const results = await dataSources.bggAPI.searchThings(
        query,
        type || undefined,
        exact || undefined
      );

      // Cache the results
      await dataSources.storage.cacheSearchResults(
        query,
        results,
        type || undefined,
        exact || undefined
      );

      return results;
    },

    user: async (_, { username }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedUser(username);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const user = await dataSources.bggAPI.getUser(username);
      if (user) {
        // Cache the result
        await dataSources.storage.cacheUser(username, user);
      }
      return user;
    },

    userCollection: async (_, { username, subtype }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedCollection(
        username,
        subtype || undefined
      );
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const collection = await dataSources.bggAPI.getUserCollection(
        username,
        subtype || undefined
      );
      if (collection) {
        // Cache the result
        await dataSources.storage.cacheCollection(
          username,
          collection,
          subtype || undefined
        );
      }
      return collection;
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

      // Check cache first
      const cached = await dataSources.storage.getCachedPlays(username, params);
      if (cached) {
        return {
          total: cached.length,
          page: page || 1,
          plays: cached,
        };
      }

      // Get from BGG API
      const plays = await dataSources.bggAPI.getUserPlays(username, params);

      // Cache the results
      await dataSources.storage.cachePlays(username, plays, params);

      return {
        total: plays.length,
        page: page || 1,
        plays,
      };
    },

    geeklist: async (_, { id }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedGeeklist(id);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const geeklist = await dataSources.bggAPI.getGeeklist(id);
      if (geeklist) {
        // Cache the result
        await dataSources.storage.cacheGeeklist(id, geeklist);
      }
      return geeklist;
    },

    geeklists: async (_, { username, page }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedGeeklists(
        username!,
        page || 1
      );
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const geeklists = await dataSources.bggAPI.getGeeklists(
        username!,
        page || undefined
      );

      // Cache the results
      await dataSources.storage.cacheGeeklists(username!, geeklists, page || 1);

      return geeklists;
    },

    hotItems: async (_, { type }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedHotItems(
        type || undefined
      );
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const items = await dataSources.bggAPI.getHotItems(type || undefined);

      // Cache the results
      await dataSources.storage.cacheHotItems(items, type || undefined);

      return items;
    },
  },
};
