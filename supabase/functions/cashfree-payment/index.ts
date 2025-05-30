
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateOrderRequest {
  word_plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface CashfreeOrderResponse {
  order_id: string;
  payment_session_id: string;
  order_status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // Handle webhook requests (no authentication required)
    if (req.method === 'POST' && path === 'webhook') {
      return await handleWebhook(req, supabase)
    }

    // For all other requests, require authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST' && path === 'create-order') {
      return await createOrder(req, supabase, user)
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createOrder(req: Request, supabase: any, user: any) {
  const { word_plan_id, customer_name, customer_email, customer_phone }: CreateOrderRequest = await req.json()

  console.log('Creating order for user:', user.id, 'plan:', word_plan_id)

  // Get word plan details
  const { data: wordPlan, error: planError } = await supabase
    .from('word_plans')
    .select('*')
    .eq('id', word_plan_id)
    .eq('is_active', true)
    .single()

  if (planError || !wordPlan) {
    return new Response(
      JSON.stringify({ error: 'Invalid word plan' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Calculate total amount including GST
  const amountBeforeGst = wordPlan.price_before_gst
  const gstAmount = (amountBeforeGst * wordPlan.gst_percentage) / 100
  const totalAmount = amountBeforeGst + gstAmount

  // Generate unique order ID
  const orderId = `ORDER_${Date.now()}_${user.id.slice(0, 8)}`

  // Prepare Cashfree order data
  const orderData = {
    order_id: orderId,
    order_amount: totalAmount,
    order_currency: 'INR',
    customer_details: {
      customer_id: user.id,
      customer_name: customer_name,
      customer_email: customer_email,
      customer_phone: customer_phone,
    },
    order_meta: {
      return_url: `${req.headers.get('origin')}/billing?payment=success&order_id=${orderId}`,
      notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/cashfree-payment/webhook`,
    }
  }

  // Create order with Cashfree
  const cashfreeResponse = await fetch('https://sandbox.cashfree.com/pg/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': Deno.env.get('CASHFREE_APP_ID') ?? '',
      'x-client-secret': Deno.env.get('CASHFREE_SECRET_KEY') ?? '',
      'x-api-version': '2023-08-01',
    },
    body: JSON.stringify(orderData)
  })

  if (!cashfreeResponse.ok) {
    const errorText = await cashfreeResponse.text()
    console.error('Cashfree API error:', errorText)
    return new Response(
      JSON.stringify({ error: 'Failed to create order', details: errorText }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const cashfreeOrder: CashfreeOrderResponse = await cashfreeResponse.json()

  // Store order in database
  const { error: dbError } = await supabase
    .from('cashfree_orders')
    .insert({
      user_id: user.id,
      order_id: orderId,
      order_amount: totalAmount,
      order_currency: 'INR',
      customer_details: orderData.customer_details,
      order_meta: orderData.order_meta,
      order_status: cashfreeOrder.order_status,
      payment_session_id: cashfreeOrder.payment_session_id,
      word_plan_id: word_plan_id,
      words_to_credit: wordPlan.words_included,
    })

  if (dbError) {
    console.error('Database error:', dbError)
    return new Response(
      JSON.stringify({ error: 'Failed to save order' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({
      order_id: orderId,
      payment_session_id: cashfreeOrder.payment_session_id,
      order_status: cashfreeOrder.order_status,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleWebhook(req: Request, supabase: any) {
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

    // Credit words to user account
    const { error: creditError } = await supabase
      .from('user_word_credits')
      .upsert({
        user_id: order.user_id,
        words_available: order.words_to_credit,
        words_purchased: order.words_to_credit,
        is_free_credit: false,
        purchase_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year expiry
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })

    if (creditError) {
      console.error('Error crediting words:', creditError)
    } else {
      console.log(`Successfully credited ${order.words_to_credit} words to user ${order.user_id}`)
    }

    // Mark webhook as processed
    await supabase
      .from('cashfree_webhook_logs')
      .update({ processed: true })
      .eq('order_id', order_id)
  }

  return new Response('OK', { status: 200, headers: corsHeaders })
}
