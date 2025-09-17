/**
 * Cache TTL (Time To Live) configuration for different entity types
 * Values are in seconds
 */
export enum CacheTTL {
  // L1 Cache (Apollo Server Cache) - Short-term caching
  THING = 300,           // 5 minutes - Individual games
  USER = 3600,           // 1 hour - User profiles
  COLLECTION = 1800,     // 30 minutes - User collections
  PLAYS = 900,           // 15 minutes - Play records
  GEEKLIST = 3600,       // 1 hour - Individual geeklists
  GEEKLISTS = 1800,      // 30 minutes - User geeklists
  HOT_ITEMS = 1800,      // 30 minutes - Hot items
  SEARCH = 1800,         // 30 minutes - Search results

  // L2 Cache (Storage Cache) - Long-term caching
  THING_STORAGE = 604800,    // 7 days - Individual games
  USER_STORAGE = 86400,      // 1 day - User profiles
  COLLECTION_STORAGE = 3600, // 1 hour - User collections
  PLAYS_STORAGE = 1800,      // 30 minutes - Play records
  GEEKLIST_STORAGE = 86400,  // 1 day - Individual geeklists
  GEEKLISTS_STORAGE = 3600,  // 1 hour - User geeklists
  HOT_ITEMS_STORAGE = 3600,  // 1 hour - Hot items
  SEARCH_STORAGE = 3600,     // 1 hour - Search results
}

/**
 * Helper function to get TTL in hours for storage operations
 */
export function getStorageTTLHours(ttl: CacheTTL): number {
  return ttl / 3600; // Convert seconds to hours
}

/**
 * Cache TTL configuration by entity type
 */
export const CACHE_CONFIG = {
  // L1 Cache TTLs (seconds)
  L1: {
    THING: CacheTTL.THING,
    USER: CacheTTL.USER,
    COLLECTION: CacheTTL.COLLECTION,
    PLAYS: CacheTTL.PLAYS,
    GEEKLIST: CacheTTL.GEEKLIST,
    GEEKLISTS: CacheTTL.GEEKLISTS,
    HOT_ITEMS: CacheTTL.HOT_ITEMS,
    SEARCH: CacheTTL.SEARCH,
  },
  
  // L2 Cache TTLs (hours)
  L2: {
    THING: getStorageTTLHours(CacheTTL.THING_STORAGE),
    USER: getStorageTTLHours(CacheTTL.USER_STORAGE),
    COLLECTION: getStorageTTLHours(CacheTTL.COLLECTION_STORAGE),
    PLAYS: getStorageTTLHours(CacheTTL.PLAYS_STORAGE),
    GEEKLIST: getStorageTTLHours(CacheTTL.GEEKLIST_STORAGE),
    GEEKLISTS: getStorageTTLHours(CacheTTL.GEEKLISTS_STORAGE),
    HOT_ITEMS: getStorageTTLHours(CacheTTL.HOT_ITEMS_STORAGE),
    SEARCH: getStorageTTLHours(CacheTTL.SEARCH_STORAGE),
  },
} as const;
