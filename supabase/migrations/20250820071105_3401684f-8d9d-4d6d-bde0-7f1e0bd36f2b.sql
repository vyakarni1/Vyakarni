-- Security Fix 6: Restrict blog_likes visibility to protect user privacy
DROP POLICY IF EXISTS "Anyone can view like counts" ON public.blog_likes;

-- New policy: Only allow users to see their own likes and admins to see all
CREATE POLICY "Users can view their own likes" 
ON public.blog_likes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all likes" 
ON public.blog_likes 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create a view for public like counts that doesn't expose user IDs
CREATE OR REPLACE VIEW public.blog_post_like_counts AS
SELECT 
  post_id,
  COUNT(*) as like_count
FROM public.blog_likes
GROUP BY post_id;

-- Grant public access to the view
GRANT SELECT ON public.blog_post_like_counts TO anon, authenticated;

-- Security Fix 7: Add rate limiting function for sensitive operations
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_uuid uuid,
  endpoint_name text,
  max_requests integer DEFAULT 10,
  window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_count integer;
  window_start timestamp with time zone := now() - (window_minutes || ' minutes')::interval;
BEGIN
  -- Count requests in the current window
  SELECT count(*) INTO current_count
  FROM public.api_rate_limits
  WHERE user_id = user_uuid
    AND endpoint = endpoint_name
    AND window_start >= window_start;
  
  -- If under limit, log the request and allow
  IF current_count < max_requests THEN
    INSERT INTO public.api_rate_limits (user_id, endpoint, request_count)
    VALUES (user_uuid, endpoint_name, 1)
    ON CONFLICT (user_id, endpoint, window_start) 
    DO UPDATE SET 
      request_count = api_rate_limits.request_count + 1,
      updated_at = now();
    
    RETURN true;
  END IF;
  
  -- Over limit, deny request
  RETURN false;
END;
$$;

-- Security Fix 8: Add input validation and sanitization function
CREATE OR REPLACE FUNCTION public.sanitize_user_input(input_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Basic sanitization: remove potential XSS vectors
  RETURN regexp_replace(
    regexp_replace(
      regexp_replace(input_text, '<[^>]*>', '', 'g'), -- Remove HTML tags
      '[^\x20-\x7E\x0A\x0D]', '', 'g' -- Remove non-printable characters except newlines
    ),
    '\s+', ' ', 'g' -- Normalize whitespace
  );
END;
$$;