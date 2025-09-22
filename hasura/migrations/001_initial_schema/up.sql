-- Create tables for BGG data
CREATE TABLE IF NOT EXISTS public.things (
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
    average FLOAT,
    bayes_average FLOAT,
    users_rated INTEGER,
    users_owned INTEGER,
    users_wanting INTEGER,
    users_wishing INTEGER,
    num_comments INTEGER,
    num_weights INTEGER,
    average_weight FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    thing_id TEXT REFERENCES public.things(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mechanics (
    id SERIAL PRIMARY KEY,
    thing_id TEXT REFERENCES public.things(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.designers (
    id SERIAL PRIMARY KEY,
    thing_id TEXT REFERENCES public.things(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.artists (
    id SERIAL PRIMARY KEY,
    thing_id TEXT REFERENCES public.things(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.publishers (
    id SERIAL PRIMARY KEY,
    thing_id TEXT REFERENCES public.things(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ranks (
    id SERIAL PRIMARY KEY,
    thing_id TEXT REFERENCES public.things(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    rank_id TEXT NOT NULL,
    name TEXT NOT NULL,
    friendly_name TEXT NOT NULL,
    value TEXT NOT NULL,
    bayes_average TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_things_type ON public.things(type);
CREATE INDEX IF NOT EXISTS idx_things_name ON public.things(name);
CREATE INDEX IF NOT EXISTS idx_things_year_published ON public.things(year_published);
CREATE INDEX IF NOT EXISTS idx_things_average ON public.things(average);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for things table
CREATE TRIGGER update_things_updated_at 
    BEFORE UPDATE ON public.things 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
