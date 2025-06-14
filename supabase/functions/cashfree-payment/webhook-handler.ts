
import { corsHeaders } from './types.ts'

export async function handleWebhook(req: Request, supabase: any) {
  console.log('Webhook received:', req.method, req.url)
  
  // Handle test requests from Cashfree
  if (req.method === 'GET') {
    console.log('GET request to webhook - returning OK for testing')
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  const webhookData = await req.json()
  
  console.log('Received webhook:', webhookData)

  // Log webhook for debugging
  await supabase
    .from('cashfree_webhook_logs')
    .insert({
      event_type: webhookData.type || 'unknown',
      order_id: webhookData.data?.order?.order_id,
      payment_id: webhookData.data?.payment?.payment_id,
      webhook_data: webhookData,
      signature: req.headers.get('x-webhook-signature'),
    })

  // Handle payment success
  if (webhookData.type === 'PAYMENT_SUCCESS_WEBHOOK') {
    const { order_id, payment_id } = webhookData.data.payment

    // Update order status
    const { data: order, error: orderError } = await supabase
      .from('cashfree_orders')
      .update({ 
        order_status: 'PAID',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', order_id)
      .select()
      .single()

    if (orderError) {
      console.error('Error updating order:', orderError)
      return new Response('Error updating order', { status: 500, headers: corsHeaders })
    }

    // Get the word plan to determine if it's a subscription or top-up
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
        payment_gateway: 'cashfree',
        cashfree_order_id: order_id,
        cashfree_payment_id: payment_id,
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
        
        // Check if user has active subscription (required for top-ups)
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
      .from('cashfree_webhook_logs')
      .update({ processed: true })
      .eq('order_id', order_id)
  }

  return new Response('OK', { status: 200, headers: corsHeaders })
}
