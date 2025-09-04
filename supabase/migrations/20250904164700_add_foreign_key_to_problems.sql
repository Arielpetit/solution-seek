-- Drop the existing foreign key constraint on user_id which references auth.users
ALTER TABLE public.problems DROP CONSTRAINT problems_user_id_fkey;

-- Add the new foreign key constraint to reference public.profiles
ALTER TABLE public.problems
ADD CONSTRAINT problems_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;