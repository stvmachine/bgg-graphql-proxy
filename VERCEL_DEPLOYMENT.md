# Vercel Deployment Guide

This guide will help you deploy your BGG GraphQL Proxy to Vercel.

## Prerequisites

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Set Environment Variables
In your Vercel dashboard, set the following environment variables:

- `REDIS_URL` (optional): Your Redis connection string for caching
- `BGG_API_BASE_URL` (optional): Defaults to `https://boardgamegeek.com/xmlapi2`

## API Endpoints

After deployment, your API will be available at:

- **GraphQL**: `https://your-project.vercel.app/api/graphql`
- **Health Check**: `https://your-project.vercel.app/health`
- **Root**: `https://your-project.vercel.app/`

## Local Development

To run locally with the same structure as Vercel:

```bash
npm run dev
```

## Important Notes

1. **Apollo Server v4**: The project has been downgraded from v5 to v4 for Vercel compatibility
2. **Serverless Functions**: Each API route is a separate serverless function
3. **Redis Caching**: Optional - will fall back to in-memory cache if Redis is unavailable
4. **CORS**: Configured for cross-origin requests

## Troubleshooting

- If you encounter build errors, ensure all dependencies are properly installed
- Check the Vercel function logs in the dashboard for runtime errors
- Redis connection issues will automatically fall back to in-memory caching
