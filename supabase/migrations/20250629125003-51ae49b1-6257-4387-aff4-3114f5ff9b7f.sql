
-- Update subscription plans with correct pricing and features
UPDATE subscription_plans 
SET 
  price_monthly = 0,
  price_yearly = 0,
  max_words_per_correction = 100,
  max_corrections_per_month = 50,
  max_team_members = 1,
  features = '[
    "हिंदी व्याकरण जाँच",
    "एक-क्लिक वाक्य सुधार", 
    "शैली सुधार",
    "तत्काल परिणाम"
  ]'::jsonb,
  updated_at = now()
WHERE plan_type = 'free';

UPDATE subscription_plans 
SET 
  price_monthly = 999,
  price_yearly = 999,
  max_words_per_correction = 500,
  max_corrections_per_month = 200,
  max_team_members = 1,
  features = '[
    "हिंदी व्याकरण जाँच",
    "एक-क्लिक वाक्य सुधार",
    "शैली सुधार", 
    "तत्काल परिणाम",
    "विस्तृत रिपोर्ट",
    "कम्युनिटी एक्सेस"
  ]'::jsonb,
  updated_at = now()
WHERE plan_type = 'basic';

UPDATE subscription_plans 
SET 
  price_monthly = 9999,
  price_yearly = 9999,
  max_words_per_correction = 2000,
  max_corrections_per_month = 1000,
  max_team_members = 5,
  features = '[
    "हिंदी व्याकरण जाँच",
    "एक-क्लिक वाक्य सुधार",
    "शैली सुधार",
    "तत्काल परिणाम",
    "विस्तृत रिपोर्ट",
    "कम्युनिटी एक्सेस",
    "एडवांस एआई फीचर्स",
    "समर्पित ई-मेल सहायता"
  ]'::jsonb,
  updated_at = now()
WHERE plan_type = 'premium';

-- Update word_plans with correct word allocations and pricing (without updated_at)
UPDATE word_plans 
SET 
  words_included = 500,
  price_before_gst = 0,
  gst_percentage = 0
WHERE plan_type = 'free' AND plan_category = 'subscription';

UPDATE word_plans 
SET 
  words_included = 10000,
  price_before_gst = 999,
  gst_percentage = 18
WHERE plan_type = 'basic' AND plan_category = 'subscription';

UPDATE word_plans 
SET 
  words_included = 125000,
  price_before_gst = 9999,
  gst_percentage = 18
WHERE plan_type = 'premium' AND plan_category = 'subscription';

-- Insert missing word_plans if they don't exist
INSERT INTO word_plans (plan_name, plan_type, plan_category, words_included, price_before_gst, gst_percentage, is_active)
SELECT 'Free Subscription Words', 'free', 'subscription', 500, 0, 0, true
WHERE NOT EXISTS (SELECT 1 FROM word_plans WHERE plan_type = 'free' AND plan_category = 'subscription');

INSERT INTO word_plans (plan_name, plan_type, plan_category, words_included, price_before_gst, gst_percentage, is_active)
SELECT 'Basic Subscription Words', 'basic', 'subscription', 10000, 999, 18, true
WHERE NOT EXISTS (SELECT 1 FROM word_plans WHERE plan_type = 'basic' AND plan_category = 'subscription');

INSERT INTO word_plans (plan_name, plan_type, plan_category, words_included, price_before_gst, gst_percentage, is_active)
SELECT 'Premium Subscription Words', 'premium', 'subscription', 125000, 9999, 18, true
WHERE NOT EXISTS (SELECT 1 FROM word_plans WHERE plan_type = 'premium' AND plan_category = 'subscription');
