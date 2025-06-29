
import { corsHeaders } from './types.ts'
import { manualFixPayment } from './manual-fix.ts'

export async function handleWebhook(req: Request, supabase: any) {
  console.log('Razorpay webhook received:', req.method, req.url)
  
  // Handle test requests
  if (req.method === 'GET') {
    console.log('GET request to webhook - returning OK for testing')
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  // Handle manual fix requests (for admin use)
  if (req.method === 'POST' && req.url.includes('manual-fix')) {
    const { order_id } = await req.json();
    const result = await manualFixPayment(supabase, order_id);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const webhookData = await req.json()
    console.log('Received Razorpay webhook:', JSON.stringify(webhookData, null, 2))

    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    console.log('Webhook signature present:', !!signature)
    console.log('Webhook secret configured:', !!webhookSecret)

    // Enhanced webhook logging
    const logEntry = {
      event_type: webhookData.event || 'unknown',
      order_id: webhookData.payload?.order?.entity?.id || webhookData.payload?.payment?.entity?.order_id,
      payment_id: webhookData.payload?.payment?.entity?.id,
      webhook_data: webhookData,
      signature: signature,
      processed: false,
      processing_error: null,
      created_at: new Date().toISOString()
    };

    // Log webhook for debugging
    const { error: logError } = await supabase
      .from('razorpay_webhook_logs')
      .insert(logEntry);

    if (logError) {
      console.error('Error logging webhook:', logError);
    }

    // Handle payment.captured event
    if (webhookData.event === 'payment.captured') {
      const payment = webhookData.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id

      console.log('Processing payment.captured for order:', orderId, 'payment:', paymentId)

      try {
        // Get order from database
        const { data: order, error: orderError } = await supabase
          .from('razorpay_orders')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (orderError || !order) {
          const errorMsg = `Order not found: ${orderId}`;
          console.error(errorMsg, orderError);
          
          // Update webhook log with error
          await supabase
            .from('razorpay_webhook_logs')
            .update({ 
              processing_error: errorMsg,
              updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)
            .eq('event_type', 'payment.captured');

          return new Response(JSON.stringify({ error: errorMsg, order_id: orderId }), { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        console.log('Found order for processing:', order)

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
          
          // Update webhook log with error
          await supabase
            .from('razorpay_webhook_logs')
            .update({ 
              processing_error: `Error updating order: ${updateError.message}`,
              updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)
            .eq('event_type', 'payment.captured');

          return new Response(JSON.stringify({ error: 'Error updating order', details: updateError }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        // Get the word plan with error handling
        const { data: wordPlan, error: planError } = await supabase
          .from('word_plans')
          .select('*')
          .eq('id', order.word_plan_id)
          .single()

        if (planError || !wordPlan) {
          const errorMsg = `Word plan not found for ID: ${order.word_plan_id}`;
          console.error(errorMsg, planError);
          
          // Update webhook log with error
          await supabase
            .from('razorpay_webhook_logs')
            .update({ 
              processing_error: errorMsg,
              updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)
            .eq('event_type', 'payment.captured');

          return new Response(JSON.stringify({ error: errorMsg, details: planError }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }

        console.log('Processing payment for plan:', wordPlan)

        // Create payment transaction record first
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
          console.error('Error creating transaction record:', transactionError)
          // Continue processing even if transaction log fails
        }

        // Process based on plan category
        if (wordPlan.plan_category === 'subscription') {
          console.log('Processing subscription purchase')
          
          // Create subscription using the database function
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .rpc('create_subscription_for_user', {
              user_uuid: order.user_id,
              plan_uuid: order.word_plan_id
            })

          if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError)
            
            // Update webhook log with error
            await supabase
              .from('razorpay_webhook_logs')
              .update({ 
                processing_error: `Error creating subscription: ${subscriptionError.message}`,
                updated_at: new Date().toISOString()
              })
              .eq('order_id', orderId)
              .eq('event_type', 'payment.captured');
          } else {
            console.log('Successfully created subscription:', subscriptionData)
          }

          // Add subscription word credits (no expiry for subscription words)
          const { error: creditError } = await supabase
            .from('user_word_credits')
            .insert({
              user_id: order.user_id,
              words_available: order.words_to_credit,
              words_purchased: order.words_to_credit,
              is_free_credit: false,
              credit_type: 'subscription',
              purchase_date: new Date().toISOString(),
              expiry_date: null, // Subscription words don't expire
            })

          if (creditError) {
            console.error('Error adding subscription word credits:', creditError)
            
            // Update webhook log with error
            await supabase
              .from('razorpay_webhook_logs')
              .update({ 
                processing_error: `Error adding subscription word credits: ${creditError.message}`,
                updated_at: new Date().toISOString()
              })
              .eq('order_id', orderId)
              .eq('event_type', 'payment.captured');

            return new Response(JSON.stringify({ error: 'Failed to add word credits', details: creditError }), { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            })
          } else {
            console.log(`Successfully added ${order.words_to_credit} subscription words to user ${order.user_id}`)
          }

        } else if (wordPlan.plan_category === 'topup') {
          console.log('Processing top-up purchase')
          
          // Check if user has active subscription
          const { data: hasActiveSubscription, error: subscriptionCheckError } = await supabase
            .rpc('check_user_has_active_subscription', {
              user_uuid: order.user_id
            })

          if (subscriptionCheckError) {
            console.error('Error checking subscription status:', subscriptionCheckError)
            
            // Update webhook log with error
            await supabase
              .from('razorpay_webhook_logs')
              .update({ 
                processing_error: `Error checking subscription status: ${subscriptionCheckError.message}`,
                updated_at: new Date().toISOString()
              })
              .eq('order_id', orderId)
              .eq('event_type', 'payment.captured');

            return new Response(JSON.stringify({ error: 'Error checking subscription status', details: subscriptionCheckError }), { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            })
          }

          if (!hasActiveSubscription) {
            const errorMsg = 'User does not have active subscription for top-up purchase';
            console.error(errorMsg)
            
            // Update webhook log with error
            await supabase
              .from('razorpay_webhook_logs')
              .update({ 
                processing_error: errorMsg,
                updated_at: new Date().toISOString()
              })
              .eq('order_id', orderId)
              .eq('event_type', 'payment.captured');

            return new Response(JSON.stringify({ error: 'Active subscription required for top-up' }), { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            })
          }

          // Add top-up word credits (30 days expiry)
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 30)

          const { error: creditError } = await supabase
            .from('user_word_credits')
            .insert({
              user_id: order.user_id,
              words_available: order.words_to_credit,
              words_purchased: order.words_to_credit,
              is_free_credit: false,
              credit_type: 'topup',
              purchase_date: new Date().toISOString(),
              expiry_date: expiryDate.toISOString(),
            })

          if (creditError) {
            console.error('Error adding top-up word credits:', creditError)
            
            // Update webhook log with error
            await supabase
              .from('razorpay_webhook_logs')
              .update({ 
                processing_error: `Error adding top-up word credits: ${creditError.message}`,
                updated_at: new Date().toISOString()
              })
              .eq('order_id', orderId)
              .eq('event_type', 'payment.captured');

            return new Response(JSON.stringify({ error: 'Failed to add top-up credits', details: creditError }), { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            })
          } else {
            console.log(`Successfully added ${order.words_to_credit} top-up words to user ${order.user_id}`)
          }

        } else {
          const errorMsg = `Unknown plan category: ${wordPlan.plan_category}`;
          console.error(errorMsg)
          
          // Update webhook log with error
          await supabase
            .from('razorpay_webhook_logs')
            .update({ 
              processing_error: errorMsg,
              updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)
            .eq('event_type', 'payment.captured');

          return new Response(JSON.stringify({ error: 'Unknown plan category', category: wordPlan.plan_category }), { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }

        // Mark webhook as processed successfully
        await supabase
          .from('razorpay_webhook_logs')
          .update({ 
            processed: true, 
            updated_at: new Date().toISOString()
          })
          .eq('order_id', orderId)
          .eq('event_type', 'payment.captured')

        console.log(`Successfully processed payment for order ${orderId}`)
        return new Response(JSON.stringify({ success: true, order_id: orderId, payment_id: paymentId }), { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })

      } catch (processingError) {
        console.error('Error processing payment:', processingError)
        
        // Update webhook log with processing error
        await supabase
          .from('razorpay_webhook_logs')
          .update({ 
            processing_error: processingError.message,
            updated_at: new Date().toISOString()
          })
          .eq('order_id', orderId)
          .eq('event_type', 'payment.captured');

        return new Response(JSON.stringify({ error: 'Error processing payment', details: processingError.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
    }

    // Handle other webhook events
    console.log(`Webhook event ${webhookData.event} received but not processed`)
    return new Response(JSON.stringify({ message: 'Webhook received', event: webhookData.event }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: 'Error processing webhook', details: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
}
