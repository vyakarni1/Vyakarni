import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface AuthWebhookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
  old_record?: any;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Auth webhook called');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const payload: AuthWebhookPayload = await req.json();
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    // Check if this is a user record update with email confirmation
    if (payload.type === 'UPDATE' && payload.table === 'users' && payload.schema === 'auth') {
      const user = payload.record;
      const oldUser = payload.old_record;

      console.log('User update detected:', {
        userId: user.id,
        email: user.email,
        emailConfirmedAt: user.email_confirmed_at,
        oldEmailConfirmedAt: oldUser?.email_confirmed_at
      });

      // Check if email was just confirmed (changed from null to a date)
      if (user.email_confirmed_at && !oldUser?.email_confirmed_at) {
        console.log('Email confirmation detected for user:', user.id);

        // Update profile with email verification timestamp
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ 
            email_verification_completed_at: new Date().toISOString() 
          })
          .eq('id', user.id);

        if (profileUpdateError) {
          console.error('Error updating profile:', profileUpdateError);
        }

        // Get user profile for name
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Call welcome email function
        try {
          const welcomeEmailResponse = await supabase.functions.invoke('send-welcome-email', {
            body: {
              userId: user.id,
              userEmail: user.email,
              userName: profile?.name || user.email?.split('@')[0] || 'व्याकरणी यूज़र',
            },
          });

          if (welcomeEmailResponse.error) {
            console.error('Error sending welcome email:', welcomeEmailResponse.error);
          } else {
            console.log('Welcome email sent successfully:', welcomeEmailResponse.data);
          }
        } catch (emailError) {
          console.error('Failed to invoke welcome email function:', emailError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in auth webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);