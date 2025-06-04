
import { useWordCredits } from './useWordCredits';
import { useSubscription } from './useSubscription';

export const useUsageLimits = () => {
  const { balance, deductWords, checkWordLimit, canPurchaseTopup } = useWordCredits();
  const { subscription, checkWordLimit: checkPerCorrectionLimit, isSubscriptionActive } = useSubscription();

  // Check both per-correction limits and available word balance
  const checkAndEnforceWordLimitPerCorrection = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (!subscription) return false;

    // Check if text exceeds per-correction word limit
    if (!checkPerCorrectionLimit(wordCount)) {
      return false;
    }

    // Check if user has enough word credits available
    return checkWordLimit(wordCount);
  };

  const trackUsage = async (text: string) => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    return await deductWords(wordCount, 'grammar_check', text);
  };

  const getWordLimitPerCorrection = (): number => {
    return subscription?.max_words_per_correction || 1000;
  };

  const getMonthlyCorrectionsLimit = (): number => {
    return subscription?.max_corrections_per_month || 50;
  };

  const getWordBalanceBreakdown = () => {
    return {
      totalWords: balance.total_words_available,
      topupWords: balance.topup_words,
      subscriptionWords: balance.subscription_words,
      freeWords: balance.free_words,
      purchasedWords: balance.purchased_words,
      nextExpiry: balance.next_expiry_date,
      hasActiveSubscription: balance.has_active_subscription,
    };
  };

  const canUseTopupFeature = (): boolean => {
    return canPurchaseTopup();
  };

  const needsSubscriptionForTopup = (): boolean => {
    return !balance.has_active_subscription;
  };

  return {
    subscription,
    balance,
    checkAndEnforceWordLimit: checkAndEnforceWordLimitPerCorrection,
    trackUsage,
    getWordLimitPerCorrection,
    getMonthlyCorrectionsLimit,
    getWordBalanceBreakdown,
    canUseTopupFeature,
    needsSubscriptionForTopup,
    isSubscriptionActive,
  };
};
