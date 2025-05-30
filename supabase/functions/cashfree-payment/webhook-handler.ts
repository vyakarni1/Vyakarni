
import { corsHeaders } from './types.ts'

export async function handleWebhook(req: Request, supabase: any) {
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
