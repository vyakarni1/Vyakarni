-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  function_url text := 'https://yvgrgystclritaigvnmh.supabase.co/functions/v1/send-welcome-email';
  service_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3JneXN0Y2xyaXRhaWd2bm1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQyNzgyMSwiZXhwIjoyMDY0MDAzODIxfQ.bHbNQJdwOovYQyN1VWNmeCZUMK7JcUzOJnHZYeP9COs';
BEGIN
  -- Only trigger if this is a new profile (INSERT) and welcome email hasn't been sent
  IF TG_OP = 'INSERT' AND NEW.welcome_email_sent_at IS NULL THEN
    -- Call the send-welcome-email edge function
    PERFORM
      net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_key,
          'apikey', service_key
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';