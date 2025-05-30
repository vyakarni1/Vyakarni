import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export const useUsageLimits = () => {
  const { subscription, usage, updateUsage } = useSubscription();

  const checkAndEnforceWordLimit = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (!usage) return false;

    if (wordCount > 1000) {
      toast.error(
        `शब्द सीमा पार हो गई! अधिकतम 1000 शब्द की अनुमति है। वर्तमान में ${wordCount} शब्द हैं।`
      );
      return false;
    }

    return true;
  };

  const checkAndEnforceCorrectionLimit = (): boolean => {
    if (!usage) return false;

    if (usage.max_corrections === -1) return true; // Unlimited

    if (usage.corrections_used >= usage.max_corrections) {
      toast.error(
        `मासिक सुधार सीमा पूर्ण! अधिकतम ${usage.max_corrections} सुधार की अनुमति है। प्रो प्लान में अपग्रेड करें।`,
        {
          action: {
            label: "अपग्रेड करें",
            onClick: () => window.open('/pricing', '_blank')
          }
        }
      );
      return false;
    }

    return true;
  };

  const trackUsage = async (text: string) => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    await updateUsage(wordCount);
  };

  const getRemainingCorrections = (): number | string => {
    if (!usage) return 0;
    if (usage.max_corrections === -1) return 'असीमित';
    return Math.max(0, usage.max_corrections - usage.corrections_used);
  };

  const getUsagePercentage = (): number => {
    if (!usage || usage.max_corrections === -1) return 0;
    return Math.min(100, (usage.corrections_used / usage.max_corrections) * 100);
  };

  return {
    subscription,
    usage,
    checkAndEnforceWordLimit,
    checkAndEnforceCorrectionLimit,
    trackUsage,
    getRemainingCorrections,
    getUsagePercentage
  };
};
