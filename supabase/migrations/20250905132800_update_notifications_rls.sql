-- Drop the existing restrictive policy
DROP POLICY "Allow users to access their own notifications" ON public.notifications;

-- Create a new policy for SELECT
CREATE POLICY "Allow users to view their own notifications" ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create a new policy for UPDATE
CREATE POLICY "Allow users to update their own notifications" ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create a new policy for DELETE
CREATE POLICY "Allow users to delete their own notifications" ON public.notifications
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a new policy for INSERT
-- This allows any authenticated user to create a notification for any other user
CREATE POLICY "Allow authenticated users to create notifications" ON public.notifications
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');