
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
  console.log('Database cleanup function called');

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
    const results = {
      passwordResetTokens: { success: false, itemsRemoved: 0, error: null },
      dictionarySyncLogs: { success: false, itemsRemoved: 0, error: null },
      webhookLogs: { success: false, itemsRemoved: 0, error: null },
      analyticsCache: { success: false, itemsRemoved: 0, error: null },
      totalItemsRemoved: 0,
      totalSuccess: false
    };

    // 1. Clean expired password reset tokens
    try {
      console.log('Cleaning expired password reset tokens...');
      const { error } = await supabase.rpc('cleanup_expired_reset_tokens');
      
      if (error) {
        results.passwordResetTokens.error = error.message;
        console.error('Error cleaning password reset tokens:', error);
      } else {
        results.passwordResetTokens.success = true;
        console.log('Password reset tokens cleaned successfully');
      }
    } catch (error) {
      results.passwordResetTokens.error = error.message;
      console.error('Exception cleaning password reset tokens:', error);
    }

    // 2. Clean old dictionary sync logs (older than 30 days)
    try {
      console.log('Cleaning old dictionary sync logs...');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // Get count first
      const { data: countData, error: countError } = await supabase
        .from('dictionary_sync_status')
        .select('id', { count: 'exact' })
        .lt('created_at', thirtyDaysAgo);
      
      if (countError) {
        results.dictionarySyncLogs.error = countError.message;
        console.error('Error counting sync logs:', countError);
      } else {
        const itemCount = countData?.length || 0;
        
        if (itemCount > 0) {
          // Delete old logs
          const { error: deleteError } = await supabase
            .from('dictionary_sync_status')
            .delete()
            .lt('created_at', thirtyDaysAgo);
          
          if (deleteError) {
            results.dictionarySyncLogs.error = deleteError.message;
            console.error('Error deleting sync logs:', deleteError);
          } else {
            results.dictionarySyncLogs.success = true;
            results.dictionarySyncLogs.itemsRemoved = itemCount;
            console.log(`Cleaned up ${itemCount} dictionary sync logs`);
          }
        } else {
          results.dictionarySyncLogs.success = true;
          console.log('No old dictionary sync logs to clean');
        }
      }
    } catch (error) {
      results.dictionarySyncLogs.error = error.message;
      console.error('Exception cleaning dictionary sync logs:', error);
    }

    // 3. Clean processed webhook logs (older than 30 days)
    try {
      console.log('Cleaning old processed webhook logs...');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // Get count first
      const { data: countData, error: countError } = await supabase
        .from('razorpay_webhook_logs')
        .select('id', { count: 'exact' })
        .eq('processed', true)
        .lt('created_at', thirtyDaysAgo);
      
      if (countError) {
        results.webhookLogs.error = countError.message;
        console.error('Error counting webhook logs:', countError);
      } else {
        const itemCount = countData?.length || 0;
        
        if (itemCount > 0) {
          // Delete old processed logs
          const { error: deleteError } = await supabase
            .from('razorpay_webhook_logs')
            .delete()
            .eq('processed', true)
            .lt('created_at', thirtyDaysAgo);
          
          if (deleteError) {
            results.webhookLogs.error = deleteError.message;
            console.error('Error deleting webhook logs:', deleteError);
          } else {
            results.webhookLogs.success = true;
            results.webhookLogs.itemsRemoved = itemCount;
            console.log(`Cleaned up ${itemCount} processed webhook logs`);
          }
        } else {
          results.webhookLogs.success = true;
          console.log('No old webhook logs to clean');
        }
      }
    } catch (error) {
      results.webhookLogs.error = error.message;
      console.error('Exception cleaning webhook logs:', error);
    }

    // 4. Clean expired analytics cache
    try {
      console.log('Cleaning expired analytics cache...');
      const now = new Date().toISOString();
      
      // Get count first
      const { data: countData, error: countError } = await supabase
        .from('analytics_cache')
        .select('id', { count: 'exact' })
        .lt('expires_at', now);
      
      if (countError) {
        results.analyticsCache.error = countError.message;
        console.error('Error counting analytics cache:', countError);
      } else {
        const itemCount = countData?.length || 0;
        
        if (itemCount > 0) {
          // Delete expired cache
          const { error: deleteError } = await supabase
            .from('analytics_cache')
            .delete()
            .lt('expires_at', now);
          
          if (deleteError) {
            results.analyticsCache.error = deleteError.message;
            console.error('Error deleting analytics cache:', deleteError);
          } else {
            results.analyticsCache.success = true;
            results.analyticsCache.itemsRemoved = itemCount;
            console.log(`Cleaned up ${itemCount} expired analytics cache entries`);
          }
        } else {
          results.analyticsCache.success = true;
          console.log('No expired analytics cache to clean');
        }
      }
    } catch (error) {
      results.analyticsCache.error = error.message;
      console.error('Exception cleaning analytics cache:', error);
    }

    // Calculate totals
    results.totalItemsRemoved = 
      results.dictionarySyncLogs.itemsRemoved +
      results.webhookLogs.itemsRemoved +
      results.analyticsCache.itemsRemoved;
    
    results.totalSuccess = 
      results.passwordResetTokens.success &&
      results.dictionarySyncLogs.success &&
      results.webhookLogs.success &&
      results.analyticsCache.success;

    console.log('Database cleanup completed:', {
      totalItemsRemoved: results.totalItemsRemoved,
      success: results.totalSuccess
    });

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in database-cleanup function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
