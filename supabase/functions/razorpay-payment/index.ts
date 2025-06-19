
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './types.ts'
import { handleCreateOrder } from './order-handler.ts'
import { handleWebhook } from './webhook-handler.ts'
import { handleManualProcess } from './manual-process.ts'
import { handleCreateSubscription, handleSubscriptionWebhook } from './subscription-handler.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    console.log('Razorpay function called with path:', path, 'method:', req.method)
    console.log('Full URL:', req.url)
    console.log('Pathname:', url.pathname)

    // Check if this is a subscription request by examining the request body
    let isSubscriptionRequest = false
    if (req.method === 'POST') {
      try {
        const bodyText = await req.text()
        const body = JSON.parse(bodyText)
        
        // Check if this looks like a subscription request
        isSubscriptionRequest = body && (
          body.word_plan_id || 
          body.customer_name || 
          body.customer_email ||
          body.customer_phone
        )
        
        console.log('Request body contains subscription data:', isSubscriptionRequest)
        
        // Recreate the request with the body
        req = new Request(req.url, {
          method: req.method,
          headers: req.headers,
          body: bodyText
        })
      } catch (error) {
        console.error('Error parsing request body:', error)
      }
    }

    switch (path) {
      case 'create-order':
        return await handleCreateOrder(req, supabase)
      case 'create-subscription':
        return await handleCreateSubscription(req, supabase)
      case 'webhook':
        return await handleWebhook(req, supabase)
      case 'subscription-webhook':
        return await handleSubscriptionWebhook(req, supabase)
      case 'manual-process':
        return await handleManualProcess(req, supabase)
      case 'razorpay-payment':
        // This is the base function name - determine what to do based on request
        if (req.method === 'POST' && isSubscriptionRequest) {
          console.log('Routing base path POST request to subscription handler')
          return await handleCreateSubscription(req, supabase)
        } else if (req.method === 'POST') {
          console.log('Routing base path POST request to order handler')
          return await handleCreateOrder(req, supabase)
        } else {
          return new Response(
            JSON.stringify({ 
              error: 'Method not allowed for base endpoint',
              available_endpoints: [
                'create-order',
                'create-subscription', 
                'webhook',
                'subscription-webhook',
                'manual-process'
              ]
            }),
            { 
              status: 405, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      default:
        console.log('Unknown path requested:', path)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid endpoint',
            requested_path: path,
            available_endpoints: [
              'create-order',
              'create-subscription', 
              'webhook',
              'subscription-webhook',
              'manual-process'
            ]
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    console.error('Error in razorpay-payment function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
