
import { corsHeaders } from './types.ts'

export async function handleWebhook(req: Request, supabase: any) {
  console.log('Razorpay webhook received:', req.method, req.url)
  
  // Handle test requests
  if (req.method === 'GET') {
    console.log('GET request to webhook - returning OK for testing')
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  try {
    const webhookData = await req.json()
    console.log('Received Razorpay webhook:', webhookData)

    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    // Log webhook for debugging
    await supabase
      .from('razorpay_webhook_logs')
      .insert({
        event_type: webhookData.event || 'unknown',
        order_id: webhookData.payload?.order?.entity?.id || webhookData.payload?.payment?.entity?.order_id,
        payment_id: webhookData.payload?.payment?.entity?.id,
        webhook_data: webhookData,
        signature: signature,
      })

    // Handle payment.captured event
    if (webhookData.event === 'payment.captured') {
      const payment = webhookData.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id

      console.log('Processing payment.captured for order:', orderId, 'payment:', paymentId)

      // Get order from database
      const { data: order, error: orderError } = await supabase
        .from('razorpay_orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (orderError || !order) {
        console.error('Order not found:', orderId, orderError)
        return new Response('Order not found', { status: 404, headers: corsHeaders })
      }

      // Update order status
      const { error: updateError } = await supabase
        .from('razorpay_orders')
        .update({ 
          order_status: 'PAID',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return new Response('Error updating order', { status: 500, headers: corsHeaders })
      }

      // Get the word plan
      const { data: wordPlan, error: planError } = await supabase
        .from('word_plans')
        .select('*')
        .eq('id', order.word_plan_id)
        .single()

      if (planError) {
        console.error('Error fetching word plan:', planError)
        return new Response('Error fetching word plan', { status: 500, headers: corsHeaders })
      }

      console.log('Processing payment for plan:', wordPlan)

      // Create payment transaction record
      await supabase
        .from('payment_transactions')
        .insert({
          user_id: order.user_id,
          amount: order.order_amount,
          status: 'completed',
          payment_gateway: 'razorpay',
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          currency: 'INR',
        })

      try {
        if (wordPlan.plan_category === 'subscription') {
          // Handle subscription purchase
          console.log('Processing subscription purchase')
          
          // Create subscription using the database function
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .rpc('create_subscription_for_user', {
              user_uuid: order.user_id,
              plan_uuid: order.word_plan_id
            })

          if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError)
            // Continue to add word credits even if subscription creation fails
          } else {
            console.log('Successfully created subscription:', subscriptionData)
          }

          // Add subscription word credits (no expiry for subscription words)
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
            })

          if (creditError) {
            console.error('Error adding subscription word credits:', creditError)
          } else {
            console.log(`Successfully added ${order.words_to_credit} subscription words to user ${order.user_id}`)
          }

        } else if (wordPlan.plan_category === 'topup') {
          // Handle top-up purchase
          console.log('Processing top-up purchase')
          
          // Check if user has active subscription
          const { data: hasActiveSubscription, error: subscriptionCheckError } = await supabase
            .rpc('check_user_has_active_subscription', {
              user_uuid: order.user_id
            })

          if (subscriptionCheckError) {
            console.error('Error checking subscription status:', subscriptionCheckError)
            return new Response('Error checking subscription status', { status: 500, headers: corsHeaders })
          }

          if (!hasActiveSubscription) {
            console.error('User does not have active subscription for top-up purchase')
            return new Response('Active subscription required for top-up', { status: 400, headers: corsHeaders })
          }

          // Add top-up word credits (30 days expiry)
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 30)

          const { error: creditError } = await supabase
            .from('user_word_credits')
            .insert({
              user_id: order.user_id,
              words_available: order.words_to_credit,
              words_purchased: order.words_to_credit,
              is_free_credit: false,
              credit_type: 'topup',
              purchase_date: new Date().toISOString(),
              expiry_date: expiryDate.toISOString(),
            })

          if (creditError) {
            console.error('Error adding top-up word credits:', creditError)
          } else {
            console.log(`Successfully added ${order.words_to_credit} top-up words to user ${order.user_id}`)
          }

        } else {
          console.error('Unknown plan category:', wordPlan.plan_category)
          return new Response('Unknown plan category', { status: 400, headers: corsHeaders })
        }

      } catch (error) {
        console.error('Error processing payment:', error)
        return new Response('Error processing payment', { status: 500, headers: corsHeaders })
      }

      // Mark webhook as processed
      await supabase
        .from('razorpay_webhook_logs')
        .update({ processed: true })
        .eq('order_id', orderId)
    }

    return new Response('OK', { status: 200, headers: corsHeaders })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Error processing webhook', { status: 500, headers: corsHeaders })
  }
}
