
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useWordBalance } from './wordCredits/useWordBalance';
import { useWordDeduction } from './wordCredits/useWordDeduction';
import { useWordPlans } from './wordCredits/useWordPlans';
import { useWordCreditsManagement } from './wordCredits/useWordCreditsManagement';

export const useWordCredits = () => {
  const { user } = useAuth();
  const { balance, fetchBalance, checkWordLimit, setBalance } = useWordBalance();
  const { deductWords } = useWordDeduction();
  const { plans, loading, getWordCreditPlans, getDiscountInfo } = useWordPlans();
  const { addWordCredits } = useWordCreditsManagement();

  // Force refresh balance when user changes or component mounts
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchBalance();
      }, 100);
      return () => clearTimeout(timer);
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

  const enhancedDeductWords = async (wordsToDeduct: number, actionType: string, textContent?: string) => {
    const result = await deductWords(wordsToDeduct, actionType, textContent);
    if (result) {
      await fetchBalance();
    }
    return result;
  };

  const enhancedAddWordCredits = async (planType: string, words: number, creditType: string = 'purchased') => {
    const result = await addWordCredits(planType, words, creditType);
    if (result) {
      await fetchBalance();
    }
    return result;
  };

  const refreshBalance = async () => {
    await fetchBalance();
  };

  return {
    balance,
    plans,
    loading,
    fetchBalance: refreshBalance,
    deductWords: enhancedDeductWords,
    checkWordLimit,
    addWordCredits: enhancedAddWordCredits,
    getWordCreditPlans,
    getDiscountInfo,
  };
};
