-- Create favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  movie_id TEXT NOT NULL,
  movie_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create watchlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  movie_id TEXT NOT NULL,
  movie_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS on tables
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for watchlist
DROP POLICY IF EXISTS "Users can view their own watchlist" ON watchlist;
CREATE POLICY "Users can view their own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own watchlist" ON watchlist;
CREATE POLICY "Users can insert their own watchlist" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own watchlist" ON watchlist;
CREATE POLICY "Users can delete their own watchlist" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_created_at ON watchlist(created_at);

-- Create stored procedures for creating tables
CREATE OR REPLACE FUNCTION create_favorites_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    movie_id TEXT NOT NULL,
    movie_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
  );
  
  ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);
  
  CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
  CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_watchlist_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS watchlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    movie_id TEXT NOT NULL,
    movie_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
  );
  
  ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view their own watchlist" ON watchlist
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own watchlist" ON watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own watchlist" ON watchlist
    FOR DELETE USING (auth.uid() = user_id);
  
  CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
  CREATE INDEX IF NOT EXISTS idx_watchlist_created_at ON watchlist(created_at);
END;
$$ LANGUAGE plpgsql;
