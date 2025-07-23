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

const handler = async (req: Request): Promise<Response> => {
  console.log('Send bulk welcome emails function called');

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
    // Get all users who haven't received welcome email yet
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, welcome_email_sent_at')
      .is('welcome_email_sent_at', null);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profiles' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${profiles.length} users without welcome emails`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Send welcome email to each user
    for (const profile of profiles) {
      try {
        console.log(`Sending welcome email to: ${profile.email}`);
        
        const welcomeEmailResponse = await supabase.functions.invoke('send-welcome-email', {
          body: {
            userId: profile.id,
            userEmail: profile.email,
            userName: profile.name || profile.email?.split('@')[0] || 'व्याकरणी यूज़र',
          },
        });

        if (welcomeEmailResponse.error) {
          console.error(`Error sending to ${profile.email}:`, welcomeEmailResponse.error);
          errorCount++;
          results.push({
            email: profile.email,
            status: 'failed',
            error: welcomeEmailResponse.error
          });
        } else {
          console.log(`Welcome email sent successfully to: ${profile.email}`);
          successCount++;
          results.push({
            email: profile.email,
            status: 'sent',
            emailId: welcomeEmailResponse.data?.emailId
          });
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Failed to send to ${profile.email}:`, error);
        errorCount++;
        results.push({
          email: profile.email,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log(`Bulk email sending completed. Success: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalUsers: profiles.length,
          successCount,
          errorCount
        },
        results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-bulk-welcome-emails function:", error);
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