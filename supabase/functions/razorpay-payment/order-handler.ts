
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
        JSON.stringify({ error: 'Missing required fields: word_plan_id, customer_name, customer_email, customer_phone' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user from request
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Authenticated user:', user.id)

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
        JSON.stringify({ error: 'Word plan not found or inactive' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Found word plan:', wordPlan)

    // Calculate total amount (price + GST)
    const amountBeforeGst = parseFloat(wordPlan.price_before_gst)
    const gstPercentage = parseFloat(wordPlan.gst_percentage) || 18
    const gstAmount = (amountBeforeGst * gstPercentage) / 100
    const totalAmount = amountBeforeGst + gstAmount

    // Create order in Razorpay
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY')

    if (!razorpayKeyId || !razorpaySecret) {
      console.error('Missing Razorpay credentials')
      return new Response(
        JSON.stringify({ error: 'Payment gateway configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const orderData = {
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${user.id.slice(-8)}`,
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
      console.error('Razorpay API error:', response.status, errorText)
      throw new Error(`Razorpay API error: ${response.status} - ${errorText}`)
    }

    const razorpayOrder = await response.json()
    console.log('Razorpay order created successfully:', razorpayOrder.id)

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
      console.error('Database error storing order:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Order stored in database:', dbOrder.id)

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
      JSON.stringify({ 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
