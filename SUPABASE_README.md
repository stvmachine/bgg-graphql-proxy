# 🚀 BGG GraphQL Proxy with Supabase (Free Forever!)

A simple and powerful GraphQL API for BoardGameGeek data, built with Supabase and PostgreSQL.

## 🎯 Why Supabase?

- ✅ **Free forever** (500MB database, unlimited requests)
- ✅ **Built-in GraphQL** (no Hasura needed)
- ✅ **PostgreSQL database**
- ✅ **Easy to use**
- ✅ **Great documentation**

## 🚀 Quick Start

### Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Fill in project details:**
   - Name: `bgg-graphql-proxy`
   - Database Password: (generate a strong password)
   - Region: Choose closest to you
5. **Click "Create new project"**
6. **Wait for setup** (2-3 minutes)

### Step 2: Set Up Database Schema

1. **Go to SQL Editor** in Supabase dashboard
2. **Run the SQL** from `supabase-setup.md` to create the schema
3. **Enable Row Level Security** for public read access

### Step 3: Get Your Credentials

After project creation, you'll get:
- **Project URL**: `https://your-project-id.supabase.co`
- **API Key**: `eyJ...` (anon key)
- **Database URL**: `postgres://postgres:password@db.your-project-id.supabase.co:5432/postgres`

### Step 4: Populate Data

```bash
# Set your Supabase credentials
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export DATABASE_URL="postgres://postgres:password@db.your-project-id.supabase.co:5432/postgres"

# Run the data fetcher
npm run fetch-data:supabase
```

### Step 5: Test Your API

Your GraphQL API will be available at:
- **URL**: `https://your-project-id.supabase.co/graphql/v1`
- **Headers**: 
  - `apikey: your-anon-key`
  - `Authorization: Bearer your-anon-key`

#### Test Query:
```graphql
query {
  things(limit: 5) {
    id
    name
    year_published
    average
  }
}
```

## 📊 What's Included

- **PostgreSQL** database with board game data
- **Built-in GraphQL** API (no Hasura needed)
- **Real-time subscriptions**
- **Row Level Security**
- **Easy to use**

## 🔧 Available Scripts

```bash
# Set up Supabase
npm run supabase:setup

# Fetch data from BGG API
npm run fetch-data:supabase

# Local development (with Hasura)
npm start
npm run fetch-data
```

## 📈 Benefits

- **Zero Code GraphQL**: Supabase auto-generates the entire API
- **Real-time**: Built-in subscriptions
- **Free forever**: 500MB database, unlimited requests
- **Easy to use**: Great documentation and UI
- **PostgreSQL**: Full SQL power
- **Authentication**: Built-in user management

## 🆓 Free Tier Limits

- **Database**: 500MB storage
- **Bandwidth**: 2GB/month
- **API requests**: Unlimited
- **Realtime connections**: 200 concurrent

## 🎉 Your API is Live!

Once set up, your GraphQL API will be live at:
`https://your-project-id.supabase.co/graphql/v1`

No deployment needed - it's automatically available! 🚀

