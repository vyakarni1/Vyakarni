-- Fix security issue: Protect admin analytics data from unauthorized access
-- Enable Row Level Security on admin_analytics_summary table
ALTER TABLE public.admin_analytics_summary ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admin users to access analytics data
CREATE POLICY "Only admins can access analytics summary" 
ON public.admin_analytics_summary 
FOR SELECT 
USING (public.is_admin(auth.uid()));