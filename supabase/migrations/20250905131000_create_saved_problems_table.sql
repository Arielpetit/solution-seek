CREATE TABLE public.saved_problems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    CONSTRAINT saved_problems_user_id_problem_id_key UNIQUE (user_id, problem_id)
);

CREATE INDEX saved_problems_user_id_idx ON public.saved_problems(user_id);
CREATE INDEX saved_problems_problem_id_idx ON public.saved_problems(problem_id);

ALTER TABLE public.saved_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to access their own saved problems" ON public.saved_problems
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);