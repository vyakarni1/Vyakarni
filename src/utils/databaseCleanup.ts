
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
    const sizeInfo: Record<string, number> = {};
    
    // Get count for each table individually to avoid TypeScript issues
    const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: creditsCount } = await supabase.from('user_word_credits').select('*', { count: 'exact', head: true });
    const { count: subscriptionsCount } = await supabase.from('user_subscriptions').select('*', { count: 'exact', head: true });
    const { count: usageCount } = await supabase.from('word_usage_history').select('*', { count: 'exact', head: true });
    const { count: webhookCount } = await supabase.from('razorpay_webhook_logs').select('*', { count: 'exact', head: true });
    const { count: syncCount } = await supabase.from('dictionary_sync_status').select('*', { count: 'exact', head: true });
    const { count: cacheCount } = await supabase.from('analytics_cache').select('*', { count: 'exact', head: true });
    const { count: tokenCount } = await supabase.from('password_reset_tokens').select('*', { count: 'exact', head: true });
    
    sizeInfo['profiles'] = profilesCount || 0;
    sizeInfo['user_word_credits'] = creditsCount || 0;
    sizeInfo['user_subscriptions'] = subscriptionsCount || 0;
    sizeInfo['word_usage_history'] = usageCount || 0;
    sizeInfo['razorpay_webhook_logs'] = webhookCount || 0;
    sizeInfo['dictionary_sync_status'] = syncCount || 0;
    sizeInfo['analytics_cache'] = cacheCount || 0;
    sizeInfo['password_reset_tokens'] = tokenCount || 0;
    
    return { success: true, sizes: sizeInfo };
  } catch (error) {
    console.error('Error getting database size info:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
