
-- Step 1: Get the correct plan IDs
-- First, let's see what plans we have and get the correct IDs

-- Step 2: Update the user's subscription to the new हॉबी प्लान (Basic)
UPDATE user_subscriptions 
SET plan_id = (
  SELECT id FROM subscription_plans 
  WHERE plan_name = 'हॉबी प्लान (Basic)' 
  LIMIT 1
),
updated_at = now()
WHERE user_id = '974177e4-8ab8-43cd-a1bd-ed9607d01a92'
  AND status = 'active';

-- Step 3: Add 10,000 subscription word credits using the function
SELECT add_user_word_credits(
  '974177e4-8ab8-43cd-a1bd-ed9607d01a92'::uuid,
  10000,
  'subscription',
  NULL -- No expiry date for subscription words
);

-- Step 4: Create payment transaction record if it doesn't exist
INSERT INTO payment_transactions (
  user_id,
  amount,
  status,
  payment_gateway,
  razorpay_order_id,
  razorpay_payment_id,
  currency
) VALUES (
  '974177e4-8ab8-43cd-a1bd-ed9607d01a92'::uuid,
  117882,
  'completed',
  'razorpay',
  'order_Qh7xtuignamMB6',
  'pay_Qh7zV9MIAQGmVK',
  'INR'
) ON CONFLICT DO NOTHING;

-- Step 5: Verify the changes
SELECT 
  us.id as subscription_id,
  sp.plan_name,
  sp.plan_type,
  us.status,
  us.updated_at
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.user_id = '974177e4-8ab8-43cd-a1bd-ed9607d01a92'
  AND us.status = 'active';

-- Verify word credits
SELECT 
  total_words_available,
  subscription_words,
  topup_words,
  free_words,
  has_active_subscription
FROM get_user_word_balance('974177e4-8ab8-43cd-a1bd-ed9607d01a92'::uuid);
