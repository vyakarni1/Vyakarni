
-- Fix the Pro and Team plan types to be 'premium' instead of 'free'
UPDATE subscription_plans 
SET plan_type = 'premium'
WHERE plan_name IN ('Pro Plan', 'Team Plan') 
  AND plan_type = 'free';

-- Verify all plan types are now correct
SELECT id, plan_name, plan_type, price_monthly, price_yearly 
FROM subscription_plans 
ORDER BY created_at;
