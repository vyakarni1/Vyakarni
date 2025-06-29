
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
  next_billing_date: string | null;
  auto_renewal: boolean;
  billing_cycle: string;
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

  const fetchSubscription = async (forceRefresh = false) => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching subscription for user:', user.id, forceRefresh ? '(forced)' : '');
      
      // Get subscription with additional billing info
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          id,
          status,
          expires_at,
          next_billing_date,
          auto_renewal,
          billing_cycle,
          subscription_plans (
            plan_name,
            plan_type,
            max_words_per_correction,
            max_corrections_per_month,
            max_team_members,
            features
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data && data.length > 0) {
        const subscriptionData = data[0];
        const planData = subscriptionData.subscription_plans;
        
        if (planData) {
          const newSubscription = {
            subscription_id: subscriptionData.id,
            plan_name: planData.plan_name,
            plan_type: planData.plan_type,
            max_words_per_correction: planData.max_words_per_correction,
            max_corrections_per_month: planData.max_corrections_per_month,
            max_team_members: planData.max_team_members,
            features: parseFeatures(planData.features),
            status: subscriptionData.status,
            expires_at: subscriptionData.expires_at,
            next_billing_date: subscriptionData.next_billing_date,
            auto_renewal: subscriptionData.auto_renewal,
            billing_cycle: subscriptionData.billing_cycle,
          };
          
          console.log('Fetched subscription:', newSubscription);
          setSubscription(newSubscription);
        }
      } else {
        // Try to create a default subscription if none exists
        console.log('No active subscription found, checking if we need to create one');
        await createDefaultSubscription();
      }
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSubscription = async () => {
    if (!user) return;

    try {
      // Check if user has purchased word credits but no active subscription
      const { data: wordCredits } = await supabase
        .from('user_word_credits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_free_credit', false)
        .gt('words_available', 0);

      if (wordCredits && wordCredits.length > 0) {
        // User has purchased credits, should have basic plan
        const { data: basicPlan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('plan_type', 'basic')
          .eq('is_active', true)
          .single();

        if (basicPlan) {
          const { error } = await supabase
            .from('user_subscriptions')
            .insert({
              user_id: user.id,
              plan_id: basicPlan.id,
              status: 'active',
              auto_renewal: false,
            });

          if (!error) {
            await fetchSubscription();
          }
        }
      } else {
        // Create free subscription
        const { data: freePlan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('plan_type', 'free')
          .eq('is_active', true)
          .single();

        if (freePlan) {
          const { error } = await supabase
            .from('user_subscriptions')
            .insert({
              user_id: user.id,
              plan_id: freePlan.id,
              status: 'active',
              auto_renewal: false,
            });

          if (!error) {
            await fetchSubscription();
          }
        }
      }
    } catch (error) {
      console.error('Error in createDefaultSubscription:', error);
    }
  };

  const checkWordLimit = (textLength: number): boolean => {
    if (!subscription) return true;
    return textLength <= subscription.max_words_per_correction;
  };

  const upgradeSubscription = async (newPlanId: string) => {
    if (!user || !subscription) return false;

    try {
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_id: newPlanId,
          next_billing_date: nextBillingDate.toISOString(),
          auto_renewal: true,
        })
        .eq('id', subscription.subscription_id);

      if (error) {
        console.error('Error upgrading subscription:', error);
        return false;
      }

      await fetchSubscription(true);
      return true;
    } catch (error) {
      console.error('Error in upgradeSubscription:', error);
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!user || !subscription) return false;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          auto_renewal: false,
        })
        .eq('id', subscription.subscription_id);

      if (error) {
        console.error('Error canceling subscription:', error);
        return false;
      }

      await fetchSubscription(true);
      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return false;
    }
  };

  const isSubscriptionActive = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data: hasActiveSubscription, error } = await supabase
        .rpc('check_user_has_active_subscription', {
          user_uuid: user.id
        });

      if (error) {
        console.error('Error checking subscription active status:', error);
        return false;
      }

      return hasActiveSubscription || false;
    } catch (error) {
      console.error('Error in isSubscriptionActive:', error);
      return false;
    }
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
    upgradeSubscription,
    cancelSubscription,
    isSubscriptionActive,
    refetch: () => fetchSubscription(true)
  };
};
