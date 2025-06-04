
import { useState, useEffect } from 'react';
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

interface WordPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  plan_category: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
}

export const useWordCredits = () => {
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
  const [plans, setPlans] = useState<WordPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_word_balance_detailed', {
        user_uuid: user.id,
      });

      if (error) {
        console.error('Error fetching detailed word balance:', error);
        // Fallback to original function if new one doesn't exist yet
        const { data: fallbackData, error: fallbackError } = await supabase.rpc('get_user_word_balance', {
          user_uuid: user.id,
        });
        
        if (fallbackError) {
          console.error('Error fetching fallback word balance:', fallbackError);
          return;
        }

        if (fallbackData && fallbackData.length > 0) {
          setBalance({
            ...fallbackData[0],
            topup_words: 0,
            subscription_words: fallbackData[0].total_words_available,
            has_active_subscription: false,
          });
        }
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
    }
  };

  const deductWords = async (wordsToDeduct: number, actionType: string, textContent?: string) => {
    if (!user) return false;

    try {
      // Try to use the new priority-based deduction function
      const { data, error } = await supabase.rpc('deduct_words_with_priority', {
        user_uuid: user.id,
        words_to_deduct: wordsToDeduct,
        action_type: actionType,
        text_content: textContent || null,
      });

      if (error) {
        console.error('Error with priority deduction, falling back to original:', error);
        // Fallback to original deduction function
        const { data: fallbackData, error: fallbackError } = await supabase.rpc('deduct_words', {
          user_uuid: user.id,
          words_to_deduct: wordsToDeduct,
          action_type: actionType,
          text_content: textContent || null,
        });

        if (fallbackError) {
          console.error('Error deducting words:', fallbackError);
          return false;
        }

        if (fallbackData) {
          await fetchBalance();
        }
        return fallbackData;
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

  const addWordCredits = async (planType: string, words: number, expiryDays: number = 30, creditType: string = 'topup') => {
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

      // Refresh balance after adding credits
      await fetchBalance();
      return true;
    } catch (error) {
      console.error('Error in addWordCredits:', error);
      return false;
    }
  };

  const getSubscriptionPlans = () => {
    return plans.filter(plan => plan.plan_category === 'subscription');
  };

  const getTopupPlans = () => {
    return plans.filter(plan => plan.plan_category === 'topup');
  };

  const canPurchaseTopup = (): boolean => {
    return balance.has_active_subscription;
  };

  useEffect(() => {
    // Always fetch plans regardless of authentication status
    const loadPlans = async () => {
      await fetchPlans();
      setLoading(false);
    };

    loadPlans();

    // Fetch user-specific balance only if authenticated
    if (user) {
      fetchBalance();
    } else {
      setBalance({
        total_words_available: 0,
        topup_words: 0,
        subscription_words: 0,
        free_words: 0,
        purchased_words: 0,
        next_expiry_date: null,
        has_active_subscription: false,
      });
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
    getSubscriptionPlans,
    getTopupPlans,
    canPurchaseTopup,
  };
};
