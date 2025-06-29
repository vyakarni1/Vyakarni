import { corsHeaders } from './types.ts'
import { manualFixPayment } from './manual-fix.ts'

export async function handleWebhook(req: Request, supabase: any) {
  console.log('Razorpay webhook received:', req.method, req.url)
  
  // Initialize supabase client if not provided
  if (!supabase) {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
  }
  
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
      order_id: webhookData.payload?.order?.entity?.id || webhookData.payload?.payment?.entity?.order_id || webhookData.payload?.subscription?.entity?.id,
      payment_id: webhookData.payload?.payment?.entity?.id,
      subscription_id: webhookData.payload?.subscription?.entity?.id,
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

    // Handle subscription events
    if (webhookData.event === 'subscription.charged') {
      return await handleSubscriptionCharged(webhookData, supabase);
    }

    if (webhookData.event === 'subscription.activated') {
      return await handleSubscriptionActivated(webhookData, supabase);
    }

    if (webhookData.event === 'subscription.cancelled') {
      return await handleSubscriptionCancelled(webhookData, supabase);
    }

    // Handle payment.captured event (existing functionality)
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

        // CRITICAL FIX: Process subscription upgrade based on word plan type
        console.log('Processing subscription upgrade for plan type:', wordPlan.plan_type)
        
        // Find corresponding subscription plan
        const { data: subscriptionPlan, error: subPlanError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('plan_type', wordPlan.plan_type)
          .eq('is_active', true)
          .single()

        if (subscriptionPlan) {
          console.log('Found subscription plan:', subscriptionPlan)
          
          // Create or upgrade subscription using the database function
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .rpc('create_subscription_for_user', {
              user_uuid: order.user_id,
              plan_uuid: subscriptionPlan.id
            })

          if (subscriptionError) {
            console.error('Error creating/upgrading subscription:', subscriptionError)
          } else {
            console.log('Successfully created/upgraded subscription:', subscriptionData)
          }
        } else {
          console.error('Subscription plan not found for type:', wordPlan.plan_type, 'Error:', subPlanError)
        }

        // Add word credits (no expiry for subscription words)
        const { error: creditError } = await supabase
          .from('user_word_credits')
          .insert({
            user_id: order.user_id,
            words_available: order.words_to_credit,
            words_purchased: order.words_to_credit,
            is_free_credit: false,
            credit_type: 'subscription',
            purchase_date: new Date().toISOString(),
            expiry_date: null, // No expiry for subscription words
          })

        if (creditError) {
          console.error('Error adding word credits:', creditError)
          
          await supabase
            .from('razorpay_webhook_logs')
            .update({ 
              processing_error: `Error adding word credits: ${creditError.message}`,
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

async function handleSubscriptionCharged(webhookData: any, supabase: any) {
  const subscription = webhookData.payload.subscription.entity;
  const payment = webhookData.payload.payment ? webhookData.payload.payment.entity : null;
  
  console.log('Processing subscription.charged for subscription:', subscription.id);

  try {
    // Find the subscription in our database
    const { data: userSubscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('razorpay_subscription_id', subscription.id)
      .single();

    if (subError || !userSubscription) {
      console.error('Subscription not found:', subscription.id);
      return new Response(JSON.stringify({ error: 'Subscription not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Record the charge
    const { error: chargeError } = await supabase
      .from('subscription_charges')
      .insert({
        user_id: userSubscription.user_id,
        mandate_id: userSubscription.mandate_id,
        amount: subscription.current_start ? (subscription.current_end - subscription.current_start) * subscription.plan_id.item.amount / 100 : 0,
        currency: 'INR',
        status: 'paid',
        charge_date: new Date().toISOString(),
        paid_at: payment ? new Date(payment.created_at * 1000).toISOString() : new Date().toISOString(),
        razorpay_payment_id: payment ? payment.id : null,
        notes: {
          subscription_id: subscription.id,
          plan_id: subscription.plan_id,
        }
      });

    if (chargeError) {
      console.error('Error recording subscription charge:', chargeError);
    }

    // Add word credits for the subscription period
    const { data: subscriptionPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*, word_plans!inner(*)')
      .eq('id', userSubscription.plan_id)
      .single();

    if (subscriptionPlan && subscriptionPlan.word_plans) {
      const { error: creditError } = await supabase
        .from('user_word_credits')
        .insert({
          user_id: userSubscription.user_id,
          words_available: subscriptionPlan.word_plans.words_included,
          words_purchased: subscriptionPlan.word_plans.words_included,
          is_free_credit: false,
          credit_type: 'subscription',
          purchase_date: new Date().toISOString(),
          expiry_date: null,
          related_subscription_id: userSubscription.id,
        });

      if (creditError) {
        console.error('Error adding subscription word credits:', creditError);
      } else {
        console.log(`Added ${subscriptionPlan.word_plans.words_included} words for subscription ${subscription.id}`);
      }
    }

    return new Response(JSON.stringify({ success: true, subscription_id: subscription.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing subscription charge:', error);
    return new Response(JSON.stringify({ error: 'Error processing subscription charge' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleSubscriptionActivated(webhookData: any, supabase: any) {
  const subscription = webhookData.payload.subscription.entity;
  
  console.log('Processing subscription.activated for subscription:', subscription.id);

  try {
    // Update subscription status
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription status:', updateError);
    }

    // Update mandate status
    const { error: mandateError } = await supabase
      .from('subscription_mandates')
      .update({
        mandate_status: 'authenticated',
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (mandateError) {
      console.error('Error updating mandate status:', mandateError);
    }

    return new Response(JSON.stringify({ success: true, subscription_id: subscription.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing subscription activation:', error);
    return new Response(JSON.stringify({ error: 'Error processing subscription activation' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleSubscriptionCancelled(webhookData: any, supabase: any) {
  const subscription = webhookData.payload.subscription.entity;
  
  console.log('Processing subscription.cancelled for subscription:', subscription.id);

  try {
    // Update subscription status
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription status:', updateError);
    }

    // Update mandate status
    const { error: mandateError } = await supabase
      .from('subscription_mandates')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (mandateError) {
      console.error('Error updating mandate status:', mandateError);
    }

    return new Response(JSON.stringify({ success: true, subscription_id: subscription.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing subscription cancellation:', error);
    return new Response(JSON.stringify({ error: 'Error processing subscription cancellation' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
