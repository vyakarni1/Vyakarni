
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import type { Json } from '@/integrations/supabase/types';

interface SubscriptionData {
  subscription_id: string;
  plan_name: string;
  plan_type: string;
  max_words_per_correction: number;
  max_corrections_per_month: number;
  max_team_members: number;
  features: string[];
  status: string;
  expires_at: string | null;
}

interface UsageData {
  corrections_used: number;
  words_processed: number;
  max_corrections: number;
  max_words_per_correction: number;
}

// Helper function to convert Json to string array
const parseFeatures = (features: Json): string[] => {
  if (Array.isArray(features)) {
    return features as string[];
  }
  return [];
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const createDefaultSubscription = async () => {
    if (!user) return;

    try {
      // Get the free plan ID
      const { data: freePlan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('plan_type', 'free')
        .single();

      if (planError || !freePlan) {
        console.error('Error getting free plan:', planError);
        return;
      }

      // Create subscription for the user
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: freePlan.id,
          status: 'active'
        });

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
        return;
      }

      // Refetch subscription after creating
      fetchSubscription();
    } catch (error) {
      console.error('Error in createDefaultSubscription:', error);
    }
  };

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_subscription', {
        user_uuid: user.id,
      });

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data && data.length > 0) {
        const subscriptionData = data[0];
        setSubscription({
          ...subscriptionData,
          features: parseFeatures(subscriptionData.features)
        });
      } else {
        // No subscription found, create default free subscription
        console.log('No subscription found, creating default free subscription');
        await createDefaultSubscription();
      }
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
    }
  };

  const fetchUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_monthly_usage', {
        user_uuid: user.id,
      });

      if (error) {
        console.error('Error fetching usage:', error);
        return;
      }

      if (data && data.length > 0) {
        setUsage(data[0]);
      } else {
        // Set default usage values if no data found
        setUsage({
          corrections_used: 0,
          words_processed: 0,
          max_corrections: 5,
          max_words_per_correction: 100
        });
      }
    } catch (error) {
      console.error('Error in fetchUsage:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWordLimit = (textLength: number): boolean => {
    if (!usage) return true;
    return textLength <= usage.max_words_per_correction;
  };

  const checkCorrectionLimit = (): boolean => {
    if (!usage) return true;
    if (usage.max_corrections === -1) return true; // Unlimited
    return usage.corrections_used < usage.max_corrections;
  };

  const updateUsage = async (wordsProcessed: number) => {
    if (!user) return;

    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const { error } = await supabase
        .from('user_usage_monthly')
        .upsert({
          user_id: user.id,
          month: currentMonth,
          year: currentYear,
          corrections_used: (usage?.corrections_used || 0) + 1,
          words_processed: (usage?.words_processed || 0) + wordsProcessed,
        }, {
          onConflict: 'user_id,month,year'
        });

      if (error) {
        console.error('Error updating usage:', error);
      } else {
        // Refresh usage data
        fetchUsage();
      }
    } catch (error) {
      console.error('Error in updateUsage:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUsage();
    } else {
      setSubscription(null);
      setUsage(null);
      setLoading(false);
    }
  }, [user]);

  return {
    subscription,
    usage,
    loading,
    checkWordLimit,
    checkCorrectionLimit,
    updateUsage,
    refetch: () => {
      fetchSubscription();
      fetchUsage();
    }
  };
};
