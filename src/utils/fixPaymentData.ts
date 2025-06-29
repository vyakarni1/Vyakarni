
import { supabase } from '@/integrations/supabase/client';

export const fixPaymentDataInconsistencies = async () => {
  try {
    console.log('Starting payment data consistency fix...');
    
    // 1. Check for orders with missing word_plan_id
    const { data: ordersWithoutPlan, error: ordersError } = await supabase
      .from('razorpay_orders')
      .select('*')
      .is('word_plan_id', null);

    if (ordersError) {
      console.error('Error fetching orders without plan:', ordersError);
      return { success: false, error: ordersError.message };
    }

    console.log('Orders without word_plan_id:', ordersWithoutPlan);

    // 2. Get a default subscription plan to assign
    const { data: defaultPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('plan_category', 'subscription')
      .eq('is_active', true)
      .limit(1);

    if (planError || !defaultPlan || defaultPlan.length === 0) {
      console.error('No default plan found:', planError);
      return { success: false, error: 'No default plan available' };
    }

    console.log('Using default plan:', defaultPlan[0]);

    // 3. Update orders without word_plan_id
    if (ordersWithoutPlan && ordersWithoutPlan.length > 0) {
      for (const order of ordersWithoutPlan) {
        const { error: updateError } = await supabase
          .from('razorpay_orders')
          .update({
            word_plan_id: defaultPlan[0].id,
            words_to_credit: defaultPlan[0].words_included,
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        if (updateError) {
          console.error(`Error updating order ${order.order_id}:`, updateError);
        } else {
          console.log(`Updated order ${order.order_id} with plan ${defaultPlan[0].id}`);
        }
      }
    }

    // 4. Check for webhook logs that are not processed
    const { data: unprocessedWebhooks, error: webhookError } = await supabase
      .from('razorpay_webhook_logs')
      .select('*')
      .eq('processed', false)
      .eq('event_type', 'payment.captured');

    if (webhookError) {
      console.error('Error fetching unprocessed webhooks:', webhookError);
    } else {
      console.log('Unprocessed webhooks:', unprocessedWebhooks);
    }

    return { 
      success: true, 
      message: 'Data consistency fix completed',
      ordersFixed: ordersWithoutPlan?.length || 0,
      unprocessedWebhooks: unprocessedWebhooks?.length || 0
    };

  } catch (error) {
    console.error('Error in fixPaymentDataInconsistencies:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const processUnprocessedPayments = async () => {
  try {
    console.log('Processing unprocessed payments...');
    
    // Get successful payments that weren't processed
    const { data: unprocessedPayments, error } = await supabase
      .from('razorpay_webhook_logs')
      .select('*')
      .eq('processed', false)
      .eq('event_type', 'payment.captured')
      .not('order_id', 'is', null);

    if (error) {
      console.error('Error fetching unprocessed payments:', error);
      return { success: false, error: error.message };
    }

    console.log('Found unprocessed payments:', unprocessedPayments);

    const results = [];
    
    for (const payment of unprocessedPayments || []) {
      try {
        const { data, error: fixError } = await supabase.functions
          .invoke('razorpay-payment/manual-fix', {
            body: { order_id: payment.order_id }
          });

        if (fixError) {
          console.error(`Error processing payment ${payment.order_id}:`, fixError);
          results.push({ order_id: payment.order_id, success: false, error: fixError.message });
        } else {
          console.log(`Successfully processed payment ${payment.order_id}:`, data);
          results.push({ order_id: payment.order_id, success: true, data });
        }
      } catch (error) {
        console.error(`Exception processing payment ${payment.order_id}:`, error);
        results.push({ order_id: payment.order_id, success: false, error: error.message });
      }
    }

    return {
      success: true,
      message: 'Processed unprocessed payments',
      results
    };

  } catch (error) {
    console.error('Error in processUnprocessedPayments:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
