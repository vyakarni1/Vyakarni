-- Additional Security Enhancements - Priority 2

-- 1. Move extensions from public schema (for those that can be moved safely)
-- Note: Some extensions like uuid-ossp may need to stay in public for compatibility
-- The linter warning suggests reviewing which extensions are actually needed in public

-- 2. Add rate limiting table for tracking API usage
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    ip_address inet NOT NULL,
    endpoint text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits" 
ON public.api_rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

-- Function for rate limiting checks
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_user_id uuid DEFAULT NULL,
    p_ip_address inet,
    p_endpoint text,
    p_max_requests integer DEFAULT 100,
    p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_count integer;
    window_start timestamp with time zone;
BEGIN
    -- Calculate window start time
    window_start := now() - (p_window_minutes || ' minutes')::interval;
    
    -- Clean up old rate limit records
    DELETE FROM public.api_rate_limits 
    WHERE window_start < (now() - interval '24 hours');
    
    -- Get current request count for this window
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM public.api_rate_limits
    WHERE (p_user_id IS NULL OR user_id = p_user_id)
      AND ip_address = p_ip_address
      AND endpoint = p_endpoint
      AND window_start >= (now() - (p_window_minutes || ' minutes')::interval);
    
    -- Check if rate limit exceeded
    IF current_count >= p_max_requests THEN
        RETURN false;
    END IF;
    
    -- Update or insert rate limit record
    INSERT INTO public.api_rate_limits (user_id, ip_address, endpoint, request_count, window_start)
    VALUES (p_user_id, p_ip_address, p_endpoint, 1, now())
    ON CONFLICT ON CONSTRAINT api_rate_limits_pkey DO UPDATE 
    SET request_count = api_rate_limits.request_count + 1,
        updated_at = now();
    
    RETURN true;
END;
$$;

-- 3. Enhanced admin audit logging for sensitive operations
CREATE OR REPLACE FUNCTION public.enhanced_admin_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Log admin actions on sensitive tables
    IF TG_TABLE_NAME IN ('profiles', 'user_roles', 'user_subscriptions', 'payment_transactions', 'user_word_credits') THEN
        INSERT INTO public.admin_audit_logs (
            admin_id,
            action_type,
            resource_type,
            resource_id,
            old_values,
            new_values
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
            CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.enhanced_admin_audit_log();

DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.enhanced_admin_audit_log();

-- 4. Add indices for performance on security-related queries
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_admin_action 
ON public.security_audit_logs (admin_id, action_type, created_at);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_lookup 
ON public.api_rate_limits (ip_address, endpoint, window_start);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource 
ON public.admin_audit_logs (resource_type, resource_id, created_at);