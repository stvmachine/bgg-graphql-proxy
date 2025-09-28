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

  Thing: {
    // Resolve base game for expansions
    baseGame: async (parent, _, { dataSources }) => {
      if (!parent.isExpansion) {
        return null;
      }

      // Find the base game link
      const baseGameLink = parent.links?.find(link => 
        link.linkType === 'BOARDGAME_BASE' || 
        (link.type === 'boardgamebase' || link.type === 'boardgame')
      );

      if (baseGameLink) {
        try {
          return await dataSources.bggAPI.getThing(baseGameLink.targetId);
        } catch (error) {
          console.error('Error fetching base game:', error);
          return null;
        }
      }

      return null;
    },

    // Resolve expansions for base games
    expansionFor: async (parent, _, { dataSources }) => {
      if (parent.isExpansion) {
        return [];
      }

      // Find expansion links
      const expansionLinks = parent.links?.filter(link => 
        link.linkType === 'BOARDGAME_EXPANSION' || 
        link.type === 'boardgameexpansion'
      ) || [];

      if (expansionLinks.length === 0) {
        return [];
      }

      // Limit to first 10 expansions to avoid API limits (BGG has a 20 item limit)
      const limitedExpansionLinks = expansionLinks.slice(0, 10);
      const expansionIds = limitedExpansionLinks.map(link => link.targetId);
      
      try {
        // Fetch expansions in smaller batches to avoid API limits
        const expansions = [];
        for (let i = 0; i < expansionIds.length; i += 3) {
          const batch = expansionIds.slice(i, i + 3);
          const batchExpansions = await dataSources.bggAPI.getThings(batch);
          expansions.push(...batchExpansions);
        }
        return expansions;
      } catch (error) {
        console.error('Error fetching expansions:', error);
        return [];
      }
    },
  },
};
