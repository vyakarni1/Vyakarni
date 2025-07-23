-- Add email tracking columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS email_verification_completed_at TIMESTAMP WITH TIME ZONE;

-- Create email logs table for tracking
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  resend_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for email_logs
CREATE POLICY "Users can view their own email logs" ON public.email_logs
FOR SELECT USING (user_id = auth.uid());

-- Create admin policy for email_logs
CREATE POLICY "Admins can view all email logs" ON public.email_logs
FOR ALL USING (public.is_admin(auth.uid()));