
import { corsHeaders } from './types.ts'

// Function to verify Razorpay webhook signature
async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  if (!signature || !secret) {
    return false;
  }
  
  try {
    const crypto = globalThis.crypto;
    const encoder = new TextEncoder();
    const key = encoder.encode(secret);
    const data = encoder.encode(body);
    
    // Create HMAC-SHA256 hash
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature_buffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const hash = Array.from(new Uint8Array(signature_buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const expectedSignature = `sha256=${hash}`;
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Function to manually process a failed payment
async function processFailedPayment(supabase: any, orderId: string) {
  console.log('Manually processing failed payment for order:', orderId);
  
  try {
    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('razorpay_orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderId, orderError);
      return false;
    }

    console.log('Found order:', order);

    // Update order status to PAID
    const { error: updateError } = await supabase
      .from('razorpay_orders')
      .update({ 
        order_status: 'PAID',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return false;
    }

    // Get the word plan
    const { data: wordPlan, error: planError } = await supabase
      .from('word_plans')
      .select('*')
      .eq('id', order.word_plan_id)
      .single();

    if (planError) {
      console.error('Error fetching word plan:', planError);
      return false;
    }

    console.log('Processing payment for plan:', wordPlan);

    // Create payment transaction record
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: order.user_id,
        amount: order.order_amount,
        status: 'completed',
        payment_gateway: 'razorpay',
        razorpay_order_id: orderId,
        razorpay_payment_id: 'pay_Qh7zV9MIAQGmVK', // From the webhook logs
        currency: 'INR',
      });

    if (transactionError) {
      console.error('Error creating payment transaction:', transactionError);
    }

    if (wordPlan.plan_category === 'subscription') {
      // Handle subscription purchase
      console.log('Processing subscription purchase');
      
      // Create subscription using the database function
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .rpc('create_subscription_for_user', {
          user_uuid: order.user_id,
          plan_uuid: order.word_plan_id
        });

      if (subscriptionError || !subscriptionData?.success) {
        console.error('Error creating subscription:', subscriptionError, subscriptionData);
        // Continue to add word credits even if subscription creation fails
      } else {
        console.log('Successfully created subscription:', subscriptionData);
      }

      // Add subscription word credits (no expiry for subscription words)
      // For basic subscription plan, add 10,000 words as per typical subscription
      const wordsToAdd = wordPlan.words_included || 10000;
      
      const { error: creditError } = await supabase
        .from('user_word_credits')
        .insert({
          user_id: order.user_id,
          words_available: wordsToAdd,
          words_purchased: wordsToAdd,
          is_free_credit: false,
          credit_type: 'subscription',
          purchase_date: new Date().toISOString(),
          expiry_date: null, // Subscription words don't expire
        });

      if (creditError) {
        console.error('Error adding subscription word credits:', creditError);
        return false;
      } else {
        console.log(`Successfully added ${wordsToAdd} subscription words to user ${order.user_id}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error processing failed payment:', error);
    return false;
  }
}

export async function handleWebhook(req: Request, supabase: any) {
  console.log('Razorpay webhook received:', req.method, req.url)
  
  // Handle test requests
  if (req.method === 'GET') {
    console.log('GET request to webhook - returning OK for testing')
    return new Response('OK', { status: 200, headers: corsHeaders })
  }

  try {
    const bodyText = await req.text()
    const webhookData = JSON.parse(bodyText)
    console.log('Received Razorpay webhook:', webhookData)

    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    if (webhookSecret && signature) {
      const isValidSignature = await verifyWebhookSignature(bodyText, signature, webhookSecret)
      if (!isValidSignature) {
        console.error('Invalid webhook signature')
        return new Response('Invalid signature', { status: 401, headers: corsHeaders })
      }
      console.log('Webhook signature verified successfully')
    } else {
      console.warn('Webhook signature verification skipped - missing secret or signature')
    }
    
    // Log webhook for debugging
    await supabase
      .from('razorpay_webhook_logs')
      .insert({
        event_type: webhookData.event || 'unknown',
        order_id: webhookData.payload?.order?.entity?.id || webhookData.payload?.payment?.entity?.order_id,
        payment_id: webhookData.payload?.payment?.entity?.id,
        webhook_data: webhookData,
        signature: signature,
      })

    // Handle payment.captured event
    if (webhookData.event === 'payment.captured') {
      const payment = webhookData.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id

      console.log('Processing payment.captured for order:', orderId, 'payment:', paymentId)

      // Get order from database
      const { data: order, error: orderError } = await supabase
        .from('razorpay_orders')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (orderError || !order) {
        console.error('Order not found:', orderId, orderError)
        return new Response('Order not found', { status: 404, headers: corsHeaders })
      }

      // Update order status
      const { error: updateError } = await supabase
        .from('razorpay_orders')
        .update({ 
          order_status: 'PAID',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return new Response('Error updating order', { status: 500, headers: corsHeaders })
      }

      // Get the word plan
      const { data: wordPlan, error: planError } = await supabase
        .from('word_plans')
        .select('*')
        .eq('id', order.word_plan_id)
        .single()

      if (planError) {
        console.error('Error fetching word plan:', planError)
        return new Response('Error fetching word plan', { status: 500, headers: corsHeaders })
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

      try {
        if (wordPlan.plan_category === 'subscription') {
          // Handle subscription purchase
          console.log('Processing subscription purchase')
          
          // Create subscription using the database function
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .rpc('create_subscription_for_user', {
              user_uuid: order.user_id,
              plan_uuid: order.word_plan_id
            })

          if (subscriptionError || !subscriptionData?.success) {
            console.error('Error creating subscription:', subscriptionError, subscriptionData)
            // Continue to add word credits even if subscription creation fails
          } else {
            console.log('Successfully created subscription:', subscriptionData)
          }

          // Add subscription word credits (no expiry for subscription words)
          // For basic subscription, add 10,000 words as standard
          const wordsToAdd = order.words_to_credit || 10000;
          
          const { error: creditError } = await supabase
            .from('user_word_credits')
            .insert({
              user_id: order.user_id,
              words_available: wordsToAdd,
              words_purchased: wordsToAdd,
              is_free_credit: false,
              credit_type: 'subscription',
              purchase_date: new Date().toISOString(),
              expiry_date: null, // Subscription words don't expire
            })

          if (creditError) {
            console.error('Error adding subscription word credits:', creditError)
          } else {
            console.log(`Successfully added ${wordsToAdd} subscription words to user ${order.user_id}`)
          }

        } else if (wordPlan.plan_category === 'topup') {
          // Handle top-up purchase
          console.log('Processing top-up purchase')
          
          // Check if user has active subscription
          const { data: hasActiveSubscription, error: subscriptionCheckError } = await supabase
            .rpc('check_user_has_active_subscription', {
              user_uuid: order.user_id
            })

          if (subscriptionCheckError) {
            console.error('Error checking subscription status:', subscriptionCheckError)
            return new Response('Error checking subscription status', { status: 500, headers: corsHeaders })
          }

          if (!hasActiveSubscription) {
            console.error('User does not have active subscription for top-up purchase')
            return new Response('Active subscription required for top-up', { status: 400, headers: corsHeaders })
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
          } else {
            console.log(`Successfully added ${order.words_to_credit} top-up words to user ${order.user_id}`)
          }

        } else {
          console.error('Unknown plan category:', wordPlan.plan_category)
          return new Response('Unknown plan category', { status: 400, headers: corsHeaders })
        }

        // Mark webhook as processed
        await supabase
          .from('razorpay_webhook_logs')
          .update({ processed: true })
          .eq('order_id', orderId)

      } catch (error) {
        console.error('Error processing payment:', error)
        return new Response('Error processing payment', { status: 500, headers: corsHeaders })
      }
    }

    // Manual processing for failed order (specific case)
    if (req.url.includes('manual-process')) {
      const success = await processFailedPayment(supabase, 'order_Qh7xtuignamMB6')
      if (success) {
        console.log('Successfully processed failed payment manually')
        return new Response('Payment processed successfully', { status: 200, headers: corsHeaders })
      } else {
        return new Response('Failed to process payment', { status: 500, headers: corsHeaders })
      }
    }

    return new Response('OK', { status: 200, headers: corsHeaders })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Error processing webhook', { status: 500, headers: corsHeaders })
  }
}
