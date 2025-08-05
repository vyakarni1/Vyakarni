-- Add RLS policy for admins to view all payment transactions
CREATE POLICY "Admins can view all payment transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (is_admin(auth.uid()));