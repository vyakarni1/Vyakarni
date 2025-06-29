
-- Fix the subscription plan types based on the actual plan names in the database
UPDATE subscription_plans 
SET plan_type = CASE 
  WHEN plan_name = 'Free Plan' THEN 'free'
  WHEN plan_name = 'हॉबी प्लान (Basic)' THEN 'basic'
  WHEN plan_name = 'Pro Plan' THEN 'premium'
  WHEN plan_name = 'Team Plan' THEN 'premium'
  ELSE plan_type -- keep existing value if no match
END;

-- Verify the update worked
SELECT id, plan_name, plan_type, price_monthly FROM subscription_plans ORDER BY created_at;
