
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import type { PaymentData } from '@/types/wordPlan';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const initiateRazorpayPayment = async (paymentData: PaymentData) => {
    if (!user) {
      toast.error("कृपया पहले लॉगिन करें।");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Initiating Razorpay payment:', paymentData);

      // Call our edge function to create order
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: paymentData,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      console.log('Razorpay order created:', data);

      // Load Razorpay SDK if not already loaded
      if (!window.Razorpay) {
        await loadRazorpaySDK();
      }

      const options = {
        key: data.key,
        amount: data.amount * 100, // Convert to paise
        currency: data.currency,
        name: 'व्याकरणी',
        description: 'हिंदी व्याकरण जांच सेवा - शब्द क्रेडिट',
        order_id: data.order_id,
        prefill: {
          name: paymentData.customer_name,
          email: paymentData.customer_email,
          contact: paymentData.customer_phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: (response: any) => {
          console.log('Payment successful:', response);
          toast.success("भुगतान सफल! शब्द क्रेडिट आपके खाते में जोड़ दिए गए हैं।");
          // Redirect to billing page
          window.location.href = `/billing?payment=success&order_id=${data.order_id}`;
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            toast.error("भुगतान रद्द कर दिया गया।");
          },
        },
      };

      console.log('Opening Razorpay checkout with options:', options);

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        toast.error(response.error.description || "भुगतान में त्रुटि हुई।");
      });

      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error instanceof Error ? error.message : "भुगतान शुरू करने में त्रुटि हुई।");
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
