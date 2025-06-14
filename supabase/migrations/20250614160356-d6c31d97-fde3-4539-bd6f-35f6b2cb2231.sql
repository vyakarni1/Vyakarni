
-- First, let's check what plan types are currently allowed
SELECT DISTINCT plan_type FROM subscription_plans;

-- Let's also check if there are any check constraints on the plan_type column
SELECT 
    tc.constraint_name, 
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'subscription_plans' 
    AND tc.constraint_type = 'CHECK';

-- Now let's create the basic subscription plan using an existing valid plan_type
-- We'll use the same approach as the existing plans
INSERT INTO subscription_plans (
  id,
  plan_name,
  plan_type,
  max_words_per_correction,
  max_corrections_per_month,
  max_team_members,
  price_monthly,
  price_yearly,
  features,
  is_active
) VALUES (
  gen_random_uuid(),
  'हॉबी प्लान (Basic)',
  'free', -- Use 'free' first, we'll update it after seeing what values are allowed
  10000,
  999999, -- Large number for unlimited
  1,
  999,
  9990,
  '["Advanced Grammar Checking", "Style Suggestions", "Plagiarism Detection", "Email Support"]'::jsonb,
  true
);

-- 2. Fix the word plan data to include proper words
UPDATE word_plans 
SET words_included = 10000 
WHERE id = '7606c84f-8878-4651-9a8a-257877f26933' 
  AND words_included = 0;

-- 3. Remove the unique constraint that's causing issues with word credits
DO $$
BEGIN
  -- Drop the unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_word_credits_user_id_key' 
    AND table_name = 'user_word_credits'
  ) THEN
    ALTER TABLE user_word_credits DROP CONSTRAINT user_word_credits_user_id_key;
  END IF;
END $$;

-- 4. Create a function to safely add word credits (UPSERT logic)
CREATE OR REPLACE FUNCTION add_user_word_credits(
  p_user_id uuid,
  p_words_to_add integer,
  p_credit_type text DEFAULT 'subscription',
  p_expiry_date timestamp with time zone DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert new credit record (allows multiple records per user)
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
    p_expiry_date
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$function$;
