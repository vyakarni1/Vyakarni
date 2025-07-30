-- Update the create_welcome_notification function with new text
CREATE OR REPLACE FUNCTION public.create_welcome_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'व्याकरणी में आपका स्वागत है!',
    'आपका खाता सफलतापूर्वक बन गया है। व्याकरणी का प्रयोग आरम्भ करने से पूर्व सर्वप्रथम अपने डैशबोर्ड पर जायें और अपने खाते को समझें।',
    'welcome'
  );
  RETURN NEW;
END;
$function$;