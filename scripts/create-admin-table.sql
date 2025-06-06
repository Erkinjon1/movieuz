-- Admin panel uchun foydalanuvchilar ma'lumotlarini saqlash jadvali
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  email_confirmed_at TIMESTAMP WITH TIME ZONE
);

-- RLS ni yoqish
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Admin foydalanuvchilar uchun policy
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (
      'admin@example.com',
      'erkinjonrabbimov1@gmail.com', 
      'xayrullayevsherzodthe@gmail.com'
    )
  );

-- Foydalanuvchilar o'z profilini ko'rishi mumkin
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Foydalanuvchilar o'z profilini yangilashi mumkin
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Yangi foydalanuvchi ro'yxatdan o'tganda profil yaratish
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, full_name, created_at, email_confirmed_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.created_at,
    NEW.email_confirmed_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger yaratish
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Foydalanuvchi kirganida oxirgi kirish vaqtini yangilash
CREATE OR REPLACE FUNCTION update_last_sign_in()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    UPDATE user_profiles 
    SET last_sign_in_at = NEW.last_sign_in_at
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger yaratish
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_last_sign_in();

-- Mavjud foydalanuvchilar uchun ma'lumotlarni qo'shish (agar mavjud bo'lsa)
INSERT INTO user_profiles (user_id, email, full_name, created_at)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  created_at
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;
