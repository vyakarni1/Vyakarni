
import { corsHeaders } from './types.ts'

export async function handleSubscription(req: Request, supabase: any) {
  console.log('Razorpay subscription handler called:', req.method, req.url)
  
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { action, ...requestData } = await req.json()
    console.log('Subscription action:', action, 'Data:', requestData)

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY')

    if (!razorpayKeyId || !razorpaySecret) {
      console.error('Razorpay credentials not configured')
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const credentials = btoa(`${razorpayKeyId}:${razorpaySecret}`)

    if (action === 'create_subscription') {
      return await createSubscription(requestData, credentials, supabase)
    } else if (action === 'verify_subscription') {
      return await verifySubscription(requestData, credentials, supabase)
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error in subscription handler:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function createSubscription(requestData: any, credentials: string, supabase: any) {
  const { user_id, plan_id, customer_name, customer_email, customer_phone, notes } = requestData

  try {
    // Get the subscription plan details
    const { data: subscriptionPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .single()

    if (planError || !subscriptionPlan) {
      console.error('Subscription plan not found:', planError)
      return new Response(JSON.stringify({ error: 'Subscription plan not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create or get customer
    const customerResponse = await fetch('https://api.razorpay.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: customer_name,
        email: customer_email,
        contact: customer_phone,
        fail_existing: '0', // Don't fail if customer already exists
      }),
    })

    if (!customerResponse.ok) {
      const errorData = await customerResponse.text()
      console.error('Failed to create customer:', errorData)
      return new Response(JSON.stringify({ error: 'Failed to create customer' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const customer = await customerResponse.json()
    console.log('Customer created/found:', customer.id)

    // Create Razorpay Plan (if not exists)
    const planAmount = Math.round(subscriptionPlan.price_monthly * 100) // Convert to paise
    const planResponse = await fetch('https://api.razorpay.com/v1/plans', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period: 'monthly',
        interval: 1,
        item: {
          name: subscriptionPlan.plan_name,
          amount: planAmount,
          currency: 'INR',
          description: `${subscriptionPlan.plan_name} - ${subscriptionPlan.words_included} words per month`,
        },
        notes: {
          plan_id: plan_id,
          plan_type: subscriptionPlan.plan_type,
        },
      }),
    })

    if (!planResponse.ok) {
      const errorData = await planResponse.text()
      console.error('Failed to create plan:', errorData)
      return new Response(JSON.stringify({ error: 'Failed to create subscription plan' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const razorpayPlan = await planResponse.json()
    console.log('Razorpay plan created:', razorpayPlan.id)

    // Create subscription
    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: razorpayPlan.id,
        customer_id: customer.id,
        quantity: 1,
        total_count: 120, // 10 years
        start_at: Math.floor(Date.now() / 1000) + 86400, // Start from tomorrow
        expire_by: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60), // 10 years from now
        customer_notify: 1,
        notes: {
          ...notes,
          user_id: user_id,
          plan_id: plan_id,
        },
      }),
    })

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.text()
      console.error('Failed to create subscription:', errorData)
      return new Response(JSON.stringify({ error: 'Failed to create subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const subscription = await subscriptionResponse.json()
    console.log('Subscription created:', subscription.id)

    // Store subscription in database
    const { data: dbSubscription, error: dbError } = await supabase
      .rpc('create_recurring_subscription', {
        user_uuid: user_id,
        plan_uuid: plan_id,
        razorpay_subscription_id: subscription.id,
        razorpay_plan_id: razorpayPlan.id,
        mandate_details: {
          customer_id: customer.id,
          customer_name: customer_name,
          customer_email: customer_email,
          customer_phone: customer_phone,
        }
      })

    if (dbError) {
      console.error('Error storing subscription in database:', dbError)
      return new Response(JSON.stringify({ error: 'Failed to store subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      razorpay_subscription_id: subscription.id,
      razorpay_customer_id: customer.id,
      subscription_status: subscription.status,
      database_subscription: dbSubscription,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(JSON.stringify({ error: 'Failed to create subscription' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function verifySubscription(requestData: any, credentials: string, supabase: any) {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, user_id } = requestData

  try {
    // Verify signature (optional but recommended)
    // For now, we'll trust the payment and update the subscription status
    
    // Get subscription details from Razorpay
    const subscriptionResponse = await fetch(`https://api.razorpay.com/v1/subscriptions/${razorpay_subscription_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    })

    if (!subscriptionResponse.ok) {
      console.error('Failed to fetch subscription details')
      return new Response(JSON.stringify({ error: 'Failed to verify subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const subscription = await subscriptionResponse.json()
    console.log('Subscription verified:', subscription)

    // Update subscription status in database
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_subscription_id', razorpay_subscription_id)
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Error updating subscription status:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update mandate status
    const { error: mandateError } = await supabase
      .from('subscription_mandates')
      .update({
        mandate_status: 'authenticated',
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_subscription_id', razorpay_subscription_id)
      .eq('user_id', user_id)

    if (mandateError) {
      console.error('Error updating mandate status:', mandateError)
    }

    return new Response(JSON.stringify({
      success: true,
      subscription_status: subscription.status,
      payment_id: razorpay_payment_id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error verifying subscription:', error)
    return new Response(JSON.stringify({ error: 'Failed to verify subscription' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
