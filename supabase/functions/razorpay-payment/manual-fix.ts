
// Manual fix script for payment issues
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function manualFixPayment(supabase: any, orderId: string) {
  console.log('Starting manual payment fix for order:', orderId);
  
  try {
    // Get the order details
    const { data: order, error: orderError } = await supabase
      .from('razorpay_orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    console.log('Found order:', order);

    // Check if word_plan_id exists and is valid
    if (!order.word_plan_id) {
      console.log('Order missing word_plan_id, attempting to find a suitable plan...');
      
      // Try to find a subscription plan that matches the order amount
      const { data: suitablePlan, error: planError } = await supabase
        .from('word_plans')
        .select('*')
        .eq('plan_category', 'subscription')
        .eq('is_active', true)
        .limit(1);

      if (planError || !suitablePlan || suitablePlan.length === 0) {
        throw new Error('No suitable word plan found to assign to order');
      }

      // Update the order with a suitable plan
      const { error: updateOrderError } = await supabase
        .from('razorpay_orders')
        .update({ 
          word_plan_id: suitablePlan[0].id,
          words_to_credit: suitablePlan[0].words_included,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (updateOrderError) {
        throw new Error(`Failed to update order with word plan: ${updateOrderError.message}`);
      }

      console.log('Updated order with word plan:', suitablePlan[0]);
      
      // Refresh order data
      const { data: updatedOrder, error: refreshError } = await supabase
        .from('razorpay_orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (refreshError) {
        throw new Error(`Failed to refresh order data: ${refreshError.message}`);
      }

      order.word_plan_id = updatedOrder.word_plan_id;
      order.words_to_credit = updatedOrder.words_to_credit;
    }

    // Update order status to PAID
    const { error: updateOrderError } = await supabase
      .from('razorpay_orders')
      .update({ 
        order_status: 'PAID',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateOrderError) {
      throw new Error(`Failed to update order status: ${updateOrderError.message}`);
    }

    // Get the word plan
    const { data: wordPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('id', order.word_plan_id)
      .single();

    if (planError || !wordPlan) {
      throw new Error(`Word plan not found: ${planError?.message || 'Plan not found'}`);
    }

    console.log('Processing plan:', wordPlan);

    // Create subscription using the database function
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .rpc('create_subscription_for_user', {
        user_uuid: order.user_id,
        plan_uuid: order.word_plan_id
      });

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
    } else {
      console.log('Successfully created subscription:', subscriptionData);
    }

    // Add word credits
    const { error: creditError } = await supabase
      .from('user_word_credits')
      .insert({
        user_id: order.user_id,
        words_available: order.words_to_credit,
        words_purchased: order.words_to_credit,
        is_free_credit: false,
        credit_type: 'subscription',
        purchase_date: new Date().toISOString(),
        expiry_date: null, // Subscription words don't expire
      });

    if (creditError) {
      console.error('Error adding word credits:', creditError);
      throw new Error(`Failed to add word credits: ${creditError.message}`);
    }

    // Create payment transaction record
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: order.user_id,
        amount: order.order_amount,
        status: 'completed',
        payment_gateway: 'razorpay',
        razorpay_order_id: orderId,
        razorpay_payment_id: `manual_fix_${Date.now()}`,
        currency: 'INR',
      });

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
    }

    // Mark any related webhook as processed
    await supabase
      .from('razorpay_webhook_logs')
      .update({ 
        processed: true,
        processing_error: null,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    console.log(`Successfully processed manual payment fix for order ${orderId}`);
    return { success: true, message: 'Payment manually processed successfully' };

  } catch (error) {
    console.error('Manual fix error:', error);
    return { success: false, error: error.message };
  }
}
