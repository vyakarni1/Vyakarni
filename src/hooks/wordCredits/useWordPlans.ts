
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WordPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  plan_category: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
  // Enhanced fields from subscription_plans
  max_words_per_correction?: number;
  max_corrections_per_month?: number;
  max_team_members?: number;
  features?: string[];
  subscription_plan_id?: string;
}

export const useWordPlans = () => {
  const [plans, setPlans] = useState<WordPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      // Fetch word plans with corresponding subscription plan details
      const { data: wordPlans, error: wordPlansError } = await supabase
        .from('word_plans')
        .select('*')
        .eq('is_active', true)
        .eq('plan_category', 'subscription')
        .order('price_before_gst', { ascending: true });

      if (wordPlansError) {
        console.error('Error fetching word plans:', wordPlansError);
        return;
      }

      // Fetch subscription plans to get features and limits
      const { data: subscriptionPlans, error: subscriptionError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (subscriptionError) {
        console.error('Error fetching subscription plans:', subscriptionError);
        return;
      }

      // Merge word plans with subscription plan data based on plan_type
      const enhancedPlans: WordPlan[] = wordPlans?.map(wordPlan => {
        const subscriptionPlan = subscriptionPlans?.find(
          sp => sp.plan_type === wordPlan.plan_type
        );

        // Convert Json[] to string[] for features
        const features = subscriptionPlan?.features ? 
          (Array.isArray(subscriptionPlan.features) ? 
            subscriptionPlan.features.map(feature => String(feature)) : []) : [];

        return {
          ...wordPlan,
          max_words_per_correction: subscriptionPlan?.max_words_per_correction,
          max_corrections_per_month: subscriptionPlan?.max_corrections_per_month,
          max_team_members: subscriptionPlan?.max_team_members,
          features,
          subscription_plan_id: subscriptionPlan?.id,
        };
      }) || [];

      setPlans(enhancedPlans);
    } catch (error) {
      console.error('Error in fetchPlans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionPlans = () => {
    return plans.filter(plan => plan.plan_category === 'subscription');
  };

  // Get dynamic discount information based on plan type
  const getDiscountInfo = (planType: string) => {
    const plan = plans.find(p => p.plan_type === planType);
    if (!plan) return { hasDiscount: false, percentage: 0, originalPrice: 0 };

    // Calculate discount based on plan type
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

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    fetchPlans,
    getSubscriptionPlans,
    getDiscountInfo,
  };
};
