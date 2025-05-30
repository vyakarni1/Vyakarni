
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import type { Json } from '@/integrations/supabase/types';

interface SubscriptionData {
  subscription_id: string;
  plan_name: string;
  plan_type: string;
  max_words_per_correction: number;
  max_team_members: number;
  features: string[];
  status: string;
  expires_at: string | null;
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
    } finally {
      setLoading(false);
    }
  };

  const checkWordLimit = (textLength: number): boolean => {
    if (!subscription) return true;
    return textLength <= subscription.max_words_per_correction;
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  return {
    subscription,
    loading,
    checkWordLimit,
    refetch: fetchSubscription
  };
};
