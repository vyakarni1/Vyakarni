
-- Enable RLS on Razorpay tables
ALTER TABLE public.razorpay_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for razorpay_orders table
-- Allow users to view only their own orders
CREATE POLICY "Users can view their own orders" 
  ON public.razorpay_orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to create orders for themselves
CREATE POLICY "Users can create their own orders" 
  ON public.razorpay_orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all orders (for webhook processing)
CREATE POLICY "Service role can manage all orders" 
  ON public.razorpay_orders 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- RLS policies for razorpay_webhook_logs table
-- Only service role can access webhook logs (for security)
CREATE POLICY "Service role can manage webhook logs" 
  ON public.razorpay_webhook_logs 
  FOR ALL 
  USING (auth.role() = 'service_role');
