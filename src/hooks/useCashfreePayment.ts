
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

declare global {
  interface Window {
    Cashfree: any;
  }
}

interface PaymentData {
  word_plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export const useCashfreePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const initiateCashfreePayment = async (paymentData: PaymentData) => {
    if (!user) {
      toast({
        title: "प्रमाणीकरण आवश्यक",
        description: "कृपया पहले लॉगिन करें।",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Initiating Cashfree payment:', paymentData);

      // Call our edge function to create order
      const { data, error } = await supabase.functions.invoke('cashfree-payment/create-order', {
        body: paymentData,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      console.log('Order created:', data);

      // Load Cashfree SDK if not already loaded
      if (!window.Cashfree) {
        await loadCashfreeSDK();
      }

      // Initialize Cashfree checkout
      const cashfree = window.Cashfree({
        mode: "sandbox", // Change to "production" for live
      });

      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/billing?payment=success&order_id=${data.order_id}`,
      };

      // Open Cashfree checkout
      cashfree.checkout(checkoutOptions).then((result: any) => {
        console.log('Payment result:', result);
        
        if (result.error) {
          toast({
            title: "भुगतान त्रुटि",
            description: result.error.message || "भुगतान में त्रुटि हुई।",
            variant: "destructive",
          });
        } else if (result.redirect) {
          // Payment completed, user will be redirected
          toast({
            title: "भुगतान सफल",
            description: "आपका भुगतान सफलतापूर्वक पूरा हुआ।",
          });
        }
      }).catch((error: any) => {
        console.error('Cashfree checkout error:', error);
        toast({
          title: "भुगतान त्रुटि",
          description: "चेकआउट खोलने में त्रुटि हुई।",
          variant: "destructive",
        });
      });

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "भुगतान त्रुटि",
        description: error instanceof Error ? error.message : "भुगतान शुरू करने में त्रुटि हुई।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCashfreeSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Cashfree) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.head.appendChild(script);
    });
  };

  return {
    initiateCashfreePayment,
    isLoading,
  };
};
