
import { useWordCredits } from './useWordCredits';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export const useWordLimits = () => {
  const { balance, deductWords, checkWordLimit } = useWordCredits();
  const { subscription, isSubscriptionActive } = useSubscription();

  const getWordLimitPerCorrection = (): number => {
    return isSubscriptionActive ? 1000 : 100;
  };

  const checkAndEnforceWordLimit = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wordLimit = getWordLimitPerCorrection();
    
    // Check per-correction word limit first
    if (wordCount > wordLimit) {
      const userType = isSubscriptionActive ? 'प्रीमियम' : 'मुफ्त';
      toast.error(
        `शब्द सीमा पार हो गई! ${userType} उपयोगकर्ता ${wordLimit} शब्दों तक सीमित हैं। आपके पाठ में ${wordCount} शब्द हैं।`,
        {
          action: isSubscriptionActive ? undefined : {
            label: "प्रीमियम प्लान",
            onClick: () => window.open('/pricing', '_blank')
          }
        }
      );
      return false;
    }
    
    // Then check available word balance
    if (!checkWordLimit(wordCount)) {
      toast.error(
        `शब्द बैलेंस कम है! आपके पास ${balance.total_words_available} शब्द हैं, लेकिन ${wordCount} शब्दों की आवश्यकता है।`,
        {
          action: {
            label: "शब्द खरीदें",
            onClick: () => window.open('/pricing', '_blank')
          }
        }
      );
      return false;
    }

    return true;
  };

  const trackWordUsage = async (text: string, actionType: string) => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    return await deductWords(wordCount, actionType, text);
  };

  const getRemainingWords = (): number => {
    return balance.total_words_available;
  };

  const getWordBreakdown = () => {
    return {
      freeWords: balance.free_words,
      purchasedWords: balance.purchased_words,
      totalWords: balance.total_words_available,
      nextExpiry: balance.next_expiry_date,
      wordLimitPerCorrection: getWordLimitPerCorrection(),
      isSubscriptionActive,
    };
  };

  return {
    balance,
    checkAndEnforceWordLimit,
    trackWordUsage,
    getRemainingWords,
    getWordBreakdown,
    getWordLimitPerCorrection,
    isSubscriptionActive,
  };
};
