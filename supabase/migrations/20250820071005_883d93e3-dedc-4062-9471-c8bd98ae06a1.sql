-- Fix search path warnings for security functions
CREATE OR REPLACE FUNCTION public.verify_admin_with_audit(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Update existing admin functions to use enhanced verification with proper search path
CREATE OR REPLACE FUNCTION public.is_admin_secure(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.verify_admin_with_audit(_user_id)
$$;

-- Update enhanced security audit log function with proper search path
CREATE OR REPLACE FUNCTION public.enhanced_security_audit_log()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;