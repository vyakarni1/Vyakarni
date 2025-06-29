
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useWordCreditsManagement = () => {
  const { user } = useAuth();

  const addWordCredits = async (planType: string, words: number, expiryDays: number = 120, creditType: string = 'topup') => {
    if (!user) return false;

    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      const { error } = await supabase
        .from('user_word_credits')
        .insert({
          user_id: user.id,
          words_available: words,
          words_purchased: words,
          purchase_date: new Date().toISOString(),
          expiry_date: expiryDate.toISOString(),
          is_free_credit: false,
          credit_type: creditType,
        });

      if (error) {
        console.error('Error adding word credits:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addWordCredits:', error);
      return false;
    }
  };

  // Enhanced logic for top-up purchase eligibility - supports new plan types
  const canPurchaseTopup = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if user has active subscription using the database function
      const { data: hasActiveSubscription, error } = await supabase
        .rpc('check_user_has_active_subscription', {
          user_uuid: user.id
        });

      if (error) {
        console.error('Error checking subscription status:', error);
        return false;
      }

      console.log('Can purchase topup check:', hasActiveSubscription);
      return hasActiveSubscription || false;
    } catch (error) {
      console.error('Error in canPurchaseTopup:', error);
      return false;
    }
  };

  return {
    addWordCredits,
    canPurchaseTopup,
  };
};
