
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/queryClient';
import type { WordCreditPlan } from '@/types/wordPlan';

export const useOptimizedWordPlans = () => {
  const {
    data: plans = [],
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.wordPlans,
    queryFn: async () => {
      const { data: wordPlans, error } = await supabase
        .from('word_plans')
        .select('*')
        .eq('is_active', true)
        .eq('plan_category', 'subscription')
        .order('price_before_gst', { ascending: true });

      if (error) throw error;

      const enhancedPlans: WordCreditPlan[] = wordPlans?.map(plan => ({
        ...plan,
        max_words_per_correction: plan.plan_type === 'free' ? 100 : 
                                  plan.plan_type === 'basic' ? 500 : 2000,
        max_corrections_per_month: plan.plan_type === 'free' ? 50 : 
                                   plan.plan_type === 'basic' ? 200 : 1000,
        max_team_members: plan.plan_type === 'premium' ? 5 : 1,
        features: getDefaultFeatures(plan.plan_type),
      })) || [];

      return enhancedPlans;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - plans don't change often
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  const getDefaultFeatures = (planType: string): string[] => {
    const baseFeatures = [
      "हिंदी व्याकरण जाँच",
      "एक-क्लिक वाक्य सुधार", 
      "शैली सुधार",
      "तत्काल परिणाम"
    ];

    if (planType === 'free') {
      return baseFeatures;
    }

    const premiumFeatures = [
      ...baseFeatures,
      "विस्तृत रिपोर्ट",
      "समर्पित सहायता"
    ];

    if (planType === 'basic') {
      return premiumFeatures;
    }

    if (planType === 'premium') {
      return [
        ...premiumFeatures,
        "एडवांस एआई फीचर्स",
        "प्राथमिकता सपोर्ट",
        "टीम सहयोग (5 सदस्य)"
      ];
    }

    return baseFeatures;
  };

  const getWordCreditPlans = () => {
    return plans.filter(plan => plan.plan_category === 'subscription');
  };

  const getDiscountInfo = (planType: string) => {
    const plan = plans.find(p => p.plan_type === planType);
    if (!plan) return { hasDiscount: false, percentage: 0, originalPrice: 0 };

    switch (planType) {
      case 'basic':
        return {
          hasDiscount: true,
          percentage: 33,
          originalPrice: Math.round(plan.price_before_gst * 1.5)
        };
      case 'premium':
        return {
          hasDiscount: true,
          percentage: 23,
          originalPrice: Math.round(plan.price_before_gst * 1.3)
        };
      default:
        return {
          hasDiscount: false,
          percentage: 0,
          originalPrice: 0
        };
    }
  };

  return {
    plans,
    isLoading,
    error,
    getWordCreditPlans,
    getDiscountInfo,
  };
};
