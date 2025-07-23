
import { supabase } from '@/integrations/supabase/client';

export interface CleanupResult {
  success: boolean;
  itemsRemoved: number;
  error?: string;
}

export interface CleanupSummary {
  passwordResetTokens: CleanupResult;
  dictionarySyncLogs: CleanupResult;
  webhookLogs: CleanupResult;
  analyticsCache: CleanupResult;
  totalItemsRemoved: number;
  totalSuccess: boolean;
}

/**
 * Clean expired password reset tokens
 */
export const cleanupExpiredTokens = async (): Promise<CleanupResult> => {
  try {
    console.log('Cleaning up expired password reset tokens...');
    
    // Call the existing database function
    const { error } = await supabase.rpc('cleanup_expired_reset_tokens');
    
    if (error) {
      console.error('Error cleaning password reset tokens:', error);
      return { success: false, itemsRemoved: 0, error: error.message };
    }
    
    return { success: true, itemsRemoved: 0 }; // Function doesn't return count
  } catch (error) {
    console.error('Exception cleaning password reset tokens:', error);
    return { 
      success: false, 
      itemsRemoved: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Clean old dictionary sync status logs (older than 30 days)
 */
export const cleanupOldDictionarySyncLogs = async (): Promise<CleanupResult> => {
  try {
    console.log('Cleaning up old dictionary sync logs...');
    
    // Get count first
    const { data: countData, error: countError } = await supabase
      .from('dictionary_sync_status')
      .select('id', { count: 'exact' })
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (countError) {
      console.error('Error counting sync logs:', countError);
      return { success: false, itemsRemoved: 0, error: countError.message };
    }
    
    const itemCount = countData?.length || 0;
    
    if (itemCount === 0) {
      return { success: true, itemsRemoved: 0 };
    }
    
    // Delete old logs
    const { error: deleteError } = await supabase
      .from('dictionary_sync_status')
      .delete()
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (deleteError) {
      console.error('Error deleting sync logs:', deleteError);
      return { success: false, itemsRemoved: 0, error: deleteError.message };
    }
    
    console.log(`Cleaned up ${itemCount} dictionary sync logs`);
    return { success: true, itemsRemoved: itemCount };
  } catch (error) {
    console.error('Exception cleaning dictionary sync logs:', error);
    return { 
      success: false, 
      itemsRemoved: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Clean processed webhook logs (older than 30 days)
 */
export const cleanupProcessedWebhookLogs = async (): Promise<CleanupResult> => {
  try {
    console.log('Cleaning up old processed webhook logs...');
    
    // Get count first
    const { data: countData, error: countError } = await supabase
      .from('razorpay_webhook_logs')
      .select('id', { count: 'exact' })
      .eq('processed', true)
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (countError) {
      console.error('Error counting webhook logs:', countError);
      return { success: false, itemsRemoved: 0, error: countError.message };
    }
    
    const itemCount = countData?.length || 0;
    
    if (itemCount === 0) {
      return { success: true, itemsRemoved: 0 };
    }
    
    // Delete old processed logs
    const { error: deleteError } = await supabase
      .from('razorpay_webhook_logs')
      .delete()
      .eq('processed', true)
      .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (deleteError) {
      console.error('Error deleting webhook logs:', deleteError);
      return { success: false, itemsRemoved: 0, error: deleteError.message };
    }
    
    console.log(`Cleaned up ${itemCount} processed webhook logs`);
    return { success: true, itemsRemoved: itemCount };
  } catch (error) {
    console.error('Exception cleaning webhook logs:', error);
    return { 
      success: false, 
      itemsRemoved: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Clean expired analytics cache
 */
export const cleanupExpiredAnalyticsCache = async (): Promise<CleanupResult> => {
  try {
    console.log('Cleaning up expired analytics cache...');
    
    // Get count first
    const { data: countData, error: countError } = await supabase
      .from('analytics_cache')
      .select('id', { count: 'exact' })
      .lt('expires_at', new Date().toISOString());
    
    if (countError) {
      console.error('Error counting analytics cache:', countError);
      return { success: false, itemsRemoved: 0, error: countError.message };
    }
    
    const itemCount = countData?.length || 0;
    
    if (itemCount === 0) {
      return { success: true, itemsRemoved: 0 };
    }
    
    // Delete expired cache
    const { error: deleteError } = await supabase
      .from('analytics_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (deleteError) {
      console.error('Error deleting analytics cache:', deleteError);
      return { success: false, itemsRemoved: 0, error: deleteError.message };
    }
    
    console.log(`Cleaned up ${itemCount} expired analytics cache entries`);
    return { success: true, itemsRemoved: itemCount };
  } catch (error) {
    console.error('Exception cleaning analytics cache:', error);
    return { 
      success: false, 
      itemsRemoved: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Run comprehensive database cleanup
 */
export const runDatabaseCleanup = async (): Promise<CleanupSummary> => {
  console.log('Starting comprehensive database cleanup...');
  
  const results: CleanupSummary = {
    passwordResetTokens: { success: false, itemsRemoved: 0 },
    dictionarySyncLogs: { success: false, itemsRemoved: 0 },
    webhookLogs: { success: false, itemsRemoved: 0 },
    analyticsCache: { success: false, itemsRemoved: 0 },
    totalItemsRemoved: 0,
    totalSuccess: false
  };
  
  // Run all cleanup operations
  results.passwordResetTokens = await cleanupExpiredTokens();
  results.dictionarySyncLogs = await cleanupOldDictionarySyncLogs();
  results.webhookLogs = await cleanupProcessedWebhookLogs();
  results.analyticsCache = await cleanupExpiredAnalyticsCache();
  
  // Calculate totals
  results.totalItemsRemoved = 
    results.passwordResetTokens.itemsRemoved +
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
  
  return results;
};

/**
 * Get database size information (for monitoring)
 */
export const getDatabaseSizeInfo = async () => {
  try {
    const tables = [
      'profiles',
      'user_word_credits',
      'user_subscriptions',
      'word_usage_history',
      'razorpay_webhook_logs',
      'dictionary_sync_status',
      'analytics_cache',
      'password_reset_tokens'
    ];
    
    const sizeInfo: Record<string, number> = {};
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id', { count: 'exact' });
      
      if (!error) {
        sizeInfo[table] = data?.length || 0;
      }
    }
    
    return { success: true, sizes: sizeInfo };
  } catch (error) {
    console.error('Error getting database size info:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
