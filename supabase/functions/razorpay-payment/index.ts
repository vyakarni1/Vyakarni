
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './types.ts'
import { handleCreateOrder } from './order-handler.ts'
import { handleWebhook } from './webhook-handler.ts'

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

    switch (path) {
      case 'create-order':
        return await handleCreateOrder(req, supabase)
      case 'webhook':
        return await handleWebhook(req, supabase)
      case 'manual-fix':
        // Handle manual payment processing for admin use
        if (req.method === 'POST') {
          return await handleWebhook(req, supabase)
        }
        return new Response(
          JSON.stringify({ error: 'Method not allowed for manual-fix' }),
          { 
            status: 405, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint', available: ['create-order', 'webhook', 'manual-fix'] }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    console.error('Error in razorpay-payment function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
