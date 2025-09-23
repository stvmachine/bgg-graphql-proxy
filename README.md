# BGG GraphQL Proxy

A GraphQL proxy for the BoardGameGeek API, built with Apollo Server v5 and deployed on Heroku.

## 🚀 Live API

- **GraphQL Endpoint**: https://bgg-graphql-proxy-9baf44927986.herokuapp.com/graphql
- **Health Check**: https://bgg-graphql-proxy-9baf44927986.herokuapp.com/health

## 🛠️ Local Development

### Prerequisites
- Node.js 20+ 
- npm

### Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

The GraphQL endpoint will be available at `http://localhost:4000/graphql`

## 🚀 Heroku Deployment

### Prerequisites
- Heroku CLI installed
- Git repository

### Deploy
```bash
# Login to Heroku
heroku login

# Create Heroku app (if not already created)
heroku create your-app-name

# Deploy to Heroku
git push heroku main
```

### Environment Variables
- `BGG_API_BASE_URL` (optional): Defaults to `https://boardgamegeek.com/xmlapi2`
- `NODE_ENV`: Set to `production` for production deployment

## 📊 GraphQL Schema

The API provides access to BoardGameGeek data through a clean GraphQL interface:

### Core Types
- **Game**: Board game information
- **Search**: Search functionality for games
- **Thing**: Detailed game data from BGG

## 🎮 Example Queries

### Search for Games
```graphql
query SearchGames {
  search(query: "Catan") {
    id
    name
    yearPublished
    minPlayers
    maxPlayers
    playingTime
    averageRating
    numRatings
  }
}
```

### Get Game Details
```graphql
query GetGameDetails {
  thing(id: "13") {
    id
    name
    yearPublished
    minPlayers
    maxPlayers
    playingTime
    averageRating
    numRatings
    description
    categories
    mechanics
    designers
    artists
    publishers
  }
}
```

### Get Top Rated Games
```graphql
query GetTopGames {
  search(query: "top") {
    id
    name
    yearPublished
    averageRating
    numRatings
  }
}
```

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run generate-types` - Generate TypeScript types from GraphQL schema

## 📁 Project Structure

```
├── src/
│   ├── datasources/          # Data source implementations
│   │   ├── bggDataSource.ts  # BGG API integration
│   │   └── index.ts
│   ├── resolvers/            # GraphQL resolvers
│   │   └── index.ts
│   ├── schema/               # GraphQL schema
│   │   └── schema.graphql
│   └── generated/             # Auto-generated types
│       └── graphql.ts
├── dist/                     # Compiled JavaScript
├── index.ts                  # Main server file
├── package.json
├── tsconfig.json
└── Procfile                  # Heroku deployment config
```

## 🔧 Technology Stack

- **Apollo Server v5**: GraphQL server with Express integration
- **TypeScript**: Type-safe development
- **Express**: Web framework
- **CORS**: Cross-origin resource sharing
- **Axios**: HTTP client for BGG API
- **xml2js**: XML parsing for BGG responses


## 🎯 Usage with Apollo Studio

1. Go to [Apollo Studio](https://studio.apollographql.com/sandbox/explorer)
2. Enter your endpoint: `https://bgg-graphql-proxy-9baf44927986.herokuapp.com/graphql`
3. Start exploring the schema and running queries!

---

**Note**: This is a proxy service for the BoardGameGeek API. All game data is sourced from BoardGameGeek.com.