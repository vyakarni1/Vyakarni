-- Create trigger function to send welcome emails for new profiles
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if this is a new profile (INSERT) and welcome email hasn't been sent
  IF TG_OP = 'INSERT' AND NEW.welcome_email_sent_at IS NULL THEN
    -- Call the send-welcome-email edge function asynchronously
    PERFORM
      net.http_post(
        url := current_setting('app.settings.supabase_url') || '/functions/v1/send-welcome-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object(
          'userId', NEW.id::text,
          'userEmail', NEW.email,
          'userName', COALESCE(NEW.name, 'व्याकरणी यूज़र')
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS send_welcome_email_on_profile_creation ON public.profiles;
CREATE TRIGGER send_welcome_email_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_email();

-- Add app settings for the function to use
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, category, is_public)
VALUES 
  ('supabase_url', '"https://yvgrgystclritaigvnmh.supabase.co"', 'string', 'Supabase URL for edge function calls', 'app', false),
  ('service_role_key', '"' || current_setting('app.service_role_key', true) || '"', 'string', 'Service role key for edge function auth', 'app', false)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();