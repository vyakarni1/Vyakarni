
import { corsHeaders } from './types.ts'

export const handleCreateSubscription = async (req: Request, supabase: any) => {
  try {
    const { word_plan_id, customer_name, customer_email, customer_phone } = await req.json()

    console.log('Creating Razorpay subscription for plan:', word_plan_id)

    // Get the word plan details
    const { data: wordPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('id', word_plan_id)
      .single()

    if (planError || !wordPlan) {
      throw new Error('Plan not found')
    }

    // Calculate total amount with GST
    const totalAmount = Math.round((wordPlan.price_before_gst * (1 + wordPlan.gst_percentage / 100)) * 100) // Convert to paise

    // Create Razorpay plan if it doesn't exist (this should be done once per plan)
    const planData = {
      period: 'monthly',
      interval: 1,
      item: {
        name: wordPlan.plan_name,
        amount: totalAmount,
        currency: 'INR',
        description: `${wordPlan.words_included} words monthly subscription`
      },
      notes: {
        plan_id: word_plan_id,
        plan_type: wordPlan.plan_type
      }
    }

    // Create Razorpay plan
    const planResponse = await fetch('https://api.razorpay.com/v1/plans', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData)
    })

    const razorpayPlan = await planResponse.json()
    
    if (!planResponse.ok) {
      console.error('Razorpay plan creation failed:', razorpayPlan)
      throw new Error(`Plan creation failed: ${razorpayPlan.error?.description || 'Unknown error'}`)
    }

    console.log('Razorpay plan created:', razorpayPlan.id)

    // Create customer
    const customerData = {
      name: customer_name,
      email: customer_email,
      contact: customer_phone,
      notes: {
        source: 'vyakarani_subscription'
      }
    }

    const customerResponse = await fetch('https://api.razorpay.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData)
    })

    const razorpayCustomer = await customerResponse.json()
    
    if (!customerResponse.ok) {
      console.error('Razorpay customer creation failed:', razorpayCustomer)
      throw new Error(`Customer creation failed: ${razorpayCustomer.error?.description || 'Unknown error'}`)
    }

    console.log('Razorpay customer created:', razorpayCustomer.id)

    // Create subscription
    const subscriptionData = {
      plan_id: razorpayPlan.id,
      customer_id: razorpayCustomer.id,
      quantity: 1,
      total_count: 120, // 10 years
      start_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Start tomorrow
      expire_by: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60), // 10 years from now
      customer_notify: 1,
      addons: [],
      notes: {
        word_plan_id: word_plan_id,
        user_email: customer_email,
        source: 'vyakarani'
      },
      notify_info: {
        notify_phone: customer_phone,
        notify_email: customer_email
      }
    }

    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData)
    })

    const razorpaySubscription = await subscriptionResponse.json()
    
    if (!subscriptionResponse.ok) {
      console.error('Razorpay subscription creation failed:', razorpaySubscription)
      throw new Error(`Subscription creation failed: ${razorpaySubscription.error?.description || 'Unknown error'}`)
    }

    console.log('Razorpay subscription created:', razorpaySubscription.id)

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header missing')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('User authentication failed')
    }

    // Store in our database
    const { data: razorpayOrder, error: orderError } = await supabase
      .from('razorpay_orders')
      .insert({
        user_id: user.id,
        order_id: razorpaySubscription.id,
        order_amount: totalAmount / 100, // Convert back to rupees
        order_currency: 'INR',
        order_status: 'CREATED',
        word_plan_id: word_plan_id,
        words_to_credit: wordPlan.words_included,
        customer_details: {
          name: customer_name,
          email: customer_email,
          contact: customer_phone
        },
        order_meta: {
          subscription_id: razorpaySubscription.id,
          plan_id: razorpayPlan.id,
          customer_id: razorpayCustomer.id,
          type: 'recurring_subscription'
        }
      })
      .select()
      .single()

    if (orderError) {
      console.error('Database order creation failed:', orderError)
      throw new Error('Failed to store order in database')
    }

    return new Response(JSON.stringify({
      key_id: Deno.env.get('RAZORPAY_KEY_ID'),
      subscription_id: razorpaySubscription.id,
      customer_id: razorpayCustomer.id,
      plan_id: razorpayPlan.id,
      amount: totalAmount,
      currency: 'INR',
      customer_details: {
        name: customer_name,
        email: customer_email,
        contact: customer_phone
      },
      notes: subscriptionData.notes,
      short_url: razorpaySubscription.short_url
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in handleCreateSubscription:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create subscription'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

export const handleSubscriptionWebhook = async (req: Request, supabase: any) => {
  try {
    const webhookSignature = req.headers.get('x-razorpay-signature')
    const body = await req.text()
    
    console.log('Received Razorpay subscription webhook')

    // Verify webhook signature
    const expectedSignature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('RAZORPAY_WEBHOOK_SECRET')),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      expectedSignature,
      new TextEncoder().encode(body)
    )

    const computedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (webhookSignature !== computedSignature) {
      console.error('Invalid webhook signature')
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const webhookData = JSON.parse(body)
    console.log('Processing subscription webhook:', webhookData.event)

    // Log webhook for debugging
    await supabase
      .from('razorpay_webhook_logs')
      .insert({
        event_type: webhookData.event,
        webhook_data: webhookData,
        signature: webhookSignature,
        processed: false
      })

    const { event, payload } = webhookData

    switch (event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(payload.subscription, supabase)
        break
      case 'subscription.charged':
        await handleSubscriptionCharged(payload.payment, supabase)
        break
      case 'subscription.completed':
        await handleSubscriptionCompleted(payload.subscription, supabase)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.subscription, supabase)
        break
      case 'subscription.halted':
        await handleSubscriptionHalted(payload.subscription, supabase)
        break
      case 'invoice.paid':
        await handleInvoicePaid(payload.invoice, supabase)
        break
      default:
        console.log('Unhandled subscription event:', event)
    }

    // Mark webhook as processed
    await supabase
      .from('razorpay_webhook_logs')
      .update({ processed: true })
      .eq('event_type', event)
      .eq('processed', false)

    return new Response('OK', { headers: corsHeaders })

  } catch (error) {
    console.error('Error processing subscription webhook:', error)
    return new Response('Error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
}

// Helper functions for webhook processing
const handleSubscriptionActivated = async (subscription: any, supabase: any) => {
  console.log('Processing subscription activation:', subscription.id)
  
  try {
    // Get order details
    const { data: order } = await supabase
      .from('razorpay_orders')
      .select('*')
      .eq('order_id', subscription.id)
      .single()

    if (!order) {
      console.error('Order not found for subscription:', subscription.id)
      return
    }

    // Create recurring subscription in database
    const { error: subscriptionError } = await supabase.rpc('create_recurring_subscription', {
      user_uuid: order.user_id,
      plan_uuid: order.word_plan_id,
      razorpay_subscription_id: subscription.id,
      razorpay_plan_id: subscription.plan_id,
      mandate_details: {
        customer_id: subscription.customer_id,
        status: subscription.status,
        auth_attempts: subscription.auth_attempts || 0
      }
    })

    if (subscriptionError) {
      console.error('Failed to create recurring subscription:', subscriptionError)
      return
    }

    // Add initial word credits
    const { error: creditsError } = await supabase.rpc('add_user_word_credits', {
      p_user_id: order.user_id,
      p_words_to_add: order.words_to_credit,
      p_credit_type: 'subscription',
      p_expiry_date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString() // 32 days
    })

    if (creditsError) {
      console.error('Failed to add word credits:', creditsError)
    }

    console.log('Subscription activated successfully')
  } catch (error) {
    console.error('Error in handleSubscriptionActivated:', error)
  }
}

const handleSubscriptionCharged = async (payment: any, supabase: any) => {
  console.log('Processing subscription charge:', payment.id)
  
  try {
    // Get subscription details
    const { data: mandate } = await supabase
      .from('subscription_mandates')
      .select('*')
      .eq('razorpay_subscription_id', payment.subscription_id)
      .single()

    if (!mandate) {
      console.error('Mandate not found for subscription:', payment.subscription_id)
      return
    }

    // Record the charge
    await supabase
      .from('subscription_charges')
      .insert({
        mandate_id: mandate.id,
        user_id: mandate.user_id,
        razorpay_payment_id: payment.id,
        amount: payment.amount / 100, // Convert from paise
        status: payment.status,
        charge_date: new Date(payment.created_at * 1000).toISOString(),
        paid_at: payment.status === 'captured' ? new Date().toISOString() : null
      })

    if (payment.status === 'captured') {
      // Get word plan details
      const { data: wordPlan } = await supabase
        .from('word_plans')
        .select('words_included')
        .eq('id', mandate.razorpay_plan_id)
        .single()

      if (wordPlan) {
        // Add word credits for this billing cycle
        await supabase.rpc('add_user_word_credits', {
          p_user_id: mandate.user_id,
          p_words_to_add: wordPlan.words_included,
          p_credit_type: 'subscription',
          p_expiry_date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString() // 32 days
        })

        // Update mandate
        await supabase
          .from('subscription_mandates')
          .update({
            paid_count: mandate.paid_count + 1,
            remaining_count: mandate.remaining_count - 1,
            next_charge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next month
            updated_at: new Date().toISOString()
          })
          .eq('id', mandate.id)
      }
    }

    console.log('Subscription charge processed successfully')
  } catch (error) {
    console.error('Error in handleSubscriptionCharged:', error)
  }
}

const handleSubscriptionCompleted = async (subscription: any, supabase: any) => {
  console.log('Processing subscription completion:', subscription.id)
  
  await supabase
    .from('subscription_mandates')
    .update({ 
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_subscription_id', subscription.id)
}

const handleSubscriptionCancelled = async (subscription: any, supabase: any) => {
  console.log('Processing subscription cancellation:', subscription.id)
  
  await supabase
    .from('subscription_mandates')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_subscription_id', subscription.id)

  await supabase
    .from('user_subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_subscription_id', subscription.id)
}

const handleSubscriptionHalted = async (subscription: any, supabase: any) => {
  console.log('Processing subscription halt:', subscription.id)
  
  await supabase
    .from('subscription_mandates')
    .update({ 
      status: 'halted',
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_subscription_id', subscription.id)
}

const handleInvoicePaid = async (invoice: any, supabase: any) => {
  console.log('Processing invoice payment:', invoice.id)
  
  // This is typically handled by subscription.charged event
  // But we can use this as a backup or for additional processing
}
