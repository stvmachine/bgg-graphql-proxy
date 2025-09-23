# BGG GraphQL Proxy

<<<<<<< HEAD
A GraphQL proxy for the BoardGameGeek API, deployed on Heroku.

## Local Development

```bash
npm install
npm run build
npm start
```

The GraphQL endpoint will be available at `http://localhost:4000/graphql`

## Heroku Deployment

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`

## Environment Variables

- `BGG_API_BASE_URL` (optional): Defaults to `https://boardgamegeek.com/xmlapi2`
=======
A simple and powerful GraphQL API for BoardGameGeek data, built with Hasura and PostgreSQL, deployed on Render.

## 🚀 Quick Start
>>>>>>> experimental

## GraphQL Endpoints

<<<<<<< HEAD
- **Local**: `http://localhost:4000/graphql`
- **Production**: `https://your-app-name.herokuapp.com/graphql`

## Example Query
=======
1. **Start the services:**
   ```bash
   npm start
   ```

2. **Install data fetcher dependencies:**
   ```bash
   npm run install-deps
   ```

3. **Fetch board game data:**
   ```bash
   npm run fetch-data
   ```

4. **Access the API:**
   - GraphQL endpoint: http://localhost:8080/v1/graphql
   - Hasura Console: http://localhost:8080/console
   - Admin secret: `myadminsecretkey`

### Deploy to Render

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Blueprint"
   - Connect your GitHub repo
   - Render will auto-detect `render.yaml`
   - Click "Apply"

3. **Get your live API:**
   - Web Service: `https://your-app-name.onrender.com`
   - GraphQL: `https://your-app-name.onrender.com/v1/graphql`
   - Console: `https://your-app-name.onrender.com/console`

## 📊 What's Included

- **PostgreSQL** database with board game data
- **Hasura** GraphQL engine with auto-generated API
- **Data fetcher** that populates the database from BGG API
- **Docker Compose** for easy setup
>>>>>>> experimental

## 🎮 Sample Queries

### Get Top Board Games
```graphql
<<<<<<< HEAD
query {
  search(query: "Catan") {
=======
query GetTopGames {
  things(
    limit: 10
    order_by: { average: desc }
  ) {
    id
    name
    year_published
    average
    users_rated
  }
}
```

### Search Games
```graphql
query SearchGames($search: String!) {
  things(
    where: { name: { _ilike: $search } }
  ) {
>>>>>>> experimental
    id
    name
    year_published
    average
  }
}
<<<<<<< HEAD
```
=======
```

### Get Game Details
```graphql
query GetGameDetails($id: String!) {
  things(where: { id: { _eq: $id } }) {
    id
    name
    year_published
    min_players
    max_players
    playing_time
    average
    categories { value }
    mechanics { value }
    designers { value }
  }
}
```

## 🛠️ Available Scripts

- `npm start` - Start all services
- `npm stop` - Stop all services
- `npm restart` - Restart all services
- `npm run logs` - View service logs
- `npm run fetch-data` - Fetch data from BGG API
- `npm run install-deps` - Install data fetcher dependencies
- `npm run db-reset` - Reset database (removes all data)
- `npm run hasura-console` - Open Hasura console
- `npm run graphql-endpoint` - Show GraphQL endpoint URL

## 📁 Project Structure

```
├── docker-compose.yml          # Local development setup
├── Dockerfile                  # Main Hasura service
├── Dockerfile.postgres         # PostgreSQL for Render
├── render.yaml                 # Render deployment config
├── hasura/
│   ├── data-fetcher.js         # BGG API data fetcher
│   ├── package.json            # Data fetcher dependencies
│   └── migrations/
│       └── 001_initial_schema/
│           ├── up.sql          # Database schema
│           └── down.sql        # Schema rollback
├── scripts/
│   └── fetch-data-render.js    # Render-specific data fetcher
├── HASURA_README.md           # Detailed setup instructions
├── HASURA_SUCCESS.md          # Implementation details
└── README.md                  # This file
```

## 🔧 Configuration

### Local Development
Uses default values - no configuration needed!

### Render Deployment
Environment variables are automatically set by Render:
- `HASURA_GRAPHQL_DATABASE_URL` - Connected to Render PostgreSQL
- `HASURA_GRAPHQL_ADMIN_SECRET` - Auto-generated
- `HASURA_GRAPHQL_JWT_SECRET` - Auto-generated
- `HASURA_GRAPHQL_CORS_DOMAIN` - Set to `*`

## 📈 Benefits

- **Zero Code GraphQL**: Hasura auto-generates the entire API
- **Real-time**: Built-in subscriptions
- **Powerful Filtering**: Advanced queries and relationships
- **Apollo Studio Compatible**: Full introspection support
- **Simple Setup**: Just run `npm start`

## 🎯 Next Steps

1. Add more board game data
2. Deploy to production
3. Add authentication if needed
4. Add monitoring and logging

---

**Note**: This project focuses on board game data only. No individual user data is stored.
>>>>>>> experimental
