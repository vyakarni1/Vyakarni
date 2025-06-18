
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

    // Check for existing active subscription and clean up if necessary
    const { data: existingSubscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_mandates(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (existingSubscriptions && existingSubscriptions.length > 0) {
      console.log('Found existing subscriptions, cleaning up:', existingSubscriptions.length)
      
      // Cancel existing subscriptions in our database
      for (const sub of existingSubscriptions) {
        await supabase
          .from('user_subscriptions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('id', sub.id)

        // Cancel associated mandates
        if (sub.subscription_mandates && sub.subscription_mandates.length > 0) {
          await supabase
            .from('subscription_mandates')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('subscription_id', sub.id)
        }
      }
      
      console.log('Cleaned up existing subscriptions')
    }

    // Calculate total amount with GST
    const totalAmount = Math.round((wordPlan.price_before_gst * (1 + wordPlan.gst_percentage / 100)) * 100) // Convert to paise

    // Try to find existing customer by email
    let razorpayCustomer;
    try {
      const customerListResponse = await fetch(`https://api.razorpay.com/v1/customers?email=${encodeURIComponent(customer_email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
          'Content-Type': 'application/json',
        }
      })

      const customerList = await customerListResponse.json()
      
      if (customerList.items && customerList.items.length > 0) {
        razorpayCustomer = customerList.items[0]
        console.log('Found existing Razorpay customer:', razorpayCustomer.id)
      }
    } catch (error) {
      console.log('Error checking existing customer, will create new:', error)
    }

    // Create customer if not found
    if (!razorpayCustomer) {
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

      razorpayCustomer = await customerResponse.json()
      
      if (!customerResponse.ok) {
        console.error('Razorpay customer creation failed:', razorpayCustomer)
        throw new Error(`Customer creation failed: ${razorpayCustomer.error?.description || 'Unknown error'}`)
      }

      console.log('Razorpay customer created:', razorpayCustomer.id)
    }

    // Try to find existing plan with same amount and interval
    let razorpayPlan;
    try {
      const planListResponse = await fetch(`https://api.razorpay.com/v1/plans`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
          'Content-Type': 'application/json',
        }
      })

      const planList = await planListResponse.json()
      
      if (planList.items) {
        razorpayPlan = planList.items.find(plan => 
          plan.item.amount === totalAmount && 
          plan.period === 'monthly' && 
          plan.interval === 1
        )
        
        if (razorpayPlan) {
          console.log('Found existing Razorpay plan:', razorpayPlan.id)
        }
      }
    } catch (error) {
      console.log('Error checking existing plan, will create new:', error)
    }

    // Create plan if not found
    if (!razorpayPlan) {
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

      const planResponse = await fetch('https://api.razorpay.com/v1/plans', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
      })

      razorpayPlan = await planResponse.json()
      
      if (!planResponse.ok) {
        console.error('Razorpay plan creation failed:', razorpayPlan)
        throw new Error(`Plan creation failed: ${razorpayPlan.error?.description || 'Unknown error'}`)
      }

      console.log('Razorpay plan created:', razorpayPlan.id)
    }

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
        source: 'vyakarani',
        user_id: user.id
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

    // Store in our database - create both subscription and mandate immediately
    const nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    const mandateEnd = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) // 10 years from now

    // Create subscription record
    const { data: userSubscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: word_plan_id,
        status: 'created', // Will be updated to 'active' when webhook confirms
        next_billing_date: nextBilling.toISOString(),
        expires_at: mandateEnd.toISOString(),
        auto_renewal: true,
        billing_cycle: 'monthly',
        razorpay_subscription_id: razorpaySubscription.id,
        is_recurring: true
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error('Database subscription creation failed:', subscriptionError)
      throw new Error('Failed to store subscription in database')
    }

    console.log('Created user subscription:', userSubscription.id)

    // Create mandate record immediately
    const { data: mandate, error: mandateError } = await supabase
      .from('subscription_mandates')
      .insert({
        user_id: user.id,
        subscription_id: userSubscription.id,
        razorpay_subscription_id: razorpaySubscription.id,
        razorpay_plan_id: razorpayPlan.id,
        mandate_status: 'created',
        max_amount: totalAmount / 100, // Convert back to rupees
        start_date: nextBilling.toISOString(),
        end_date: mandateEnd.toISOString(),
        next_charge_at: nextBilling.toISOString(),
        current_start: new Date().toISOString(),
        current_end: nextBilling.toISOString(),
        status: 'created',
        notes: {
          customer_id: razorpayCustomer.id,
          plan_id: razorpayPlan.id,
          customer_details: {
            name: customer_name,
            email: customer_email,
            phone: customer_phone
          }
        }
      })
      .select()
      .single()

    if (mandateError) {
      console.error('Database mandate creation failed:', mandateError)
      // Don't throw error here, subscription can still work
    } else {
      console.log('Created subscription mandate:', mandate.id)
      
      // Link mandate to subscription
      await supabase
        .from('user_subscriptions')
        .update({ mandate_id: mandate.id })
        .eq('id', userSubscription.id)
    }

    // Store order record for tracking
    const { error: orderError } = await supabase
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

    if (orderError) {
      console.error('Database order creation failed:', orderError)
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

    // Verify webhook signature if secret is available
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    if (webhookSecret && webhookSignature) {
      const expectedSignature = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )

      const signature = await crypto.subtle.sign(
        'HMAC',
        expectedSignature,
        new TextEncoder().encode(body)
      )

      const computedSignature = 'sha256=' + Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      if (webhookSignature !== computedSignature) {
        console.error('Invalid webhook signature')
        return new Response('Unauthorized', { status: 401, headers: corsHeaders })
      }
      console.log('Webhook signature verified successfully')
    } else {
      console.warn('Webhook signature verification skipped - missing secret or signature')
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
        await handleSubscriptionActivated(payload.subscription.entity, supabase)
        break
      case 'subscription.charged':
        await handleSubscriptionCharged(payload.payment.entity, supabase)
        break
      case 'subscription.completed':
        await handleSubscriptionCompleted(payload.subscription.entity, supabase)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload.subscription.entity, supabase)
        break
      case 'subscription.halted':
        await handleSubscriptionHalted(payload.subscription.entity, supabase)
        break
      case 'invoice.paid':
        await handleInvoicePaid(payload.invoice.entity, payload.payment.entity, supabase)
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
    // Update subscription status to active
    const { data: updatedSubscription, error: updateError } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update subscription status:', updateError)
      return
    }

    console.log('Updated subscription to active:', updatedSubscription.id)

    // Update mandate status to active
    await supabase
      .from('subscription_mandates')
      .update({
        status: 'active',
        mandate_status: 'authenticated',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id)

    // Add initial word credits
    const { data: wordPlan } = await supabase
      .from('word_plans')
      .select('words_included')
      .eq('id', updatedSubscription.plan_id)
      .single()

    if (wordPlan && wordPlan.words_included) {
      await supabase.rpc('add_user_word_credits', {
        p_user_id: updatedSubscription.user_id,
        p_words_to_add: wordPlan.words_included,
        p_credit_type: 'subscription',
        p_expiry_date: null // Subscription words don't expire
      })

      console.log(`Added ${wordPlan.words_included} subscription words to user ${updatedSubscription.user_id}`)
    }

    console.log('Subscription activated successfully')
  } catch (error) {
    console.error('Error in handleSubscriptionActivated:', error)
  }
}

