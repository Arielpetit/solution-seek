CREATE TABLE public.solution_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
    CONSTRAINT solution_collaborators_solution_id_user_id_key UNIQUE (solution_id, user_id)
);

CREATE INDEX solution_collaborators_solution_id_idx ON public.solution_collaborators(solution_id);
CREATE INDEX solution_collaborators_user_id_idx ON public.solution_collaborators(user_id);

ALTER TABLE public.solution_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert collaboration requests" ON public.solution_collaborators FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to view collaboration requests for their solutions" ON public.solution_collaborators FOR SELECT USING (exists (select 1 from solutions where solutions.id = solution_collaborators.solution_id and solutions.user_id = auth.uid()));
CREATE POLICY "Allow users to update the status of collaboration requests for their solutions" ON public.solution_collaborators FOR UPDATE USING (exists (select 1 from solutions where solutions.id = solution_collaborators.solution_id and solutions.user_id = auth.uid()));
CREATE POLICY "Allow users to delete their own collaboration requests" ON public.solution_collaborators FOR DELETE USING (auth.uid() = user_id);
