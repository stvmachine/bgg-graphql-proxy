# BGG GraphQL Proxy

A modern GraphQL proxy for the BoardGameGeek API built with TypeScript, Apollo Server, Redis caching, and DynamoDB persistence. Designed for AWS deployment with cost-effective hosting.

## Features

- 🎮 **Complete BGG API Coverage**: Board games, users, collections, plays, geeklists, and more
- 🚀 **GraphQL API**: Modern, type-safe API with introspection and playground
- ⚡ **Apollo Caching**: Built-in HTTP caching with intelligent TTL
- 💾 **DynamoDB Storage**: Persistent data storage with TTL
- ☁️ **AWS Ready**: Serverless deployment with Lambda and API Gateway
- 🔧 **TypeScript**: Full type safety and excellent developer experience
- 📊 **Cost Effective**: Optimized for low-cost hosting

## Quick Start

### Prerequisites

- Node.js 18+
- Redis (local or AWS ElastiCache)
- AWS Account (for DynamoDB)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd bgg-graphql-proxy
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start Redis (using Docker):**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open GraphQL Playground:**
   - Visit: http://localhost:4000/graphql
   - Explore the schema and run queries

### Example Queries

```graphql
# Get a board game by ID
query GetGame {
  thing(id: "174430") {
    id
    name
    yearPublished
    minPlayers
    maxPlayers
    playingTime
    description
    average
    usersRated
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

# Search for games
query SearchGames {
  search(query: "Wingspan", type: BOARDGAME) {
    id
    name
    yearPublished
    average
  }
}

# Get user collection
query GetCollection {
  userCollection(username: "yourusername") {
    totalItems
    items {
      name
      yearPublished
      status {
        own
        wantToPlay
      }
    }
  }
}

# Get user plays
query GetPlays {
  userPlays(username: "yourusername", page: 1) {
    total
    plays {
      date
      quantity
      location
      item {
        name
      }
      players {
        username
        score
        win
      }
    }
  }
}
```

## AWS Deployment

### Option 1: Serverless Framework (Recommended)

1. **Install Serverless Framework:**
   ```bash
   npm install -g serverless
   npm install -D serverless-offline serverless-plugin-typescript
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   ```

3. **Set up Redis (ElastiCache):**
   - Create ElastiCache Redis cluster
   - Note the endpoint URL

4. **Deploy:**
   ```bash
   # Deploy to dev stage
   npm run build
   serverless deploy

   # Deploy to production
   serverless deploy --stage prod
   ```

### Option 2: AWS CDK

See `infrastructure/` directory for CDK deployment scripts.

### Option 3: Manual AWS Setup

1. **Create DynamoDB Tables:**
   - Use the CloudFormation template in `infrastructure/`
   - Or create tables manually with the schema from `serverless.yml`

2. **Set up ElastiCache Redis:**
   - Create Redis cluster
   - Configure security groups

3. **Deploy Lambda Function:**
   - Build: `npm run build`
   - Upload `dist/` folder to Lambda
   - Configure environment variables

## Cost Optimization

### DynamoDB
- **On-Demand Billing**: Pay only for what you use
- **TTL**: Automatic cleanup of old data
- **Single Table Design**: Reduces costs

### Lambda
- **Memory**: 512MB (adjust based on usage)
- **Timeout**: 30 seconds
- **Cold Start**: Optimized with minimal dependencies

### ElastiCache
- **t3.micro**: For development
- **t3.small**: For production
- **Reserved Instances**: For predictable workloads

### Estimated Monthly Costs (Low Traffic)
- DynamoDB: $1-5
- Lambda: $0-2
- ElastiCache: $15-25
- **Total: $16-32/month**

## Environment Variables

```bash
# Server
PORT=4000
NODE_ENV=development

# BGG API
BGG_API_BASE_URL=https://boardgamegeek.com/xmlapi2

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# DynamoDB
DYNAMODB_TABLE_PREFIX=bgg-graphql
DYNAMODB_ENDPOINT=  # Leave empty for production
```

## API Endpoints

- **GraphQL**: `/graphql`
- **Health Check**: `/health`
- **Root**: `/`

## Data Caching Strategy

### Apollo RESTDataSource (L1 Cache)
- **TTL**: 5-60 minutes depending on data type
- **Purpose**: Fast HTTP response caching
- **Storage**: Built-in Apollo Server caching

### DynamoDB (L2 Cache)
- **TTL**: 1-7 days depending on data type
- **Purpose**: Persistent storage, reduces BGG API calls
- **Storage**: Structured data with metadata

### Cache Invalidation
- Automatic TTL expiration
- Smart cache keys based on query parameters
- Built-in request deduplication

## Development

### Project Structure
```
src/
├── config/          # Configuration
├── resolvers/       # GraphQL resolvers
├── schema/          # GraphQL schema
├── services/        # Business logic
│   ├── bgg-api.ts   # BGG API client
│   ├── cache.ts     # Redis caching
│   └── dynamodb.ts  # DynamoDB operations
└── index.ts         # Main server file
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes codegen)
- `npm run start` - Start production server
- `npm run codegen` - Generate GraphQL types
- `npm run codegen:watch` - Watch mode for codegen
- `npm run type-check` - Type check without building

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [BoardGameGeek](https://boardgamegeek.com) for the amazing API
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for GraphQL
- [Serverless Framework](https://serverless.com) for AWS deployment
