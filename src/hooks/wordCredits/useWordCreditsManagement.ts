
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useWordCreditsManagement = () => {
  const { user } = useAuth();

  const addWordCredits = async (planType: string, words: number, creditType: string = 'subscription') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_word_credits')
        .insert({
          user_id: user.id,
          words_available: words,
          words_purchased: words,
          purchase_date: new Date().toISOString(),
          expiry_date: null, // No expiry date
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

  return {
    addWordCredits,
  };
};
