# Redis Setup Guide

This guide shows you how to set up **free Redis** for your BGG GraphQL Proxy.

## 🎯 **Redis-Only Caching**

- **All Environments**: Redis is **REQUIRED** (will fail if not configured)
- **No Fallback**: No in-memory cache fallback
- **Consistent**: Same caching behavior across all environments

## 🆓 **Free Redis Options**

### 1. **Upstash Redis** (Recommended)
- ✅ **10,000 requests/day** free
- ✅ **256MB storage** free
- ✅ **Global edge locations**
- ✅ **REST API** (perfect for serverless)

### 2. **Redis Cloud**
- ✅ **30MB storage** free
- ✅ **30 connections** free
- ✅ **Standard Redis protocol**

### 3. **Railway Redis**
- ✅ **Free with Railway deployment**
- ✅ **Managed Redis instance**

## 🚀 **Quick Setup with Upstash**

### Step 1: Create Upstash Account
1. Go to [upstash.com](https://upstash.com)
2. Sign up with GitHub
3. Create a new Redis database
4. Choose the **free tier**

### Step 2: Get Your Credentials
1. Go to your Redis database dashboard
2. Copy the **REST URL** and **REST Token**
3. Add them to your **production environment variables**

### Step 3: Install Dependencies
```bash
npm install @upstash/redis
```

### Step 4: Test Locally
```bash
npm run dev
```

You should see: `🔴 MemoryCache: Using Redis for caching`

## 🔧 **How It Works**

### **All Environments**
- **Required**: Redis is mandatory for all environments
- **No Fallback**: Application will not start without Redis
- **Consistent**: Same caching behavior everywhere
- **Scalable**: Handles multiple server instances

### **Cache Architecture**

```
GraphQL Query
    ↓
L2 Cache (KeyValueDatabase) - Long-term storage
    ↓
L1 Cache (MemoryCache + Redis) - Fast access
    ↓
BGG API - External data source
```

## 🎯 **Environment Variables**

### **All Environments (.env)**
```bash
# Redis Configuration - REQUIRED for all environments
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Storage Configuration
STORAGE_TYPE=keyvalue  # or 'dynamodb' for production
```

## 🚀 **Deployment**

### **Vercel Deployment**
1. Set environment variables in Vercel dashboard
2. Deploy your app
3. Redis will work automatically in production!

### **Railway Deployment**
1. Add Redis service in Railway
2. Environment variables are auto-configured
3. Deploy your app

## 📈 **Monitoring**

### **Upstash Dashboard**
- View request count
- Monitor storage usage
- Check performance metrics

### **Free Tier Limits**
- **Upstash**: 10,000 requests/day, 256MB storage
- **Redis Cloud**: 30MB storage, 30 connections
- **Railway**: $5/month credit (effectively free)

## 🔧 **Troubleshooting**

### **Local Development**
- No Redis needed - uses in-memory cache
- Check server logs for cache status

### **Production Redis Issues**
- Check your credentials
- Verify the URL format
- Redis errors fall back to memory cache

## 💡 **Pro Tips**

1. **Local Development**: No setup needed - just run `npm run dev`
2. **Production**: Set Redis environment variables
3. **Monitor usage**: Stay within free limits
4. **Test locally**: Verify everything works before deploying

Your GraphQL API will automatically use the right caching strategy for each environment! 🎉
