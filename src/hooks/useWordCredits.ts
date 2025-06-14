
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
  const { plans, loading, getSubscriptionPlans, getTopupPlans } = useWordPlans();
  const { addWordCredits, canPurchaseTopup } = useWordCreditsManagement();

  useEffect(() => {
    console.log('[useWordCredits] Effect triggered, user:', user ? 'exists' : 'null');
    
    if (user) {
      console.log('[useWordCredits] Fetching balance for user:', user.id);
      fetchBalance().catch(error => {
        console.error('[useWordCredits] Error fetching balance:', error);
      });
    } else {
      console.log('[useWordCredits] No user, setting default balance');
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
    try {
      console.log('[useWordCredits] Deducting words:', wordsToDeduct, actionType);
      const result = await deductWords(wordsToDeduct, actionType, textContent);
      if (result) {
        console.log('[useWordCredits] Words deducted successfully, refreshing balance');
        await fetchBalance();
      }
      return result;
    } catch (error) {
      console.error('[useWordCredits] Error in enhancedDeductWords:', error);
      return false;
    }
  };

  const enhancedAddWordCredits = async (planType: string, words: number, expiryDays: number = 30, creditType: string = 'topup') => {
    try {
      console.log('[useWordCredits] Adding word credits:', planType, words);
      const result = await addWordCredits(planType, words, expiryDays, creditType);
      if (result) {
        console.log('[useWordCredits] Credits added successfully, refreshing balance');
        await fetchBalance();
      }
      return result;
    } catch (error) {
      console.error('[useWordCredits] Error in enhancedAddWordCredits:', error);
      return false;
    }
  };

  const canPurchaseTopupSafe = () => {
    try {
      return canPurchaseTopup(balance.has_active_subscription);
    } catch (error) {
      console.error('[useWordCredits] Error in canPurchaseTopupSafe:', error);
      return false;
    }
  };

  console.log('[useWordCredits] Current state - balance:', balance, 'loading:', loading);

  return {
    balance,
    plans,
    loading,
    fetchBalance,
    deductWords: enhancedDeductWords,
    checkWordLimit,
    addWordCredits: enhancedAddWordCredits,
    getSubscriptionPlans,
    getTopupPlans,
    canPurchaseTopup: canPurchaseTopupSafe,
  };
};
