
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
}

export const useWordPlans = () => {
  const [plans, setPlans] = useState<WordPlan[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionPlans = () => {
    return plans.filter(plan => plan.plan_category === 'subscription');
  };

  const getTopupPlans = () => {
    return plans.filter(plan => plan.plan_category === 'topup');
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    fetchPlans,
    getSubscriptionPlans,
    getTopupPlans,
  };
};
