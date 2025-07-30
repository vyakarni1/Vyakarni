-- Add RLS policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add RLS policy to allow admins to view all user roles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add RLS policy to allow admins to view all user word credits
CREATE POLICY "Admins can view all user word credits" 
ON public.user_word_credits 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add RLS policy to allow admins to view all user usage history
CREATE POLICY "Admins can view all usage history" 
ON public.word_usage_history 
FOR SELECT 
USING (is_admin(auth.uid()));