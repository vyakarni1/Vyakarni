
import { useWordLimits } from './useWordLimits';
import { useSubscription } from './useSubscription';

export const useUsageLimits = () => {
  const { checkAndEnforceWordLimit, trackWordUsage, balance } = useWordLimits();
  const { subscription, checkWordLimit } = useSubscription();

  // Simplified to only check word limits per correction (not monthly limits)
  const checkAndEnforceWordLimitPerCorrection = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (!subscription) return false;

    // Check if text exceeds per-correction word limit - pass wordCount instead of text
    if (!checkWordLimit(wordCount)) {
      return false;
    }

    // Check if user has enough word credits
    return checkAndEnforceWordLimit(text);
  };

  const trackUsage = async (text: string) => {
    await trackWordUsage(text, 'grammar_check');
  };

  const getWordLimitPerCorrection = (): number => {
    return subscription?.max_words_per_correction || 1000;
  };

  return {
    subscription,
    balance,
    checkAndEnforceWordLimit: checkAndEnforceWordLimitPerCorrection,
    trackUsage,
    getWordLimitPerCorrection,
  };
};
