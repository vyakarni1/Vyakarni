
import { corsHeaders } from './types.ts'

export async function handleManualProcess(req: Request, supabase: any) {
  console.log('Manual processing endpoint called')
  
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Process the specific failed order for teammaxproai@gmail.com
    const orderId = 'order_Qh7xtuignamMB6'
    const paymentId = 'pay_Qh7zV9MIAQGmVK'
    
    console.log('Manually processing failed payment for order:', orderId)
    
    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('razorpay_orders')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', orderId, orderError)
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Found order:', order)

    // Update order status to PAID
    const { error: updateError } = await supabase
      .from('razorpay_orders')
      .update({ 
        order_status: 'PAID',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return new Response(
        JSON.stringify({ error: 'Error updating order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the word plan
    const { data: wordPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('id', order.word_plan_id)
      .single()

    if (planError) {
      console.error('Error fetching word plan:', planError)
      return new Response(
        JSON.stringify({ error: 'Error fetching word plan' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing payment for plan:', wordPlan)

    // Create payment transaction record
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: order.user_id,
        amount: order.order_amount,
        status: 'completed',
        payment_gateway: 'razorpay',
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        currency: 'INR',
      })

    if (transactionError) {
      console.error('Error creating payment transaction:', transactionError)
    }

    // Get the basic subscription plan (the one we just created)
    const { data: basicPlan, error: basicPlanError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_name', 'हॉबी प्लान (Basic)')
      .single()

    if (basicPlanError || !basicPlan) {
      console.error('Basic plan not found:', basicPlanError)
      return new Response(
        JSON.stringify({ error: 'Basic subscription plan not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle subscription purchase
    console.log('Processing subscription purchase')
    
    // Create subscription using the database function
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .rpc('create_subscription_for_user', {
        user_uuid: order.user_id,
        plan_uuid: basicPlan.id
      })

    if (subscriptionError || !subscriptionData?.success) {
      console.error('Error creating subscription:', subscriptionError, subscriptionData)
      return new Response(
        JSON.stringify({ error: 'Error creating subscription' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.log('Successfully created subscription:', subscriptionData)
    }

    // Add subscription word credits using the new function
    const wordsToAdd = wordPlan.words_included || 10000;
    
    const { data: creditResult, error: creditError } = await supabase
      .rpc('add_user_word_credits', {
        p_user_id: order.user_id,
        p_words_to_add: wordsToAdd,
        p_credit_type: 'subscription',
        p_expiry_date: null // Subscription words don't expire
      })

    if (creditError || !creditResult) {
      console.error('Error adding subscription word credits:', creditError)
      return new Response(
        JSON.stringify({ error: 'Error adding word credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.log(`Successfully added ${wordsToAdd} subscription words to user ${order.user_id}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed successfully',
        order_id: orderId,
        words_added: wordsToAdd,
        subscription_created: subscriptionData?.success || false
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in manual processing:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process payment manually',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
