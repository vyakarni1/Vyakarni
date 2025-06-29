
-- Fix subscription status and database inconsistencies

-- Step 1: Clean up duplicate subscriptions (keep only the most recent active one per user)
WITH ranked_subscriptions AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM user_subscriptions 
  WHERE status = 'active'
)
UPDATE user_subscriptions 
SET status = 'cancelled'
WHERE id IN (
  SELECT id FROM ranked_subscriptions WHERE rn > 1
);

-- Step 2: Update users who have purchased words but are still on free plan
-- Find users with purchased/topup word credits but on free plan
UPDATE user_subscriptions 
SET plan_id = (
  SELECT id FROM subscription_plans 
  WHERE plan_type = 'basic' 
  AND is_active = true 
  LIMIT 1
)
WHERE user_id IN (
  SELECT DISTINCT uwc.user_id 
  FROM user_word_credits uwc
  WHERE uwc.credit_type IN ('subscription', 'topup') 
  AND uwc.words_available > 0
  AND NOT uwc.is_free_credit
) 
AND plan_id IN (
  SELECT id FROM subscription_plans WHERE plan_type = 'free'
);

-- Step 3: Update check_user_has_active_subscription function to be more accurate
CREATE OR REPLACE FUNCTION public.check_user_has_active_subscription(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  has_paid_credits boolean := false;
  has_paid_subscription boolean := false;
BEGIN
  -- Check if user has active paid subscription
  SELECT EXISTS (
    SELECT 1 
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
      AND us.status = 'active'
      AND sp.plan_type IN ('basic', 'premium')
      AND (us.expires_at IS NULL OR us.expires_at > now())
  ) INTO has_paid_subscription;
  
  -- Also check if user has any purchased/topup word credits (active subscription indicator)
  SELECT EXISTS (
    SELECT 1 
    FROM user_word_credits uwc
    WHERE uwc.user_id = user_uuid 
      AND uwc.credit_type IN ('subscription', 'topup')
      AND uwc.words_available > 0
      AND NOT uwc.is_free_credit
  ) INTO has_paid_credits;
  
  -- Return true if either condition is met
  RETURN has_paid_subscription OR has_paid_credits;
END;
$$;

-- Step 4: Update get_user_word_balance function to properly reflect subscription status
CREATE OR REPLACE FUNCTION public.get_user_word_balance(user_uuid uuid)
RETURNS TABLE(total_words_available integer, free_words integer, purchased_words integer, topup_words integer, subscription_words integer, next_expiry_date timestamp with time zone, has_active_subscription boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  active_subscription boolean;
BEGIN
  -- Check if user has active paid subscription using the updated function
  SELECT public.check_user_has_active_subscription(user_uuid) INTO active_subscription;

  -- Clean up expired credits first
  UPDATE user_word_credits 
  SET words_available = 0 
  WHERE user_id = user_uuid 
    AND expiry_date IS NOT NULL 
    AND expiry_date < NOW()
    AND words_available > 0;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(words_available), 0)::INTEGER as total_words_available,
    COALESCE(SUM(CASE WHEN is_free_credit THEN words_available ELSE 0 END), 0)::INTEGER as free_words,
    COALESCE(SUM(CASE WHEN NOT is_free_credit THEN words_available ELSE 0 END), 0)::INTEGER as purchased_words,
    COALESCE(SUM(CASE WHEN credit_type = 'topup' THEN words_available ELSE 0 END), 0)::INTEGER as topup_words,
    COALESCE(SUM(CASE WHEN credit_type = 'subscription' THEN words_available ELSE 0 END), 0)::INTEGER as subscription_words,
    MIN(expiry_date) as next_expiry_date,
    active_subscription as has_active_subscription
  FROM user_word_credits 
  WHERE user_id = user_uuid 
    AND words_available > 0;
END;
$$;

-- Step 5: Ensure proper plan data exists and is consistent
UPDATE subscription_plans 
SET plan_type = 'basic'
WHERE plan_name LIKE '%हॉबी%' OR plan_name LIKE '%Basic%' OR plan_name LIKE '%Hobby%';

UPDATE subscription_plans 
SET plan_type = 'premium'
WHERE plan_name LIKE '%Pro%' OR plan_name LIKE '%Premium%' OR plan_name LIKE '%प्रीमियम%';

-- Step 6: Fix any users who should have active subscriptions but don't
-- This handles edge cases where payments were processed but subscriptions weren't updated
UPDATE user_subscriptions 
SET 
  plan_id = (SELECT id FROM subscription_plans WHERE plan_type = 'basic' AND is_active = true LIMIT 1),
  status = 'active',
  updated_at = now()
WHERE user_id IN (
  SELECT DISTINCT user_id 
  FROM user_word_credits 
  WHERE credit_type IN ('subscription', 'topup') 
    AND NOT is_free_credit 
    AND words_available > 0
) 
AND status != 'active';
