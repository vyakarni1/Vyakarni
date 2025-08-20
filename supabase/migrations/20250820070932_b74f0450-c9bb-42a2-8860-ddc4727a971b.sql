-- Security Fix 1: Restrict contact_submissions INSERT to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Authenticated users can insert contact submissions" 
ON public.contact_submissions 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Security Fix 2: Restrict enterprise_inquiries INSERT to authenticated users only  
DROP POLICY IF EXISTS "Anyone can create enterprise inquiries" ON public.enterprise_inquiries;
CREATE POLICY "Authenticated users can create enterprise inquiries" 
ON public.enterprise_inquiries 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Security Fix 3: Restrict blog_post_views INSERT to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert post views" ON public.blog_post_views;
CREATE POLICY "Authenticated users can insert post views" 
ON public.blog_post_views 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Security Fix 4: Add comprehensive audit logging for sensitive tables
CREATE OR REPLACE FUNCTION public.enhanced_security_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log changes to sensitive tables with user context
    IF TG_TABLE_NAME IN ('profiles', 'user_roles', 'user_subscriptions', 'payment_transactions', 'user_word_credits', 'contact_submissions', 'enterprise_inquiries') THEN
        -- Log with proper context
        PERFORM public.log_sensitive_access(
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            inet_client_addr(),
            current_setting('request.headers', true)::json->>'user-agent'
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply security audit triggers to sensitive tables
DROP TRIGGER IF EXISTS security_audit_profiles ON public.profiles;
CREATE TRIGGER security_audit_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.enhanced_security_audit_log();

DROP TRIGGER IF EXISTS security_audit_user_roles ON public.user_roles;
CREATE TRIGGER security_audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.enhanced_security_audit_log();

DROP TRIGGER IF EXISTS security_audit_contact_submissions ON public.contact_submissions;
CREATE TRIGGER security_audit_contact_submissions
    AFTER INSERT OR UPDATE OR DELETE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION public.enhanced_security_audit_log();

DROP TRIGGER IF EXISTS security_audit_enterprise_inquiries ON public.enterprise_inquiries;
CREATE TRIGGER security_audit_enterprise_inquiries
    AFTER INSERT OR UPDATE OR DELETE ON public.enterprise_inquiries
    FOR EACH ROW EXECUTE FUNCTION public.enhanced_security_audit_log();

-- Security Fix 5: Strengthen admin role verification
CREATE OR REPLACE FUNCTION public.verify_admin_with_audit(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log admin access attempt
  PERFORM public.log_sensitive_access(
    _user_id, 
    'admin_verification', 
    'user_roles', 
    _user_id,
    inet_client_addr(),
    'admin_verification_check'
  );
  
  -- Verify admin role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'::public.app_role
  );
END;
$$;

-- Update existing admin functions to use enhanced verification
CREATE OR REPLACE FUNCTION public.is_admin_secure(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT public.verify_admin_with_audit(_user_id)
$$;