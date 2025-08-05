-- Add RLS policy to allow admins to view all text corrections
CREATE POLICY "Admins can view all text corrections" 
ON public.text_corrections 
FOR SELECT 
USING (is_admin(auth.uid()));