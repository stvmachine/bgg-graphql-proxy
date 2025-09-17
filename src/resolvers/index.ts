import { Resolvers } from '../generated/graphql';
import { BGGDataSource, StorageDataSource } from '../datasources';

export type ApolloContext = {
  dataSources: {
    bggAPI: BGGDataSource;
    storage: StorageDataSource;
  };
};

export const resolvers: Resolvers<ApolloContext> = {
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
      const cached = await dataSources.storage.getCachedSearchResults(query, type, exact);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const results = await dataSources.bggAPI.searchThings(query, type, exact);
      
      // Cache the results
      await dataSources.storage.cacheSearchResults(query, results, type, exact);
      
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
      const cached = await dataSources.storage.getCachedCollection(username, subtype);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const collection = await dataSources.bggAPI.getUserCollection(username, subtype);
      if (collection) {
        // Cache the result
        await dataSources.storage.cacheCollection(username, collection, subtype);
      }
      return collection;
    },

    userPlays: async (_, { username, id, mindate, maxdate, page }, { dataSources }) => {
      const params = { id, mindate, maxdate, page };
      
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
      const cached = await dataSources.storage.getCachedGeeklists(username, page || 1);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const geeklists = await dataSources.bggAPI.getGeeklists(username, page);
      
      // Cache the results
      await dataSources.storage.cacheGeeklists(username, geeklists, page || 1);
      
      return geeklists;
    },

    hotItems: async (_, { type }, { dataSources }) => {
      // Check cache first
      const cached = await dataSources.storage.getCachedHotItems(type);
      if (cached) {
        return cached;
      }

      // Get from BGG API
      const items = await dataSources.bggAPI.getHotItems(type);
      
      // Cache the results
      await dataSources.storage.cacheHotItems(items, type);
      
      return items;
    },
  },

  // Type resolvers for data transformation
  Thing: {
    name: (parent) => {
      if (typeof parent.name === 'string') return parent.name;
      if (Array.isArray(parent.name)) {
        const primary = parent.name.find((n: any) => n.type === 'primary');
        return primary?.value || parent.name[0]?.value || '';
      }
      return parent.name?.value || '';
    },

    alternateNames: (parent) => {
      if (!Array.isArray(parent.name)) return [];
      return parent.name
        .filter((n: any) => n.type === 'alternate')
        .map((n: any) => n.value);
    },

    yearPublished: (parent) => {
      return parent.yearpublished ? parseInt(parent.yearpublished) : null;
    },

    minPlayers: (parent) => {
      return parent.minplayers ? parseInt(parent.minplayers) : null;
    },

    maxPlayers: (parent) => {
      return parent.maxplayers ? parseInt(parent.maxplayers) : null;
    },

    playingTime: (parent) => {
      return parent.playingtime ? parseInt(parent.playingtime) : null;
    },

    average: (parent) => {
      return parent.average ? parseFloat(parent.average) : null;
    },

    bayesAverage: (parent) => {
      return parent.bayesaverage ? parseFloat(parent.bayesaverage) : null;
    },

    usersRated: (parent) => {
      return parent.usersrated ? parseInt(parent.usersrated) : null;
    },
  },

  User: {
    supportYears: (parent) => {
      return parent.supportyears ? parseInt(parent.supportyears) : 0;
    },
  },

  Collection: {
    totalItems: (parent) => {
      return parent.totalitems ? parseInt(parent.totalitems) : 0;
    },
  },

  PlayResult: {
    total: (parent) => {
      return parent.total || 0;
    },

    page: (parent) => {
      return parent.page || 1;
    },
  },

  Play: {
    quantity: (parent) => {
      return parent.quantity ? parseInt(parent.quantity) : 1;
    },

    length: (parent) => {
      return parent.length ? parseInt(parent.length) : 0;
    },

    incomplete: (parent) => {
      return parent.incomplete === '1' || parent.incomplete === true;
    },

    nowInStats: (parent) => {
      return parent.nowinstats === '1' || parent.nowinstats === true;
    },
  },

  PlayPlayer: {
    position: (parent) => {
      return parent.position ? parseInt(parent.position) : 0;
    },

    new: (parent) => {
      return parent.new === '1' || parent.new === true;
    },

    win: (parent) => {
      return parent.win === '1' || parent.win === true;
    },
  },

  Geeklist: {
    thumbs: (parent) => {
      return parent.thumbs ? parseInt(parent.thumbs) : 0;
    },

    numItems: (parent) => {
      return parent.numitems ? parseInt(parent.numitems) : 0;
    },
  },

  GeeklistItem: {
    thumbs: (parent) => {
      return parent.thumbs ? parseInt(parent.thumbs) : 0;
    },
  },

  GeeklistComment: {
    thumbs: (parent) => {
      return parent.thumbs ? parseInt(parent.thumbs) : 0;
    },
  },
};