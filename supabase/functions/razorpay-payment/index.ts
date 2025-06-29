
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './types.ts'
import { handleWebhook } from './webhook-handler.ts'
import { handleSubscription } from './subscription-handler.ts'

console.log("Razorpay payment function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    console.log('Request URL:', url.pathname, 'Method:', req.method)

    // Handle webhook requests
    if (url.pathname.includes('/webhook')) {
      return await handleWebhook(req, null) // supabase client will be initialized in webhook handler
    }

    // Handle subscription requests
    if (url.pathname.includes('/subscription') || req.method === 'POST') {
      const body = await req.clone().json()
      if (body.action === 'create_subscription' || body.action === 'verify_subscription') {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        return await handleSubscription(req, supabase)
      }
    }

    // Handle one-time payment requests (existing functionality)
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const { 
      word_plan_id, 
      customer_name, 
      customer_email, 
      customer_phone 
    } = await req.json()

    console.log('Creating one-time payment order for plan:', word_plan_id)

    // Get the user from the request (this should be passed from the client)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get word plan details
    const { data: wordPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('id', word_plan_id)
      .single()

    if (planError || !wordPlan) {
      return new Response(JSON.stringify({ error: 'Word plan not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Calculate total amount including GST
    const totalAmount = Math.round(
      wordPlan.price_before_gst + (wordPlan.price_before_gst * wordPlan.gst_percentage / 100)
    )

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY')

    if (!razorpayKeyId || !razorpaySecret) {
      return new Response(JSON.stringify({ error: 'Payment gateway not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const credentials = btoa(`${razorpayKeyId}:${razorpaySecret}`)
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalAmount * 100, // Convert to paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          word_plan_id: word_plan_id,
          user_id: user.id,
          customer_name: customer_name,
          customer_email: customer_email,
          customer_phone: customer_phone,
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text()
      console.error('Razorpay order creation failed:', errorData)
      return new Response(JSON.stringify({ error: 'Failed to create payment order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const order = await orderResponse.json()

    // Store order in database
    const { error: dbError } = await supabase
      .from('razorpay_orders')
      .insert({
        user_id: user.id,
        word_plan_id: word_plan_id,
        order_id: order.id,
        order_amount: totalAmount,
        order_currency: 'INR',
        words_to_credit: wordPlan.words_included,
        customer_details: {
          name: customer_name,
          email: customer_email,
          phone: customer_phone,
        },
        order_status: 'CREATED',
      })

    if (dbError) {
      console.error('Error storing order in database:', dbError)
      return new Response(JSON.stringify({ error: 'Failed to store order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: order.id,
      amount: totalAmount,
      currency: 'INR',
      key: razorpayKeyId,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in razorpay-payment function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
