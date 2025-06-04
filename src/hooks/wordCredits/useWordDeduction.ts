
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useWordDeduction = () => {
  const { user } = useAuth();

  const deductWords = async (wordsToDeduct: number, actionType: string, textContent?: string) => {
    if (!user) return false;

    try {
      // Use the existing typed function
      const { data, error } = await supabase.rpc('deduct_words', {
        user_uuid: user.id,
        words_to_deduct: wordsToDeduct,
        action_type: actionType,
        text_content: textContent || null,
      });

      if (error) {
        console.error('Error deducting words:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Error in deductWords:', error);
      return false;
    }
  };

  return {
    deductWords,
  };
};
