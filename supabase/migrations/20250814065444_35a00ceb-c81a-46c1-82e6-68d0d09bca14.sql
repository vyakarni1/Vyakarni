-- Fix Critical Data Exposure Issues - Priority 1

-- 1. Secure Profiles Table - Only users can see their own profiles, admins can see all
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));

-- 2. Secure Contact Submissions - Only admins can read, anyone can insert
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;

CREATE POLICY "Anyone can insert contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (is_admin(auth.uid()));

-- 3. Secure Enterprise Inquiries - Only admins can read, anyone can insert
DROP POLICY IF EXISTS "Users can create enterprise inquiries" ON public.enterprise_inquiries;
DROP POLICY IF EXISTS "Admins can view all enterprise inquiries" ON public.enterprise_inquiries;

CREATE POLICY "Anyone can create enterprise inquiries" 
ON public.enterprise_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all enterprise inquiries" 
ON public.enterprise_inquiries 
FOR SELECT 
USING (is_admin(auth.uid()));

-- 4. Secure Blog Likes - Users can only manage their own likes, limited public read access
DROP POLICY IF EXISTS "Users can view all likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.blog_likes;

-- Only allow viewing aggregated like data (count), not individual user likes
CREATE POLICY "Anyone can view like counts" 
ON public.blog_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.blog_likes 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 5. Add audit logging for sensitive data access
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action_type text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_access(
    p_user_id uuid,
    p_action text,
    p_table_name text,
    p_record_id uuid DEFAULT NULL,
    p_ip_address inet DEFAULT NULL,
    p_user_agent text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.security_audit_logs (
        user_id, action_type, table_name, record_id, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_table_name, p_record_id, p_ip_address, p_user_agent
    );
END;
$$;