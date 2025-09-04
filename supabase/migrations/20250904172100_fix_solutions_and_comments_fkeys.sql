-- Drop the existing foreign key constraint on comments.user_id
ALTER TABLE public.comments DROP CONSTRAINT comments_user_id_fkey;

-- Add the new foreign key constraint to reference public.profiles
ALTER TABLE public.comments
ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Drop the existing foreign key constraint on solutions.user_id
ALTER TABLE public.solutions DROP CONSTRAINT solutions_user_id_fkey;

-- Add the new foreign key constraint to reference public.profiles
ALTER TABLE public.solutions
ADD CONSTRAINT solutions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;