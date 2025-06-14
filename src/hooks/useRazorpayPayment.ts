
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentData {
  word_plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export const useRazorpayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const initiateRazorpayPayment = async (paymentData: PaymentData) => {
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
      console.log('Initiating Razorpay payment:', paymentData);

      // Call our edge function to create order
      const { data, error } = await supabase.functions.invoke('razorpay-payment/create-order', {
        body: paymentData,
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create order');
      }

      if (!data) {
        throw new Error('No response data received');
      }

      console.log('Razorpay order created:', data);

      // Load Razorpay SDK if not already loaded
      if (!window.Razorpay) {
        await loadRazorpaySDK();
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'व्याकरणी',
        description: 'हिंदी व्याकरण जांच सेवा',
        order_id: data.order_id,
        prefill: {
          name: data.customer_details.name,
          email: data.customer_details.email,
          contact: data.customer_details.contact,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: (response: any) => {
          console.log('Payment successful:', response);
          toast({
            title: "भुगतान सफल",
            description: "आपका भुगतान सफलतापूर्वक पूरा हुआ। कुछ समय में आपके खाते में शब्द जोड़ दिए जाएंगे।",
          });
          // Redirect to billing page
          setTimeout(() => {
            window.location.href = `/billing?payment=success&order_id=${data.order_id}`;
          }, 2000);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            toast({
              title: "भुगतान रद्द",
              description: "भुगतान प्रक्रिया रद्द कर दी गई।",
              variant: "destructive",
            });
          },
        },
      };

      console.log('Opening Razorpay checkout with options:', options);

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        toast({
          title: "भुगतान असफल",
          description: response.error?.description || "भुगतान में त्रुटि हुई। कृपया पुनः प्रयास करें।",
          variant: "destructive",
        });
      });

      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      const errorMessage = error instanceof Error ? error.message : "भुगतान शुरू करने में त्रुटि हुई।";
      
      toast({
        title: "भुगतान त्रुटि",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
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
    initiateRazorpayPayment,
    isLoading,
  };
};
