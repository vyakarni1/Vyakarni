
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

  const createDefaultSubscription = async () => {
    if (!user) return;

    try {
      // Get the free plan ID
      const { data: freePlan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('plan_type', 'free')
        .eq('plan_name', 'फ्री प्लान') // Get the actual free plan, not the basic one
        .single();

      if (planError || !freePlan) {
        console.error('Error getting free plan:', planError);
        return;
      }

      // Create subscription for the user with next billing date (1 month from now for free plan)
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: freePlan.id,
          status: 'active',
          next_billing_date: nextBillingDate.toISOString(),
          auto_renewal: false, // Free plan doesn't auto-renew
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
          setSubscription({
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
          });
        }
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

  const upgradeSubscription = async (newPlanId: string) => {
    if (!user || !subscription) return false;

    try {
      // Calculate next billing date (1 month from now)
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

      await fetchSubscription();
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

      await fetchSubscription();
      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return false;
    }
  };

  const isSubscriptionActive = (): boolean => {
    if (!subscription) return false;
    
    // Check if it's a paid plan (basic or premium) or if it's the हॉबी प्लान (Basic)
    const isPaidPlan = subscription.plan_type === 'basic' || 
                      subscription.plan_type === 'premium' ||
                      subscription.plan_name === 'हॉबी प्लान (Basic)' ||
                      subscription.plan_type === 'free' && subscription.plan_name === 'हॉबी प्लान (Basic)';
    
    return subscription.status === 'active' && isPaidPlan;
  };

  // Set up real-time subscription for subscription changes
  useEffect(() => {
    if (user) {
      fetchSubscription();

      // Subscribe to changes in user subscriptions
      const subscription_channel = supabase
        .channel('user_subscriptions_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'user_subscriptions',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            console.log('Subscription changed, refetching...');
            fetchSubscription();
          }
        )
        .subscribe();

      // Subscribe to changes in word credits
      const credits_channel = supabase
        .channel('user_word_credits_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'user_word_credits',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            console.log('Word credits changed, refetching subscription...');
            fetchSubscription();
          }
        )
        .subscribe();

      return () => {
        subscription_channel.unsubscribe();
        credits_channel.unsubscribe();
      };
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
    refetch: fetchSubscription
  };
};
