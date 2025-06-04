
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface WordBalance {
  total_words_available: number;
  topup_words: number;
  subscription_words: number;
  free_words: number;
  purchased_words: number;
  next_expiry_date: string | null;
  has_active_subscription: boolean;
}

export const useWordBalance = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WordBalance>({
    total_words_available: 0,
    topup_words: 0,
    subscription_words: 0,
    free_words: 0,
    purchased_words: 0,
    next_expiry_date: null,
    has_active_subscription: false,
  });

  const fetchBalance = async () => {
    if (!user) return;

    try {
      // Use the enhanced function that returns subscription status
      const { data, error } = await supabase.rpc('get_user_word_balance', {
        user_uuid: user.id,
      });

      if (error) {
        console.error('Error fetching word balance:', error);
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const balanceData = data[0];
        setBalance({
          total_words_available: balanceData.total_words_available || 0,
          topup_words: balanceData.topup_words || 0,
          subscription_words: balanceData.subscription_words || 0,
          free_words: balanceData.free_words || 0,
          purchased_words: balanceData.purchased_words || 0,
          next_expiry_date: balanceData.next_expiry_date,
          has_active_subscription: balanceData.has_active_subscription || false,
        });
      }
    } catch (error) {
      console.error('Error in fetchBalance:', error);
    }
  };

  const checkWordLimit = (textLength: number): boolean => {
    return balance.total_words_available >= textLength;
  };

  return {
    balance,
    fetchBalance,
    checkWordLimit,
    setBalance,
  };
};
