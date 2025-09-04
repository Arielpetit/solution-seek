-- Create a table to track downvotes on problems
CREATE TABLE public.problem_downvotes (
    id UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    CONSTRAINT problem_downvotes_user_id_problem_id_key UNIQUE (user_id, problem_id)
);

-- Add indexes for better performance
CREATE INDEX problem_downvotes_user_id_idx ON public.problem_downvotes(user_id);
CREATE INDEX problem_downvotes_problem_id_idx ON public.problem_downvotes(problem_id);

-- Enable Row Level Security
ALTER TABLE public.problem_downvotes ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Allow authenticated users to insert downvotes" ON public.problem_downvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to view all downvotes" ON public.problem_downvotes FOR SELECT USING (true);
CREATE POLICY "Allow users to delete their own downvotes" ON public.problem_downvotes FOR DELETE USING (auth.uid() = user_id);

-- Add comments for clarity
COMMENT ON TABLE public.problem_downvotes IS 'Tracks user downvotes on problems.';