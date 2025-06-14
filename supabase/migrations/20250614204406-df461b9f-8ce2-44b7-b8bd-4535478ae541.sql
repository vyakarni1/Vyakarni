
-- Update the check_user_has_active_subscription function to include हॉबी प्लान (Basic)
CREATE OR REPLACE FUNCTION public.check_user_has_active_subscription(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
      AND us.status = 'active'
      AND (
        sp.plan_type IN ('basic', 'premium') 
        OR sp.plan_name = 'हॉबी प्लान (Basic)'
      )
      AND (us.expires_at IS NULL OR us.expires_at > now())
  );
END;
$function$