const handleSubscriptionCharged = async (payment: any, supabase: any) => {
  console.log('Processing subscription charge:', payment.id)
  
  try {
    // Get mandate details
    const { data: mandate } = await supabase
      .from('subscription_mandates')
      .select('*, user_subscriptions(*)')
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
        .eq('id', mandate.user_subscriptions.plan_id)
        .single()

      if (wordPlan) {
        // Add word credits for this billing cycle
        await supabase.rpc('add_user_word_credits', {
          p_user_id: mandate.user_id,
          p_words_to_add: wordPlan.words_included,
          p_credit_type: 'subscription',
          p_expiry_date: null // Subscription words don't expire
        })

        // Update mandate
        await supabase
          .from('subscription_mandates')
          .update({
            paid_count: mandate.paid_count + 1,
            remaining_count: Math.max(0, mandate.remaining_count - 1),
            next_charge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next month
            updated_at: new Date().toISOString()
          })
          .eq('id', mandate.id)

        console.log(`Added ${wordPlan.words_included} words for charge to user ${mandate.user_id}`)
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

  await supabase
    .from('user_subscriptions')
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

  await supabase
    .from('user_subscriptions')
    .update({ 
      status: 'halted',
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_subscription_id', subscription.id)
}

const handleInvoicePaid = async (invoice: any, payment: any, supabase: any) => {
  console.log('Processing invoice payment:', invoice.id, 'for subscription:', invoice.subscription_id)
  
  // This is often the first event we receive for successful subscription charges
  if (invoice.subscription_id && payment) {
    await handleSubscriptionCharged(payment, supabase)
  }
}
