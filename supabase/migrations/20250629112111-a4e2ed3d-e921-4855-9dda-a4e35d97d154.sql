
-- Phase 1: Fix subscription_plans table structure and data
-- First, let's see what plan_type values currently exist and fix them
UPDATE subscription_plans 
SET plan_type = CASE 
  WHEN plan_name LIKE '%Free%' OR plan_name LIKE '%फ्री%' THEN 'free'
  WHEN plan_name LIKE '%Basic%' OR plan_name LIKE '%हॉबी%' OR plan_name LIKE '%Hobby%' THEN 'basic'
  WHEN plan_name LIKE '%Pro%' OR plan_name LIKE '%Premium%' OR plan_name LIKE '%प्रीमियम%' THEN 'premium'
  ELSE 'free'
END
WHERE plan_type IS NULL OR plan_type NOT IN ('free', 'basic', 'premium');

-- Add proper constraint for plan_type enum if it doesn't exist
ALTER TABLE subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_plan_type_check;
ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_plan_type_check 
CHECK (plan_type IN ('free', 'basic', 'premium'));

-- Update the check_user_has_active_subscription function to properly handle plan types
CREATE OR REPLACE FUNCTION public.check_user_has_active_subscription(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
      AND us.status = 'active'
      AND sp.plan_type IN ('basic', 'premium')
      AND (us.expires_at IS NULL OR us.expires_at > now())
  );
END;
$$;

-- Update get_user_word_balance function to correctly check subscription status
CREATE OR REPLACE FUNCTION public.get_user_word_balance(user_uuid uuid)
RETURNS TABLE(total_words_available integer, free_words integer, purchased_words integer, topup_words integer, subscription_words integer, next_expiry_date timestamp with time zone, has_active_subscription boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  active_subscription boolean;
BEGIN
  -- Check if user has active paid subscription
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

-- Update the free subscription creation function to use correct plan types
CREATE OR REPLACE FUNCTION public.create_default_free_subscription()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  -- Get the free plan ID (should have plan_type = 'free')
  SELECT id INTO free_plan_id 
  FROM subscription_plans 
  WHERE plan_type = 'free' 
    AND is_active = true
  LIMIT 1;
  
  IF free_plan_id IS NOT NULL THEN
    -- Create free subscription for the new user
    INSERT INTO user_subscriptions (user_id, plan_id, status, auto_renewal)
    VALUES (NEW.id, free_plan_id, 'active', false);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure proper data exists in subscription_plans
DO $$
BEGIN
  -- Insert Free Plan if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_name = 'Free Plan') THEN
    INSERT INTO subscription_plans (plan_name, plan_type, price_monthly, price_yearly, max_words_per_correction, max_corrections_per_month, max_team_members, features, is_active)
    VALUES ('Free Plan', 'free', 0, 0, 1000, 50, 1, '["Basic grammar check", "Limited corrections"]', true);
  END IF;
  
  -- Insert Basic Plan if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_name = 'हॉबी प्लान (Basic)') THEN
    INSERT INTO subscription_plans (plan_name, plan_type, price_monthly, price_yearly, max_words_per_correction, max_corrections_per_month, max_team_members, features, is_active)
    VALUES ('हॉबी प्लान (Basic)', 'basic', 999, 9999, 5000, 200, 1, '["Advanced grammar check", "Priority support", "Detailed reports"]', true);
  END IF;
  
  -- Insert Premium Plan if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_name = 'Pro Plan') THEN
    INSERT INTO subscription_plans (plan_name, plan_type, price_monthly, price_yearly, max_words_per_correction, max_corrections_per_month, max_team_members, features, is_active)
    VALUES ('Pro Plan', 'premium', 9999, 99999, 25000, 1000, 5, '["Advanced AI features", "Team collaboration", "Premium support", "Custom integrations"]', true);
  END IF;
END $$;

-- First, remove the unique constraint on plan_type if it exists to allow multiple topup plans
ALTER TABLE word_plans DROP CONSTRAINT IF EXISTS word_plans_plan_type_key;

-- Ensure proper data exists in word_plans for topup functionality
-- Use different plan_type values to avoid unique constraint issues
DO $$
BEGIN
  -- Insert word plans if they don't exist, using unique plan_type values
  IF NOT EXISTS (SELECT 1 FROM word_plans WHERE plan_name = '5000 Words Top-up') THEN
    INSERT INTO word_plans (plan_name, plan_type, plan_category, words_included, price_before_gst, gst_percentage, is_active)
    VALUES ('5000 Words Top-up', 'topup_5k', 'topup', 5000, 499, 18, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM word_plans WHERE plan_name = '10000 Words Top-up') THEN
    INSERT INTO word_plans (plan_name, plan_type, plan_category, words_included, price_before_gst, gst_percentage, is_active)
    VALUES ('10000 Words Top-up', 'topup_10k', 'topup', 10000, 899, 18, true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM word_plans WHERE plan_name = '25000 Words Top-up') THEN
    INSERT INTO word_plans (plan_name, plan_type, plan_category, words_included, price_before_gst, gst_percentage, is_active)
    VALUES ('25000 Words Top-up', 'topup_25k', 'topup', 25000, 1999, 18, true);
  END IF;
END $$;
