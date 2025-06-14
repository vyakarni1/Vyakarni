
-- Create the missing create_subscription_for_user function
CREATE OR REPLACE FUNCTION public.create_subscription_for_user(user_uuid uuid, plan_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  subscription_plan RECORD;
  existing_subscription RECORD;
  new_subscription_id uuid;
  next_billing timestamp with time zone;
  expires_at timestamp with time zone;
BEGIN
  -- Get the subscription plan details
  SELECT * INTO subscription_plan
  FROM subscription_plans 
  WHERE id = plan_uuid AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plan not found or inactive');
  END IF;
  
  -- Check for existing active subscription
  SELECT * INTO existing_subscription
  FROM user_subscriptions
  WHERE user_id = user_uuid 
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > now());
  
  -- If user has existing subscription, update it instead of creating new
  IF FOUND THEN
    -- Calculate new billing date (1 month from now)
    next_billing := now() + interval '1 month';
    
    -- For premium plans, set expiry to 1 month from now
    IF subscription_plan.plan_type IN ('basic', 'premium') THEN
      expires_at := next_billing;
    ELSE
      expires_at := NULL; -- Free plan doesn't expire
    END IF;
    
    UPDATE user_subscriptions 
    SET 
      plan_id = plan_uuid,
      next_billing_date = next_billing,
      expires_at = expires_at,
      auto_renewal = CASE 
        WHEN subscription_plan.plan_type = 'free' THEN false 
        ELSE true 
      END,
      updated_at = now()
    WHERE id = existing_subscription.id;
    
    new_subscription_id := existing_subscription.id;
  ELSE
    -- Create new subscription
    next_billing := now() + interval '1 month';
    
    -- For premium plans, set expiry to 1 month from now
    IF subscription_plan.plan_type IN ('basic', 'premium') THEN
      expires_at := next_billing;
    ELSE
      expires_at := NULL; -- Free plan doesn't expire
    END IF;
    
    INSERT INTO user_subscriptions (
      user_id, 
      plan_id, 
      status, 
      next_billing_date, 
      expires_at,
      auto_renewal,
      billing_cycle
    ) 
    VALUES (
      user_uuid, 
      plan_uuid, 
      'active', 
      next_billing, 
      expires_at,
      CASE 
        WHEN subscription_plan.plan_type = 'free' THEN false 
        ELSE true 
      END,
      'monthly'
    )
    RETURNING id INTO new_subscription_id;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true, 
    'subscription_id', new_subscription_id,
    'plan_type', subscription_plan.plan_type,
    'next_billing_date', next_billing,
    'expires_at', expires_at
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', SQLERRM
    );
END;
$function$;

-- Add missing table for Razorpay orders if it doesn't exist
CREATE TABLE IF NOT EXISTS public.razorpay_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  word_plan_id uuid,
  order_id text NOT NULL UNIQUE,
  order_amount numeric NOT NULL,
  order_currency text DEFAULT 'INR',
  order_status text DEFAULT 'CREATED',
  words_to_credit integer NOT NULL,
  customer_details jsonb NOT NULL,
  order_meta jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add missing table for Razorpay webhook logs if it doesn't exist
CREATE TABLE IF NOT EXISTS public.razorpay_webhook_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  order_id text,
  payment_id text,
  webhook_data jsonb NOT NULL,
  signature text,
  processed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
