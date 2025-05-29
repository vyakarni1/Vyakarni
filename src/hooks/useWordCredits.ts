
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface WordBalance {
  total_words_available: number;
  free_words: number;
  purchased_words: number;
  next_expiry_date: string | null;
}

interface WordPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
}

export const useWordCredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WordBalance>({
    total_words_available: 0,
    free_words: 0,
    purchased_words: 0,
    next_expiry_date: null,
  });
  const [plans, setPlans] = useState<WordPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_word_balance', {
        user_uuid: user.id,
      });

      if (error) {
        console.error('Error fetching word balance:', error);
        return;
      }

      if (data && data.length > 0) {
        setBalance(data[0]);
      }
    } catch (error) {
      console.error('Error in fetchBalance:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('word_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_before_gst', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
        return;
      }

      if (data) {
        setPlans(data);
      }
    } catch (error) {
      console.error('Error in fetchPlans:', error);
    } finally {
      setLoading(false);
    }
  };

  const deductWords = async (wordsToDeduct: number, actionType: string, textContent?: string) => {
    if (!user) return false;

    try {
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

      if (data) {
        // Refresh balance after successful deduction
        await fetchBalance();
      }

      return data;
    } catch (error) {
      console.error('Error in deductWords:', error);
      return false;
    }
  };

  const checkWordLimit = (textLength: number): boolean => {
    return balance.total_words_available >= textLength;
  };

  const addWordCredits = async (planType: string, words: number, expiryDays: number = 30) => {
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
        });

      if (error) {
        console.error('Error adding word credits:', error);
        return false;
      }

      // Refresh balance after adding credits
      await fetchBalance();
      return true;
    } catch (error) {
      console.error('Error in addWordCredits:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchPlans();
    } else {
      setBalance({
        total_words_available: 0,
        free_words: 0,
        purchased_words: 0,
        next_expiry_date: null,
      });
      setLoading(false);
    }
  }, [user]);

  return {
    balance,
    plans,
    loading,
    fetchBalance,
    deductWords,
    checkWordLimit,
    addWordCredits,
  };
};
