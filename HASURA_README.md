# BGG GraphQL Proxy - Hasura Approach

This is an experimental branch that implements the BGG GraphQL proxy using Hasura instead of Apollo Server.

## Architecture

- **PostgreSQL**: Stores BGG data in a relational format
- **Hasura**: Provides instant GraphQL API with auto-generated queries, mutations, and subscriptions
- **Data Fetcher**: Node.js script that fetches data from BGG API and stores it in PostgreSQL

## Quick Start

1. **Start the services:**
   ```bash
   docker-compose up -d
   ```

2. **Wait for services to be ready:**
   ```bash
   # Check if Hasura is ready
   curl http://localhost:8080/healthz
   ```

3. **Apply database migrations:**
   ```bash
   # Hasura will automatically apply migrations when it starts
   # Or you can apply them manually:
   hasura migrate apply --database-name default
   ```

4. **Install data fetcher dependencies:**
   ```bash
   cd hasura
   npm install
   ```

5. **Fetch and populate data:**
   ```bash
   npm start
   ```

6. **Access Hasura Console:**
   - Open http://localhost:8080/console
   - Admin secret: `myadminsecretkey`

7. **Test GraphQL API:**
   - GraphQL endpoint: http://localhost:8080/v1/graphql
   - GraphiQL: http://localhost:8080/console/api/graphql

## Database Schema

**Board Game Data Only** - No individual user data is stored:

- `things`: Main board game data (id, name, year_published, average, etc.)
- `categories`: Game categories (Adventure, Fantasy, etc.)
- `mechanics`: Game mechanics (Hand Management, Set Collection, etc.)
- `designers`: Game designers (Isaac Childres, etc.)
- `artists`: Game artists
- `publishers`: Game publishers
- `ranks`: Game rankings

**Note**: Fields like `users_rated`, `users_owned`, etc. are aggregate statistics about the board game (how many users rated it), not individual user data.

## GraphQL Queries

Once data is populated, you can query:

```graphql
query GetGames {
  things(limit: 10, order_by: {average: desc}) {
    id
    name
    year_published
    min_players
    max_players
    playing_time
    average
    bayes_average
    users_rated
    categories {
      value
    }
    mechanics {
      value
    }
    designers {
      value
    }
  }
}

query SearchGames($search: String!) {
  things(where: {name: {_ilike: $search}}) {
    id
    name
    year_published
    average
  }
}
```

## Benefits of Hasura Approach

1. **Zero Code GraphQL**: Hasura automatically generates GraphQL API from database schema
2. **Real-time**: Built-in subscriptions for real-time updates
3. **Powerful Filtering**: Advanced where clauses, aggregations, and relationships
4. **Auto-generated Types**: TypeScript types generated automatically
5. **Built-in Auth**: Easy to add authentication and authorization
6. **Performance**: Optimized queries with proper indexing

## Next Steps

1. Add more BGG data (users, collections, plays, etc.)
2. Implement caching with Redis
3. Add authentication
4. Deploy to production
5. Add rate limiting and monitoring
