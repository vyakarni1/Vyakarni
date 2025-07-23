import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import WelcomeEmail from './_templates/welcome-email.tsx';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface WelcomeEmailRequest {
  userId: string;
  userEmail: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Welcome email function called');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, userEmail, userName }: WelcomeEmailRequest = await req.json();
    console.log('Processing welcome email for:', { userId, userEmail, userName });

    // Check if welcome email was already sent
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('welcome_email_sent_at')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (profile?.welcome_email_sent_at) {
      console.log('Welcome email already sent to user:', userId);
      return new Response(
        JSON.stringify({ message: 'Welcome email already sent' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Render the email template
    const emailHtml = await renderAsync(
      React.createElement(WelcomeEmail, {
        userName: userName || 'व्याकरणी यूज़र',
        userEmail: userEmail,
      })
    );

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: "व्याकरणी <welcome@vyakarni.com>",
      to: [userEmail],
      subject: "व्याकरणी में आपका स्वागत है! 🎉",
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    // Log email in database
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: 'welcome',
        recipient_email: userEmail,
        subject: 'व्याकरणी में आपका स्वागत है! 🎉',
        status: emailResponse.error ? 'failed' : 'sent',
        resend_id: emailResponse.data?.id,
        error_message: emailResponse.error?.message,
      });

    if (logError) {
      console.error('Error logging email:', logError);
    }

    // Update profile to mark welcome email as sent
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    }

    if (emailResponse.error) {
      console.error('Error sending email:', emailResponse.error);
      return new Response(
        JSON.stringify({ error: emailResponse.error }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    
    // Log failed email attempt
    try {
      const { userId, userEmail }: WelcomeEmailRequest = await req.json();
      await supabase
        .from('email_logs')
        .insert({
          user_id: userId,
          email_type: 'welcome',
          recipient_email: userEmail,
          subject: 'व्याकरणी में आपका स्वागत है! 🎉',
          status: 'failed',
          error_message: error.message,
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

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