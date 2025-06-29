
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useRealtimeSubscription = () => {
  const { user } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime listeners for user:', user.id);

    // Listen to subscription changes
    const subscriptionChannel = supabase
      .channel('user_subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Subscription changed:', payload);
          setLastUpdate(Date.now());
        }
      )
      .subscribe();

    // Listen to word credits changes
    const creditsChannel = supabase
      .channel('user_word_credits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_word_credits',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Word credits changed:', payload);
          setLastUpdate(Date.now());
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime listeners');
      supabase.removeChannel(subscriptionChannel);
      supabase.removeChannel(creditsChannel);
    };
  }, [user]);

  return { lastUpdate };
};
