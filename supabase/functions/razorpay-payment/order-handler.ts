
import { corsHeaders } from './types.ts'

export async function handleCreateOrder(req: Request, supabase: any) {
  try {
    const { word_plan_id, customer_name, customer_email, customer_phone } = await req.json()

    console.log('Creating Razorpay order for plan:', word_plan_id)

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

    // Create order data
    const orderData = {
      amount: totalAmount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        word_plan_id: word_plan_id,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone
      }
    }

    // Create Razorpay order
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_SECRET_KEY')}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    const razorpayOrder = await orderResponse.json()
    
    if (!orderResponse.ok) {
      console.error('Razorpay order creation failed:', razorpayOrder)
      throw new Error(`Order creation failed: ${razorpayOrder.error?.description || 'Unknown error'}`)
    }

    console.log('Razorpay order created:', razorpayOrder.id)

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
    const { data: dbOrder, error: orderError } = await supabase
      .from('razorpay_orders')
      .insert({
        user_id: user.id,
        order_id: razorpayOrder.id,
        order_amount: totalAmount / 100, // Convert back to rupees
        order_currency: 'INR',
        order_status: 'CREATED',
        word_plan_id: word_plan_id,
        words_to_credit: wordPlan.words_included,
        customer_details: {
          name: customer_name,
          email: customer_email,
          contact: customer_phone
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
      order_id: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      customer_details: {
        name: customer_name,
        email: customer_email,
        contact: customer_phone
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in handleCreateOrder:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create order'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}
