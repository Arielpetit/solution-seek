CREATE TABLE public.solution_funding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD'
);

CREATE INDEX solution_funding_solution_id_idx ON public.solution_funding(solution_id);
CREATE INDEX solution_funding_user_id_idx ON public.solution_funding(user_id);

ALTER TABLE public.solution_funding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert funding" ON public.solution_funding FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to view funding for any solution" ON public.solution_funding FOR SELECT USING (true);