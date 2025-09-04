-- Add a 'role' column to the profiles table to distinguish between regular users and administrators
ALTER TABLE public.profiles
ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Add a comment to the new column for clarity
COMMENT ON COLUMN public.profiles.role IS 'User role for authorization (e.g., user, admin)';