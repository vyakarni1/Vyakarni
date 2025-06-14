
-- Add mandate and recurring subscription tracking table
CREATE TABLE public.subscription_mandates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(id),
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_plan_id TEXT NOT NULL,
  mandate_id TEXT,
  mandate_status TEXT DEFAULT 'pending',
  mandate_type TEXT DEFAULT 'emandate',
  auth_type TEXT DEFAULT 'netbanking',
  max_amount NUMERIC NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  frequency TEXT DEFAULT 'monthly',
  total_count INTEGER DEFAULT 120,
  remaining_count INTEGER DEFAULT 120,
  status TEXT DEFAULT 'created',
  next_charge_at TIMESTAMP WITH TIME ZONE,
  current_start TIMESTAMP WITH TIME ZONE,
  current_end TIMESTAMP WITH TIME ZONE,
  paid_count INTEGER DEFAULT 0,
  customer_notify BOOLEAN DEFAULT true,
  notes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for subscription mandates
ALTER TABLE public.subscription_mandates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mandates" 
  ON public.subscription_mandates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mandates" 
  ON public.subscription_mandates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mandates" 
  ON public.subscription_mandates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add subscription charges tracking table
CREATE TABLE public.subscription_charges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mandate_id UUID REFERENCES subscription_mandates(id),
  user_id UUID NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_invoice_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  error_code TEXT,
  error_description TEXT,
  failure_reason TEXT,
  charge_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for subscription charges
ALTER TABLE public.subscription_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own charges" 
  ON public.subscription_charges 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Update user_subscriptions table to track recurring subscription details
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS mandate_id UUID REFERENCES subscription_mandates(id),
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS charge_at_cycle INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS grace_period_days INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS retry_attempts INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS last_charge_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_notes JSONB DEFAULT '{}';

-- Add function to get user's active mandate
CREATE OR REPLACE FUNCTION public.get_user_active_mandate(user_uuid uuid)
RETURNS TABLE(
  mandate_id uuid,
  razorpay_subscription_id text,
  status text,
  next_charge_at timestamp with time zone,
  remaining_count integer,
  max_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sm.id as mandate_id,
    sm.razorpay_subscription_id,
    sm.status,
    sm.next_charge_at,
    sm.remaining_count,
    sm.max_amount
  FROM subscription_mandates sm
  JOIN user_subscriptions us ON sm.subscription_id = us.id
  WHERE sm.user_id = user_uuid 
    AND sm.status = 'active'
    AND us.status = 'active'
  ORDER BY sm.created_at DESC
  LIMIT 1;
END;
$$;

-- Add function to create recurring subscription
CREATE OR REPLACE FUNCTION public.create_recurring_subscription(
  user_uuid uuid,
  plan_uuid uuid,
  razorpay_subscription_id text,
  razorpay_plan_id text,
  mandate_details jsonb DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  subscription_plan RECORD;
  new_subscription_id uuid;
  new_mandate_id uuid;
  next_billing timestamp with time zone;
  mandate_end_date timestamp with time zone;
BEGIN
  -- Get the subscription plan details
  SELECT * INTO subscription_plan
  FROM subscription_plans 
  WHERE id = plan_uuid AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plan not found or inactive');
  END IF;
  
  -- Calculate billing dates
  next_billing := date_trunc('month', now()) + interval '1 month';
  mandate_end_date := now() + interval '10 years';
  
  -- Deactivate existing subscriptions
  UPDATE user_subscriptions 
  SET status = 'cancelled', updated_at = now()
  WHERE user_id = user_uuid AND status = 'active';
  
  -- Create new subscription
  INSERT INTO user_subscriptions (
    user_id, 
    plan_id, 
    status, 
    next_billing_date, 
    expires_at,
    auto_renewal,
    billing_cycle,
    razorpay_subscription_id,
    is_recurring
  ) 
  VALUES (
    user_uuid, 
    plan_uuid, 
    'active', 
    next_billing, 
    mandate_end_date,
    true,
    'monthly',
    razorpay_subscription_id,
    true
  )
  RETURNING id INTO new_subscription_id;
  
  -- Create mandate record
  INSERT INTO subscription_mandates (
    user_id,
    subscription_id,
    razorpay_subscription_id,
    razorpay_plan_id,
    mandate_status,
    max_amount,
    start_date,
    end_date,
    next_charge_at,
    current_start,
    current_end,
    notes
  )
  VALUES (
    user_uuid,
    new_subscription_id,
    razorpay_subscription_id,
    razorpay_plan_id,
    'created',
    subscription_plan.price_monthly * 1.18,
    next_billing,
    mandate_end_date,
    next_billing,
    now(),
    next_billing,
    mandate_details
  )
  RETURNING id INTO new_mandate_id;
  
  -- Link mandate to subscription
  UPDATE user_subscriptions 
  SET mandate_id = new_mandate_id
  WHERE id = new_subscription_id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'subscription_id', new_subscription_id,
    'mandate_id', new_mandate_id,
    'next_billing_date', next_billing
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', SQLERRM
    );
END;
$$;
