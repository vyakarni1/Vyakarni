
import { corsHeaders } from './types.ts'

export async function handleCreateOrder(req: Request, supabase: any) {
  console.log('Creating Razorpay order')
  
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { word_plan_id, customer_name, customer_email, customer_phone } = await req.json()

    if (!word_plan_id || !customer_name || !customer_email || !customer_phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user from request
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get word plan details
    const { data: wordPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('id', word_plan_id)
      .single()

    if (planError || !wordPlan) {
      return new Response(
        JSON.stringify({ error: 'Word plan not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate total amount (price + GST)
    const amountBeforeGst = wordPlan.price_before_gst
    const gstAmount = (amountBeforeGst * wordPlan.gst_percentage) / 100
    const totalAmount = amountBeforeGst + gstAmount

    // Create order in Razorpay
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY')

    if (!razorpayKeyId || !razorpaySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    const orderData = {
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        word_plan_id,
        user_id: user.id,
        customer_name,
        customer_email,
        customer_phone,
        words_to_credit: wordPlan.words_included,
        plan_category: wordPlan.plan_category,
        plan_type: wordPlan.plan_type
      }
    }

    console.log('Creating Razorpay order with data:', orderData)

    const auth = btoa(`${razorpayKeyId}:${razorpaySecret}`)
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Razorpay API error:', errorText)
      throw new Error(`Razorpay API error: ${response.status}`)
    }

    const razorpayOrder = await response.json()
    console.log('Razorpay order created:', razorpayOrder)

    // Store order in database
    const { data: dbOrder, error: dbError } = await supabase
      .from('razorpay_orders')
      .insert({
        user_id: user.id,
        word_plan_id,
        order_id: razorpayOrder.id,
        order_amount: totalAmount,
        order_currency: 'INR',
        order_status: 'CREATED',
        words_to_credit: wordPlan.words_included,
        customer_details: {
          name: customer_name,
          email: customer_email,
          phone: customer_phone
        },
        order_meta: razorpayOrder
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error storing order in database:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: razorpayKeyId,
        customer_details: {
          name: customer_name,
          email: customer_email,
          contact: customer_phone
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create order' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
