
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface CreateSubscriptionData {
  plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: Record<string, string>;
}

interface RazorpaySubscriptionOptions {
  subscription_id: string;
  customer_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpaySubscription = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpaySubscription = async (data: CreateSubscriptionData) => {
    if (!user) {
      toast.error('कृपया पहले लॉगिन करें');
      return null;
    }

    setIsLoading(true);

    try {
      console.log('Creating Razorpay subscription with data:', data);
      
      const { data: response, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'create_subscription',
          user_id: user.id,
          plan_id: data.plan_id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          notes: data.notes || {},
        },
      });

      if (error) {
        console.error('Error creating subscription:', error);
        toast.error('सब्स्क्रिप्शन बनाने में समस्या हुई');
        return null;
      }

      if (response.success) {
        console.log('Subscription created successfully:', response);
        return response;
      } else {
        console.error('Subscription creation failed:', response.error);
        toast.error(response.error || 'सब्स्क्रिप्शन बनाने में समस्या हुई');
        return null;
      }
    } catch (error) {
      console.error('Error in createRazorpaySubscription:', error);
      toast.error('कुछ गलत हुआ है। कृपया पुनः प्रयास करें।');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateRazorpaySubscription = async (subscriptionData: CreateSubscriptionData) => {
    if (!user) {
      toast.error('कृपया पहले लॉगिन करें');
      return;
    }

    // Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error('भुगतान गेटवे लोड नहीं हो सका');
      return;
    }

    // Create subscription on server
    const subscriptionResponse = await createRazorpaySubscription(subscriptionData);
    if (!subscriptionResponse) {
      return;
    }

    const options: RazorpaySubscriptionOptions = {
      subscription_id: subscriptionResponse.razorpay_subscription_id,
      customer_id: subscriptionResponse.razorpay_customer_id,
      handler: async (response: any) => {
        console.log('Razorpay subscription response:', response);
        
        try {
          // Verify the subscription payment
          const { data: verifyResponse, error: verifyError } = await supabase.functions.invoke('razorpay-payment', {
            body: {
              action: 'verify_subscription',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id,
            },
          });

          if (verifyError || !verifyResponse?.success) {
            console.error('Subscription verification failed:', verifyError || verifyResponse?.error);
            toast.error('भुगतान सत्यापन में समस्या हुई');
            return;
          }

          toast.success('सब्स्क्रिप्शन सफलतापूर्वक सक्रिय हो गया!');
          
          // Redirect to billing page
          window.location.href = '/billing?payment=success';
        } catch (error) {
          console.error('Error verifying subscription:', error);
          toast.error('भुगतान सत्यापन में समस्या हुई');
        }
      },
      prefill: {
        name: subscriptionData.customer_name,
        email: subscriptionData.customer_email,
        contact: subscriptionData.customer_phone,
      },
      notes: subscriptionData.notes || {},
      theme: {
        color: '#3B82F6',
      },
    };

    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', (response: any) => {
      console.error('Subscription payment failed:', response.error);
      toast.error('भुगतान असफल हो गया। कृपया पुनः प्रयास करें।');
    });

    razorpay.open();
  };

  return {
    createRazorpaySubscription,
    initiateRazorpaySubscription,
    isLoading,
  };
};
