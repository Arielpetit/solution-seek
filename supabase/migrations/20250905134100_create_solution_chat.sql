CREATE TABLE public.solution_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

CREATE INDEX solution_chat_messages_solution_id_idx ON public.solution_chat_messages(solution_id);

ALTER TABLE public.solution_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow team members to view chat messages" ON public.solution_chat_messages
    FOR SELECT
    USING (
        (EXISTS ( SELECT 1
           FROM solutions
          WHERE ((solutions.id = solution_chat_messages.solution_id) AND (solutions.user_id = auth.uid())))) OR 
        (EXISTS ( SELECT 1
           FROM solution_collaborators
          WHERE ((solution_collaborators.solution_id = solution_chat_messages.solution_id) AND (solution_collaborators.user_id = auth.uid()) AND (solution_collaborators.status = 'accepted'::text))))
    );

CREATE POLICY "Allow team members to send chat messages" ON public.solution_chat_messages
    FOR INSERT
    WITH CHECK (
        (EXISTS ( SELECT 1
           FROM solutions
          WHERE ((solutions.id = solution_chat_messages.solution_id) AND (solutions.user_id = auth.uid())))) OR 
        (EXISTS ( SELECT 1
           FROM solution_collaborators
          WHERE ((solution_collaborators.solution_id = solution_chat_messages.solution_id) AND (solution_collaborators.user_id = auth.uid()) AND (solution_collaborators.status = 'accepted'::text))))
    );

ALTER TABLE public.solution_chat_messages CLUSTER ON solution_chat_messages_solution_id_idx;

ALTER PUBLICATION supabase_realtime ADD TABLE public.solution_chat_messages;