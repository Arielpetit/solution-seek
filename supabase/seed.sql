-- Seed the database with a test user
INSERT INTO auth.users (id, email, encrypted_password, role)
VALUES ('c34483a8-b3b2-4a09-a72f-7359fe323be7', 'test@example.com', crypt('password', gen_salt('bf')), 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, username, avatar_url)
VALUES ('c34483a8-b3b2-4a09-a72f-7359fe323be7', 'Test User', 'testuser', 'https://i.pravatar.cc/150?u=testuser')
ON CONFLICT (id) DO NOTHING;