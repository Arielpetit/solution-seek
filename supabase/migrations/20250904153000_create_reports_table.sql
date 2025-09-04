CREATE TABLE public.reports (
    id UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending'::text NOT NULL,
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    problem_id UUID REFERENCES public.problems(id),
    solution_id UUID REFERENCES public.solutions(id),
    comment_id UUID REFERENCES public.comments(id)
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin users to view all reports" ON public.reports FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::text));
CREATE POLICY "Allow admin users to update reports" ON public.reports FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::text));

-- Add a comment to the table to make it easier to understand
COMMENT ON TABLE public.reports IS 'Stores reports submitted by users for content moderation.';