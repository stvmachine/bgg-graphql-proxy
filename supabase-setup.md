# 🚀 Supabase Setup (Free Forever)

## Why Supabase?
- ✅ **Free forever** (500MB database, unlimited requests)
- ✅ **Built-in GraphQL** (no Hasura needed)
- ✅ **PostgreSQL database**
- ✅ **Easy to use**
- ✅ **Great documentation**

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Choose organization** (or create one)
5. **Fill in project details:**
   - Name: `bgg-graphql-proxy`
   - Database Password: (generate a strong password)
   - Region: Choose closest to you
6. **Click "Create new project"**
7. **Wait for setup** (2-3 minutes)

## Step 2: Get Your Credentials

After project creation, you'll get:
- **Project URL**: `https://your-project-id.supabase.co`
- **API Key**: `eyJ...` (anon key)
- **Database URL**: `postgres://postgres:password@db.your-project-id.supabase.co:5432/postgres`

## Step 3: Set Up Database Schema

1. **Go to SQL Editor** in Supabase dashboard
2. **Run this SQL** to create the schema:

```sql
-- Create the things table
CREATE TABLE things (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    alternate_names JSONB DEFAULT '[]'::jsonb,
    year_published INTEGER,
    min_players INTEGER,
    max_players INTEGER,
    playing_time INTEGER,
    min_play_time INTEGER,
    max_play_time INTEGER,
    min_age INTEGER,
    description TEXT,
    image TEXT,
    thumbnail TEXT,
    average DOUBLE PRECISION,
    bayes_average DOUBLE PRECISION,
    users_rated INTEGER,
    users_owned INTEGER,
    users_wanting INTEGER,
    users_wishing INTEGER,
    num_comments INTEGER,
    num_weights INTEGER,
    average_weight DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_things_name ON things (name);
CREATE INDEX idx_things_type ON things (type);
CREATE INDEX idx_things_year_published ON things (year_published);
CREATE INDEX idx_things_average ON things (average);

-- Create categories table
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    thing_id TEXT NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_categories_thing_id ON categories (thing_id);

-- Create mechanics table
CREATE TABLE mechanics (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    thing_id TEXT NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_mechanics_thing_id ON mechanics (thing_id);

-- Create designers table
CREATE TABLE designers (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    thing_id TEXT NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_designers_thing_id ON designers (thing_id);

-- Create artists table
CREATE TABLE artists (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    thing_id TEXT NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_artists_thing_id ON artists (thing_id);

-- Create publishers table
CREATE TABLE publishers (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    thing_id TEXT NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_publishers_thing_id ON publishers (thing_id);

-- Create ranks table
CREATE TABLE ranks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    friendly_name TEXT,
    value INTEGER NOT NULL,
    bayes_average DOUBLE PRECISION,
    thing_id TEXT NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ranks_thing_id ON ranks (thing_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_things_updated_at BEFORE UPDATE ON things FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mechanics_updated_at BEFORE UPDATE ON mechanics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_designers_updated_at BEFORE UPDATE ON designers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publishers_updated_at BEFORE UPDATE ON publishers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ranks_updated_at BEFORE UPDATE ON ranks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Enable Row Level Security (RLS)

1. **Go to Authentication > Policies** in Supabase dashboard
2. **Enable RLS** for all tables
3. **Create policies** to allow public read access:

```sql
-- Enable RLS
ALTER TABLE things ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON things FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON mechanics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON designers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON artists FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON publishers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ranks FOR SELECT USING (true);
```

## Step 5: Test Your GraphQL API

Your GraphQL API will be available at:
- **URL**: `https://your-project-id.supabase.co/graphql/v1`
- **Headers**: 
  - `apikey: your-anon-key`
  - `Authorization: Bearer your-anon-key`

### Test Query:
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

## Step 6: Populate Data

Use the data fetcher script to populate your database:

```bash
# Set your Supabase credentials
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export DATABASE_URL="postgres://postgres:password@db.your-project-id.supabase.co:5432/postgres"

# Run the data fetcher
npm run fetch-data:supabase
```

## 🎉 Benefits of Supabase

1. **Free forever** (500MB database, unlimited requests)
2. **Built-in GraphQL** (no Hasura needed)
3. **PostgreSQL database**
4. **Easy to use**
5. **Great documentation**
6. **Real-time subscriptions**
7. **Authentication built-in**

## 📊 Free Tier Limits

- **Database**: 500MB storage
- **Bandwidth**: 2GB/month
- **API requests**: Unlimited
- **Realtime connections**: 200 concurrent

Your GraphQL API will be live at `https://your-project-id.supabase.co/graphql/v1` 🚀

