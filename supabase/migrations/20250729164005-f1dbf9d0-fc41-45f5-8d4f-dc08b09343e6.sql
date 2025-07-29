-- Step 1: Drop all triggers that might depend on the problematic function
DROP TRIGGER IF EXISTS trigger_welcome_email_on_profile_insert ON public.profiles;
DROP TRIGGER IF EXISTS send_welcome_email_on_profile_creation ON public.profiles;

-- Step 2: Drop the problematic function with CASCADE to remove dependencies
DROP FUNCTION IF EXISTS public.trigger_welcome_email() CASCADE;

-- Step 3: Enable pg_net extension (let it create its own schema)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 4: Create a safe welcome email function that doesn't block registration
CREATE OR REPLACE FUNCTION public.send_welcome_email_safe(user_uuid uuid, user_email text, user_name text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  function_url text := 'https://yvgrgystclritaigvnmh.supabase.co/functions/v1/send-welcome-email';
  service_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3JneXN0Y2xyaXRhaWd2bm1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQyNzgyMSwiZXhwIjoyMDY0MDAzODIxfQ.bHbNQJdwOovYQyN1VWNmeCZUMK7JcUzOJnHZYeP9COs';
  request_id bigint;
BEGIN
  -- Only send if welcome email hasn't been sent already
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND welcome_email_sent_at IS NOT NULL
  ) THEN
    -- Make HTTP request without blocking the transaction
    BEGIN
      SELECT net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_key,
          'apikey', service_key
        ),
        body := jsonb_build_object(
          'userId', user_uuid::text,
          'userEmail', user_email,
          'userName', COALESCE(user_name, 'व्याकरणी यूज़र')
        )
      ) INTO request_id;
      
      RETURN TRUE;
    EXCEPTION
      WHEN OTHERS THEN
        -- Log error but don't fail the main operation
        INSERT INTO public.email_logs (
          user_id, email_type, recipient_email, status, error_message
        ) VALUES (
          user_uuid, 'welcome', user_email, 'failed', 
          'HTTP request failed: ' || SQLERRM
        );
        RETURN FALSE;
    END;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Step 5: Create a function for manual bulk welcome email sending
CREATE OR REPLACE FUNCTION public.send_bulk_welcome_emails_safe()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  profile_record RECORD;
  success_count INTEGER := 0;
  failed_count INTEGER := 0;
  total_count INTEGER := 0;
BEGIN
  -- Get profiles without welcome emails sent
  FOR profile_record IN 
    SELECT id, email, name 
    FROM public.profiles 
    WHERE welcome_email_sent_at IS NULL
    ORDER BY created_at DESC
    LIMIT 100 -- Process in batches to avoid timeouts
  LOOP
    total_count := total_count + 1;
    
    -- Try to send welcome email
    IF public.send_welcome_email_safe(profile_record.id, profile_record.email, profile_record.name) THEN
      success_count := success_count + 1;
    ELSE
      failed_count := failed_count + 1;
    END IF;
    
    -- Small delay to prevent rate limiting
    PERFORM pg_sleep(0.1);
  END LOOP;
  
  RETURN jsonb_build_object(
    'total_processed', total_count,
    'successful', success_count,
    'failed', failed_count
  );
END;
$$;