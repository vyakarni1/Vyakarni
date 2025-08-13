-- Fix security issue: Create secure admin analytics function
-- Drop the existing view and replace with a secure function

DROP VIEW IF EXISTS public.admin_analytics_summary;

-- Create a secure function that replaces the view
-- Only admins can call this function and get analytics data
CREATE OR REPLACE FUNCTION public.get_admin_analytics_summary()
RETURNS TABLE(
  users_today bigint,
  total_users bigint, 
  corrections_this_month bigint,
  corrections_this_week bigint,
  corrections_today bigint,
  revenue_this_month numeric,
  total_revenue numeric,
  active_subscriptions bigint,
  users_this_month bigint,
  users_this_week bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Security check: Only allow admin users
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return the analytics data
  RETURN QUERY
  SELECT 
    ( SELECT count(*) AS count
           FROM profiles
          WHERE (date(profiles.created_at) = CURRENT_DATE)) AS users_today,
    ( SELECT count(*) AS count
           FROM profiles) AS total_users,
    ( SELECT count(*) AS count
           FROM user_usage
          WHERE (date(user_usage.created_at) >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))) AS corrections_this_month,
    ( SELECT count(*) AS count
           FROM user_usage
          WHERE (date(user_usage.created_at) >= date_trunc('week'::text, (CURRENT_DATE)::timestamp with time zone))) AS corrections_this_week,
    ( SELECT count(*) AS count
           FROM user_usage
          WHERE (date(user_usage.created_at) = CURRENT_DATE)) AS corrections_today,
    ( SELECT COALESCE(sum(payment_transactions.amount), (0)::numeric) AS "coalesce"
           FROM payment_transactions
          WHERE ((date(payment_transactions.created_at) >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone)) AND (payment_transactions.status = 'completed'::text))) AS revenue_this_month,
    ( SELECT COALESCE(sum(payment_transactions.amount), (0)::numeric) AS "coalesce"
           FROM payment_transactions
          WHERE (payment_transactions.status = 'completed'::text)) AS total_revenue,
    ( SELECT count(*) AS count
           FROM user_subscriptions
          WHERE (user_subscriptions.status = 'active'::text)) AS active_subscriptions,
    ( SELECT count(*) AS count
           FROM profiles
          WHERE (date(profiles.created_at) >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))) AS users_this_month,
    ( SELECT count(*) AS count
           FROM profiles
          WHERE (date(profiles.created_at) >= date_trunc('week'::text, (CURRENT_DATE)::timestamp with time zone))) AS users_this_week;
END;
$$;