
import { supabase } from '@/integrations/supabase/client';

export const fixUserPayment = async () => {
  try {
    console.log('Attempting to fix payment for order: order_QmyKKWvn8hpuE1');
    
    const { data, error } = await supabase.functions
      .invoke('razorpay-payment/manual-fix', {
        body: { order_id: 'order_QmyKKWvn8hpuE1' }
      });

    if (error) {
      console.error('Manual fix error:', error);
      return { success: false, error: error.message };
    }

    console.log('Manual fix result:', data);
    return data;
    
  } catch (error) {
    console.error('Error calling manual fix:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
