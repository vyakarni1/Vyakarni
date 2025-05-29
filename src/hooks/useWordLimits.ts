
import { useWordCredits } from './useWordCredits';
import { toast } from 'sonner';

export const useWordLimits = () => {
  const { balance, deductWords, checkWordLimit } = useWordCredits();

  const checkAndEnforceWordLimit = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (!checkWordLimit(wordCount)) {
      toast.error(
        `शब्द सीमा पार हो गई! आपके पास ${balance.total_words_available} शब्द हैं, लेकिन ${wordCount} शब्दों की आवश्यकता है।`,
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
    };
  };

  return {
    balance,
    checkAndEnforceWordLimit,
    trackWordUsage,
    getRemainingWords,
    getWordBreakdown,
  };
};
