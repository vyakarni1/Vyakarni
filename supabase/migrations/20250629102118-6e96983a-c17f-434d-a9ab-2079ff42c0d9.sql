
-- First, let's see what plan_type values currently exist
-- We'll update any invalid values before adding the constraint

-- Update any rows that might have invalid plan_type values
-- Set default plan_type based on plan_name patterns
UPDATE subscription_plans 
SET plan_type = CASE 
  WHEN plan_name LIKE '%Free%' OR plan_name LIKE '%फ्री%' THEN 'free'
  WHEN plan_name LIKE '%Basic%' OR plan_name LIKE '%हॉबी%' THEN 'basic'
  WHEN plan_name LIKE '%Premium%' OR plan_name LIKE '%प्रीमियम%' THEN 'premium'
  ELSE 'free'
END
WHERE plan_type NOT IN ('free', 'basic', 'premium') OR plan_type IS NULL;

-- Now create the check constraint
ALTER TABLE subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_plan_type_check;
ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_plan_type_check 
CHECK (plan_type IN ('free', 'basic', 'premium'));

-- Phase 2: New User Onboarding System
-- Create trigger to automatically give free credits to new users
CREATE OR REPLACE FUNCTION public.give_free_credits_on_signup()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Give 500 free words to new user (no expiry for free credits)
  INSERT INTO public.user_word_credits (
    user_id, 
    words_available, 
    words_purchased, 
    is_free_credit,
    credit_type,
    purchase_date
  )
  VALUES (
    NEW.id, 
    500, 
    500, 
    true,
    'free',
    now()
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create free subscription for new users
CREATE OR REPLACE FUNCTION public.create_default_free_subscription()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  free_plan_id uuid;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id 
  FROM subscription_plans 
  WHERE plan_type = 'free' 
  LIMIT 1;
  
  IF free_plan_id IS NOT NULL THEN
    -- Create free subscription for the new user
    INSERT INTO user_subscriptions (user_id, plan_id, status, auto_renewal)
    VALUES (NEW.id, free_plan_id, 'active', false);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created_free_credits ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_free_subscription ON auth.users;

-- Create new triggers for user onboarding
CREATE TRIGGER on_auth_user_created_free_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.give_free_credits_on_signup();

CREATE TRIGGER on_auth_user_created_free_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_free_subscription();

-- Update the check_user_has_active_subscription function to properly handle paid plans
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
      AND (
        sp.plan_type IN ('basic', 'premium') 
        OR (sp.plan_name LIKE '%हॉबी प्लान%' AND sp.plan_type = 'basic')
        OR (sp.plan_name LIKE '%Basic%' AND sp.plan_type = 'basic')
      )
      AND (us.expires_at IS NULL OR us.expires_at > now())
  );
END;
$$;

-- Update get_user_word_balance function to include subscription status check
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
