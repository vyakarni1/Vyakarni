-- Fix SQL syntax and continue security enhancements

-- Rate limiting table (fixed syntax)
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

-- Enhanced admin audit logging for sensitive operations
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

-- Add indices for performance on security-related queries
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_admin_action 
ON public.security_audit_logs (admin_id, action_type, created_at);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_lookup 
ON public.api_rate_limits (ip_address, endpoint, window_start);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource 
ON public.admin_audit_logs (resource_type, resource_id, created_at);