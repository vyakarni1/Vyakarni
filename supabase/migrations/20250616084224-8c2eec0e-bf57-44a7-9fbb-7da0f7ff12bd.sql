
-- Fix the give_free_credits function to properly handle new user registration
CREATE OR REPLACE FUNCTION public.give_free_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user already has any word credits before inserting
  IF NOT EXISTS (
    SELECT 1 FROM public.user_word_credits 
    WHERE user_id = NEW.id
  ) THEN
    -- Give 500 free words to new user (no expiry for free credits)
    INSERT INTO public.user_word_credits (
      user_id, 
      words_available, 
      words_purchased, 
      is_free_credit,
      credit_type
    )
    VALUES (
      NEW.id, 
      500, 
      500, 
      true,
      'free'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;
