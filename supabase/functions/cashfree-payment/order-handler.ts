
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { CreateOrderRequest, CashfreeOrderResponse, corsHeaders } from './types.ts'

export async function createOrder(req: Request, supabase: any, user: any) {
  const { word_plan_id, customer_name, customer_email, customer_phone }: CreateOrderRequest = await req.json()

  console.log('Creating order for user:', user.id, 'plan:', word_plan_id)

  // Check if API credentials are available
  const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID')
  const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY')

  if (!cashfreeAppId || !cashfreeSecretKey) {
    console.error('Cashfree API credentials not found')
    return new Response(
      JSON.stringify({ error: 'Payment gateway configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  console.log('Using Cashfree App ID:', cashfreeAppId.substring(0, 8) + '...')

  // Get word plan details
  const { data: wordPlan, error: planError } = await supabase
    .from('word_plans')
    .select('*')
    .eq('id', word_plan_id)
    .eq('is_active', true)
    .single()

  if (planError || !wordPlan) {
    console.error('Word plan error:', planError)
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

  // Get the origin from request headers for return URL, fallback to vyakarni.com
  const origin = req.headers.get('origin') || 'https://vyakarni.com'
  
  // Prepare Cashfree order data with flexible return URL
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
      return_url: `${origin}/billing?payment=success&order_id=${orderId}`,
      notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/cashfree-payment/webhook`,
    }
  }

  console.log('Creating Cashfree order with return URL:', orderData.order_meta.return_url)
  console.log('Order data:', JSON.stringify(orderData, null, 2))

  // Use production endpoint for live payments
  const cashfreeBaseUrl = 'https://api.cashfree.com/pg'
  
  // Create order with Cashfree
  const cashfreeResponse = await fetch(`${cashfreeBaseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': cashfreeAppId,
      'x-client-secret': cashfreeSecretKey,
      'x-api-version': '2023-08-01',
    },
    body: JSON.stringify(orderData)
  })

  console.log('Cashfree response status:', cashfreeResponse.status)
  const responseText = await cashfreeResponse.text()
  console.log('Cashfree response:', responseText)

  if (!cashfreeResponse.ok) {
    console.error('Cashfree API error:', responseText)
    
    // Check if it's a domain whitelisting error
    if (responseText.includes('whitelisted') || responseText.includes('domain')) {
      return new Response(
        JSON.stringify({ 
          error: 'Domain not whitelisted', 
          details: 'Please whitelist your domain in Cashfree merchant dashboard',
          action_required: 'Add your domain to Cashfree whitelist',
          status: cashfreeResponse.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create payment order', 
        details: responseText,
        status: cashfreeResponse.status
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let cashfreeOrder: CashfreeOrderResponse
  try {
    cashfreeOrder = JSON.parse(responseText)
  } catch (parseError) {
    console.error('Failed to parse Cashfree response:', parseError)
    return new Response(
      JSON.stringify({ error: 'Invalid response from payment gateway' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

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

  console.log('Order created successfully:', orderId)

  return new Response(
    JSON.stringify({
      order_id: orderId,
      payment_session_id: cashfreeOrder.payment_session_id,
      order_status: cashfreeOrder.order_status,
      return_url: orderData.order_meta.return_url,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
