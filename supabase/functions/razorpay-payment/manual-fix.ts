
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

    if (planError) {
      throw new Error(`Word plan not found: ${planError.message}`);
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

    console.log(`Successfully processed manual payment fix for order ${orderId}`);
    return { success: true, message: 'Payment manually processed successfully' };

  } catch (error) {
    console.error('Manual fix error:', error);
    return { success: false, error: error.message };
  }
}
