# 🚀 BGG GraphQL Proxy - Deployment Guide

## ✅ **Fixed Issues:**

### **Node.js Version:**
- ✅ Changed from Node.js 22 to Node.js 18 (Vercel compatible)
- ✅ No more version warnings

### **Vercel Configuration:**
- ✅ Removed deprecated `builds` array
- ✅ Uses TypeScript directly in `api/handler.ts`
- ✅ Vercel automatically compiles TypeScript to JavaScript
- ✅ Routes point to `/api/handler` (Vercel serverless functions)

## 🚀 **Deployment Steps:**

### **1. Build & Test Locally:**
```bash
# Build the project
npm run build

# Test locally
npm run dev
```

### **2. Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or for production
vercel --prod
```

### **3. Environment Variables:**
Set in Vercel dashboard:
```
NODE_ENV=production
BGG_API_BASE_URL=https://boardgamegeek.com/xmlapi2
```

## 📊 **API Endpoints:**

- **GraphQL**: `https://your-app.vercel.app/graphql`
- **Health**: `https://your-app.vercel.app/health`
- **Root**: `https://your-app.vercel.app/`

## 🎯 **Test Queries:**

### **Health Check:**
```bash
curl https://your-app.vercel.app/health
```

### **GraphQL Query:**
```bash
curl -X POST https://your-app.vercel.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ thing(id: \"174430\") { id name yearPublished } }"}'
```

### **Search Query:**
```bash
curl -X POST https://your-app.vercel.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ search(query: \"Catan\") { id name yearPublished } }"}'
```

## 🎉 **Architecture Benefits:**

- ✅ **Simple & Fast** - Direct BGG API calls
- ✅ **No Cache Complexity** - Always fresh data
- ✅ **Free Hosting** - Vercel free tier
- ✅ **Auto-scaling** - Serverless functions
- ✅ **Global CDN** - Fast worldwide

The simplified architecture is now ready for production deployment! 🚀
