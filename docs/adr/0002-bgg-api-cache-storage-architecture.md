# ADR-0002: BGG API, Cache, and Storage Architecture

## Status
Accepted

## Context
The BGG GraphQL Proxy needs to efficiently serve data from the BoardGameGeek XML API while providing fast response times and respecting API rate limits. The system must handle various data types with different update frequencies and provide a robust caching strategy.

## Decision
We will implement a two-tier caching architecture with the following components:

### 1. BGG API Data Source
- **Purpose**: Interface with BoardGameGeek XML API
- **Technology**: Apollo DataSource REST with xml2js parsing
- **Features**: 
  - XML to GraphQL data normalization
  - Built-in request caching with TTL
  - Error handling and retry logic
  - Rate limiting compliance

### 2. Two-Tier Caching System

#### Layer 1: Apollo Server Cache
- **Development**: In-memory cache (MemoryCache)
- **Production**: External cache (Redis/KeyValueCache)
- **Purpose**: HTTP-level response caching and request deduplication
- **TTL**: Short-term (5 minutes default)

#### Layer 2: Persistent Storage Cache
- **Technology**: AWS DynamoDB
- **Purpose**: Long-term data persistence across server restarts
- **Features**: TTL-based automatic expiration, hierarchical key structure

### 3. Cache Strategy by Data Type

| Data Type | Storage TTL | Reason |
|-----------|-------------|---------|
| Things (Games) | 7 days | Rarely change, expensive to fetch |
| Users | 1 day | Moderate change frequency |
| Collections | 1 hour | Can change frequently |
| Plays | 30 minutes | Very dynamic data |
| Search Results | 1 hour | Balance freshness vs performance |

## Implementation Details

### Cache Key Structure
```
thing:${id}                    // Individual games
user:${username}               // User profiles  
collection:${username}:${type} // User collections
plays:${username}:${params}    // Play records
search:${query}:${type}        // Search results
```

### Layer 1 (L1) - Apollo Server Cache Implementation

#### Setup in `src/index.ts`
```typescript
// L1 Cache Configuration
const cache = config.nodeEnv === 'production' 
  ? new KeyValueCache<string>()  // Production: External cache (Redis)
  : new MemoryCache();           // Development: In-memory cache

// L1 Cache attached to Apollo Server
const server = new ApolloServer<ApolloContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  cache,  // ← L1 Cache here
});
```

#### Usage in `src/datasources/bggDataSource.ts`
```typescript
// L1 Cache used in makeRequest method
private async makeRequest<T>(url: string, ttl?: number): Promise<T> {
  // Check L1 cache first
  if (this.cache && ttl) {
    const cacheKey = `bgg:${url}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      console.log(`L1 cache hit for: ${url}`);
      return JSON.parse(cached);
    }
  }
  
  // Make API request
  const response = await this.get(url);
  
  // Store in L1 cache
  if (this.cache && ttl) {
    const cacheKey = `bgg:${url}`;
    await this.cache.set(cacheKey, JSON.stringify(result), { ttl });
    console.log(`L1 cache stored for: ${url} (TTL: ${ttl}s)`);
  }
  
  return result;
}
```

#### L1 Cache TTL Values by Endpoint
```typescript
// Different TTL values for different API endpoints
const data = await this.makeRequest(`/thing?id=${id}&stats=1`, 300);     // 5 minutes
const data = await this.makeRequest(`/user?name=${username}`, 3600);     // 1 hour  
const data = await this.makeRequest(`/collection?username=${username}`, 1800); // 30 minutes
const data = await this.makeRequest(`/plays?username=${username}`, 900); // 15 minutes
const data = await this.makeRequest(`/geeklist/${id}`, 3600);            // 1 hour
const data = await this.makeRequest(`/hot`, 1800);                       // 30 minutes
```

### Layer 2 (L2) - Persistent Storage Cache Implementation

#### Setup in `src/index.ts`
```typescript
// L2 Cache (StorageDataSource) initialization
const dataSources = {
  bggAPI: new BGGDataSource(cache),  // L1 cache passed to BGGDataSource
  storage: new StorageDataSource(),  // ← L2 Cache here
};
```

#### Usage Pattern in `src/resolvers/index.ts`
Every resolver follows the same L2 pattern:

```typescript
// Example: thing resolver
thing: async (_, { id }, { dataSources }) => {
  // L2 Cache Check
  const cached = await dataSources.storage.getCachedThing(id);  // ← L2 Check
  if (cached) {
    return cached;  // ← L2 Hit - return immediately
  }

  // L1 Cache + BGG API Call
  const thing = await dataSources.bggAPI.getThing(id);  // ← Uses L1 cache internally
  if (thing) {
    // L2 Cache Store
    await dataSources.storage.cacheThing(id, thing);  // ← L2 Store
  }
  return thing;
},
```

#### L2 Cache Implementation in `src/datasources/storageDataSource.ts`
```typescript
// L2 Cache for Things (7 days TTL)
async cacheThing(id: string, thing: any): Promise<void> {
  await this.store(`thing:${id}`, thing, 168); // 7 days
}

