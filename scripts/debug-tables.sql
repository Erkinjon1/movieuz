-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('favorites', 'watchlist');

-- Check table structure
\d favorites;
\d watchlist;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('favorites', 'watchlist');

-- Test insert (replace with your actual user ID)
-- INSERT INTO favorites (user_id, movie_id, movie_data) 
-- VALUES ('your-user-id-here', 'test-movie', '{"title": "Test Movie"}');
