-- First, let's check what profiles exist and create admin profiles if needed
INSERT INTO public.profiles (id, name, email) 
SELECT 
  gen_random_uuid() as id,
  'Admin User' as name,
  'admin@vyakarani.com' as email
WHERE NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1);

-- Update all existing blog posts to reference the first profile as author
UPDATE public.blog_posts 
SET author_id = (SELECT id FROM public.profiles LIMIT 1)
WHERE author_id IS NULL OR author_id NOT IN (SELECT id FROM public.profiles);

-- Add foreign key constraint between blog_posts and profiles
ALTER TABLE public.blog_posts 
ADD CONSTRAINT fk_blog_posts_author_id 
FOREIGN KEY (author_id) REFERENCES public.profiles(id);