async getCachedThing(id: string): Promise<any | null> {
  return await this.retrieve(`thing:${id}`);
}
```

#### L2 Cache TTL by Data Type
```typescript
// Different TTL values for different data types
await this.store(`thing:${id}`, thing, 168);           // 7 days
await this.store(`user:${username}`, user, 24);        // 1 day  
await this.store(key, collection, 1);                  // 1 hour
await this.store(key, plays, 0.5);                     // 30 minutes
await this.store(`geeklist:${id}`, geeklist, 24);      // 1 day
await this.store(key, geeklists, 1);                   // 1 hour
await this.store(key, items, 1);                       // 1 hour
await this.store(`search:${searchKey}`, results, 1);   // 1 hour
```

### Data Flow
1. GraphQL query received
2. Check L2 cache (StorageDataSource) - **Manual check in resolvers**
3. If L2 miss, call BGGDataSource
4. BGGDataSource checks L1 cache (Apollo) - **Automatic**
5. If L1 miss, call BGG API
6. Normalize data to GraphQL schema
7. Store in L2 cache - **Manual store in resolvers**
8. L1 cache is automatically populated by Apollo
9. Return response

### Cache Layer Comparison

| Layer | Location | Purpose | TTL | Persistence | Implementation |
|-------|----------|---------|-----|-------------|----------------|
| **L1** | `bggDataSource.ts` | HTTP response caching | 5min - 1hr | Memory only | Automatic (Apollo) |
| **L2** | `resolvers/index.ts` | Long-term storage | 30min - 7days | DynamoDB | Manual (explicit checks) |

### Environment Configuration
- **Development**: Memory cache + optional local DynamoDB
- **Production**: External cache + AWS DynamoDB
- **Security**: CORS restrictions, helmet headers

## Consequences

### Positive
- **Performance**: Fast response times for cached data
- **Cost Optimization**: Reduced BGG API calls
- **Scalability**: Can handle high traffic without hitting rate limits
- **Reliability**: Graceful degradation when caches fail
- **Flexibility**: Different TTLs for different data types

### Negative
- **Complexity**: Two-tier caching adds architectural complexity
- **Storage Costs**: DynamoDB usage costs
- **Cache Invalidation**: Need to handle cache consistency
- **Memory Usage**: In-memory cache in development

### Risks
- **Cache Staleness**: Data might be outdated if TTL is too long
- **Storage Failure**: System degrades gracefully but performance suffers
- **Memory Leaks**: In-memory cache needs proper cleanup
- **Cost Overrun**: DynamoDB costs could grow with usage

## Alternatives Considered

### Single Cache Layer
- **Rejected**: Insufficient for long-term persistence and performance

### No Caching
- **Rejected**: Would violate BGG API rate limits and provide poor performance

### Database-First Approach
- **Rejected**: BGG data is read-heavy, caching is more appropriate

## Monitoring and Metrics

### Key Metrics to Track
- Cache hit rates (Apollo + Storage)
- BGG API call frequency
- Response times by data type
- Storage costs and usage
- Error rates and types

### Alerts
- High BGG API call rates
- Low cache hit rates
- Storage failures
- High response times

## References
- [Apollo DataSource Documentation](https://www.apollographql.com/docs/apollo-server/data/data-sources/)
- [DynamoDB TTL Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)
- [BoardGameGeek XML API](https://boardgamegeek.com/wiki/page/BGG_XML_API2)

## Review Date
2024-01-01

## Reviewers
- Development Team
- DevOps Team
- Product Team
