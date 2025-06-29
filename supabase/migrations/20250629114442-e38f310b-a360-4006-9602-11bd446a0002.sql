
-- Remove top-up feature and monthly system - Database changes

-- Step 1: Remove all top-up plans from word_plans table
DELETE FROM word_plans WHERE plan_category = 'topup';

-- Step 2: Update subscription plans to be one-time purchases (remove monthly references)
UPDATE subscription_plans 
SET 
  price_monthly = price_monthly,  -- Keep the price but it's now one-time
  updated_at = now();

-- Step 3: Remove expiry dates from existing word credits (make them permanent)
UPDATE user_word_credits 
SET 
  expiry_date = NULL,
  updated_at = now()
WHERE expiry_date IS NOT NULL;

-- Step 4: Update get_user_word_balance function to remove expiry logic
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

  -- No longer clean up expired credits since there are no expiry dates

  RETURN QUERY
  SELECT 
    COALESCE(SUM(words_available), 0)::INTEGER as total_words_available,
    COALESCE(SUM(CASE WHEN is_free_credit THEN words_available ELSE 0 END), 0)::INTEGER as free_words,
    COALESCE(SUM(CASE WHEN NOT is_free_credit THEN words_available ELSE 0 END), 0)::INTEGER as purchased_words,
    0::INTEGER as topup_words, -- Always 0 since no more topups
    COALESCE(SUM(CASE WHEN credit_type = 'subscription' THEN words_available ELSE 0 END), 0)::INTEGER as subscription_words,
    NULL::timestamp with time zone as next_expiry_date, -- Always NULL since no expiry
    active_subscription as has_active_subscription
  FROM user_word_credits 
  WHERE user_id = user_uuid 
    AND words_available > 0;
END;
$$;

-- Step 5: Update deduct_words function to remove expiry logic
CREATE OR REPLACE FUNCTION public.deduct_words(user_uuid uuid, words_to_deduct integer, action_type text, text_content text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  credit_record RECORD;
  remaining_to_deduct INTEGER := words_to_deduct;
  words_deducted INTEGER;
BEGIN
  -- Check if user has enough words
  IF (SELECT COALESCE(SUM(words_available), 0) FROM user_word_credits WHERE user_id = user_uuid AND words_available > 0) < words_to_deduct THEN
    RETURN FALSE;
  END IF;

  -- Deduct from oldest credits first (FIFO) - no expiry check needed
  FOR credit_record IN 
    SELECT * FROM user_word_credits 
    WHERE user_id = user_uuid 
      AND words_available > 0 
    ORDER BY is_free_credit DESC, created_at ASC
  LOOP
    IF remaining_to_deduct <= 0 THEN
      EXIT;
    END IF;

    words_deducted := LEAST(credit_record.words_available, remaining_to_deduct);
    
    UPDATE user_word_credits 
    SET words_available = words_available - words_deducted,
        updated_at = NOW()
    WHERE id = credit_record.id;
    
    remaining_to_deduct := remaining_to_deduct - words_deducted;
  END LOOP;

  -- Record the usage
  INSERT INTO word_usage_history (user_id, words_used, action_type, text_processed)
  VALUES (user_uuid, words_to_deduct, action_type, text_content);

  RETURN TRUE;
END;
$$;

-- Step 6: Update check_user_has_active_subscription to remove monthly logic
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
  -- Check if user has active paid subscription (no expiry check needed)
  SELECT EXISTS (
    SELECT 1 
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid 
      AND us.status = 'active'
      AND sp.plan_type IN ('basic', 'premium')
  ) INTO has_paid_subscription;
  
  -- Also check if user has any purchased word credits
  SELECT EXISTS (
    SELECT 1 
    FROM user_word_credits uwc
    WHERE uwc.user_id = user_uuid 
      AND uwc.credit_type = 'subscription'
      AND uwc.words_available > 0
      AND NOT uwc.is_free_credit
  ) INTO has_paid_credits;
  
  -- Return true if either condition is met
  RETURN has_paid_subscription OR has_paid_credits;
END;
$$;

-- Step 7: Update add_user_word_credits function to remove expiry logic
CREATE OR REPLACE FUNCTION public.add_user_word_credits(p_user_id uuid, p_words_to_add integer, p_credit_type text DEFAULT 'subscription'::text, p_expiry_date timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert new credit record (no expiry date)
  INSERT INTO user_word_credits (
    user_id,
    words_available,
    words_purchased,
    is_free_credit,
    credit_type,
    purchase_date,
    expiry_date
  ) VALUES (
    p_user_id,
    p_words_to_add,
    p_words_to_add,
    false,
    p_credit_type,
    now(),
    NULL  -- Always NULL for no expiry
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;
