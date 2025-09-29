# BGG GraphQL Proxy

A GraphQL proxy for the BoardGameGeek API, built with Apollo Server v4 and deployed on Vercel.

## 🚀 Live API

- **GraphQL Endpoint**: `https://your-project.vercel.app/graphql`
- **Health Check**: `https://your-project.vercel.app/health`
- **Root**: `https://your-project.vercel.app/`

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

## 🚀 Vercel Deployment

### Prerequisites
- Vercel CLI installed
- Git repository

### Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

### Environment Variables
Set these in your Vercel dashboard:
- `REDIS_URL` (optional): Your Redis connection string for caching
- `BGG_API_BASE_URL` (optional): Defaults to `https://boardgamegeek.com/xmlapi2`
- `NODE_ENV`: Automatically set to `production` by Vercel

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
- `npm run vercel-build` - Build for Vercel deployment
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
├── vercel.json               # Vercel deployment config
├── package.json
└── tsconfig.json
```

## 🔧 Technology Stack

- **Apollo Server v4**: GraphQL server with Express integration
- **TypeScript**: Type-safe development
- **Express**: Web framework
- **Vercel**: Serverless deployment platform
- **Redis**: Caching layer (optional)
- **CORS**: Cross-origin resource sharing
- **Axios**: HTTP client for BGG API
- **xml2js**: XML parsing for BGG responses


## 🎯 Usage with Apollo Studio

1. Go to [Apollo Studio](https://studio.apollographql.com/sandbox/explorer)
2. Enter your endpoint: `https://your-project.vercel.app/graphql`
3. Start exploring the schema and running queries!

## 📚 Additional Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) - Detailed Vercel deployment instructions

---

**Note**: This is a proxy service for the BoardGameGeek API. All game data is sourced from BoardGameGeek.com.