-- Create the storage bucket for problem images
INSERT INTO storage.buckets (id, name, "public")
VALUES ('problem-images', 'problem-images', true);

-- Allow public read access to the bucket
CREATE POLICY "Public read access for problem images"
ON storage.objects FOR SELECT
USING (bucket_id = 'problem-images');

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Authenticated users can upload problem images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'problem-images' AND auth.role() = 'authenticated');