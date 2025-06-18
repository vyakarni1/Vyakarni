
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface SubscriptionData {
  word_plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface MandateInfo {
  mandate_id: string;
  razorpay_subscription_id: string;
  status: string;
  next_charge_at: string;
  remaining_count: number;
  max_amount: number;
}

export const useRecurringSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mandate, setMandate] = useState<MandateInfo | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const createRecurringSubscription = async (subscriptionData: SubscriptionData) => {
    if (!user) {
      toast({
        title: "प्रमाणीकरण आवश्यक",
        description: "कृपया पहले लॉगिन करें।",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    setIsLoading(true);

    try {
      console.log('Initiating recurring subscription:', subscriptionData);

      // Call our edge function to create subscription
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: subscriptionData,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create subscription');
      }

      if (!data) {
        throw new Error('No response data received');
      }

      console.log('Razorpay subscription created:', data);

      // Load Razorpay SDK if not already loaded
      if (!window.Razorpay) {
        await loadRazorpaySDK();
      }

      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: 'व्याकरणी - मासिक सब्स्क्रिप्शन',
        description: 'हिंदी व्याकरण जांच सेवा - मासिक योजना',
        image: '/favicon.ico',
        subscription_card_change: false,
        recurring: 1,
        callback_url: `${window.location.origin}/billing?payment=success&subscription_id=${data.subscription_id}`,
        prefill: {
          name: data.customer_details.name,
          email: data.customer_details.email,
          contact: data.customer_details.contact,
        },
        notes: data.notes,
        theme: {
          color: '#3B82F6',
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            console.log('Subscription modal dismissed');
            toast({
              title: "सब्स्क्रिप्शन रद्द",
              description: "सब्स्क्रिप्शन प्रक्रिया रद्द कर दी गई।",
              variant: "destructive",
            });
          },
        },
        handler: (response: any) => {
          console.log('Subscription successful:', response);
          toast({
            title: "सब्स्क्रिप्शन सफल",
            description: "आपका मासिक सब्स्क्रिप्शन सफलतापूर्वक सक्रिय हुआ। AutoPay सेटअप हो गया है।",
          });
          // Refresh the page to show updated subscription status
          window.location.reload();
        },
      };

      console.log('Opening Razorpay subscription checkout with options:', options);

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Subscription failed:', response);
        toast({
          title: "सब्स्क्रिप्शन असफल",
          description: response.error?.description || "सब्स्क्रिप्शन में त्रुटि हुई। कृपया पुनः प्रयास करें।",
          variant: "destructive",
        });
      });

      rzp.open();

    } catch (error) {
      console.error('Subscription initiation error:', error);
      let errorMessage = "सब्स्क्रिप्शन शुरू करने में त्रुटि हुई।";
      
      if (error instanceof Error) {
        if (error.message.includes('already has an active subscription')) {
          errorMessage = "आपके पास पहले से एक सक्रिय सब्स्क्रिप्शन है। कृपया उसे पहले रद्द करें।";
        } else if (error.message.includes('Plan not found')) {
          errorMessage = "चुना गया प्लान उपलब्ध नहीं है। कृपया दूसरा प्लान चुनें।";
        } else if (error.message.includes('Customer creation failed')) {
          errorMessage = "ग्राहक खाता बनाने में त्रुटि हुई। कृपया विवरण जांचें।";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "सब्स्क्रिप्शन त्रुटि",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveMandate = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_active_mandate', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching mandate:', error);
        return;
      }

      if (data && data.length > 0) {
        setMandate(data[0]);
      } else {
        setMandate(null);
      }
    } catch (error) {
      console.error('Error in fetchActiveMandate:', error);
    }
  };

  const pauseSubscription = async () => {
    if (!mandate?.razorpay_subscription_id) return false;

    try {
      // Note: This would require server-side implementation as API keys cannot be exposed
      toast({
        title: "सुविधा अनुपलब्ध",
        description: "सब्स्क्रिप्शन रोकने के लिए कृपया सपोर्ट से संपर्क करें।",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!mandate?.razorpay_subscription_id) return false;

    try {
      // Note: This would require server-side implementation as API keys cannot be exposed
      toast({
        title: "सुविधा अनुपलब्ध",
        description: "सब्स्क्रिप्शन रद्द करने के लिए कृपया सपोर्ट से संपर्क करें।",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  };

  const loadRazorpaySDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    });
  };

  return {
    createRecurringSubscription,
    fetchActiveMandate,
    pauseSubscription,
    cancelSubscription,
    mandate,
    isLoading,
  };
};
