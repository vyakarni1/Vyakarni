-- Fix the security definer view by removing SECURITY DEFINER and using regular view
DROP VIEW IF EXISTS public.blog_post_like_counts;

-- Create a simple view without SECURITY DEFINER (this is safer)
CREATE VIEW public.blog_post_like_counts AS
SELECT 
  post_id,
  COUNT(*) as like_count
FROM public.blog_likes
GROUP BY post_id;

-- Grant appropriate access to the view
GRANT SELECT ON public.blog_post_like_counts TO anon, authenticated;

-- Apply RLS to the view (inherits from base table)
ALTER VIEW public.blog_post_like_counts SET (security_barrier = true);

-- Create a safer function for getting like counts without exposing user IDs
CREATE OR REPLACE FUNCTION public.get_post_like_count(post_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::integer
  FROM public.blog_likes
  WHERE post_id = post_uuid;
$$;