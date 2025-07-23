
import { supabase } from "@/integrations/supabase/client";

export interface WordReplacement {
  original: string;
  replacement: string;
  source?: string;
  id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  dictionary_type?: 'grammar' | 'style';
}

export interface DictionarySyncStatus {
  id: string;
  last_sync_at: string | null;
  sync_status: string | null;
  total_records: number | null;
  error_message: string | null;
  created_at: string | null;
  dictionary_type: 'grammar' | 'style';
}

export interface DictionaryTableData {
  entries: WordReplacement[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export class DictionaryService {
  private static instance: DictionaryService;
  private cachedGrammarDictionary: WordReplacement[] | null = null;
  private cachedStyleDictionary: WordReplacement[] | null = null;
  private grammarCacheTimestamp: number = 0;
  private styleCacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  /**
   * Get dictionary from database (supports both grammar and style types)
   * No fallback to static dictionary
   */
  async getDictionary(type: 'grammar' | 'style' = 'grammar'): Promise<WordReplacement[]> {
    try {
      // Check if we have valid cached data
      const now = Date.now();
      const cachedData = type === 'grammar' ? this.cachedGrammarDictionary : this.cachedStyleDictionary;
      const cacheTimestamp = type === 'grammar' ? this.grammarCacheTimestamp : this.styleCacheTimestamp;
      
      if (cachedData && (now - cacheTimestamp) < this.CACHE_DURATION) {
        console.log(`Using cached ${type} dictionary with ${cachedData.length} entries`);
        return cachedData;
      }

      // Get dictionary from database by type
      const dbDictionary = await this.getDictionaryFromDB(type);
      
      if (dbDictionary.length > 0) {
        console.log(`Loaded ${dbDictionary.length} ${type} dictionary entries from database`);
        
        // Update appropriate cache
        if (type === 'grammar') {
          this.cachedGrammarDictionary = dbDictionary;
          this.grammarCacheTimestamp = now;
        } else {
          this.cachedStyleDictionary = dbDictionary;
          this.styleCacheTimestamp = now;
        }
        
        return dbDictionary;
      }

      // If no database entries, return empty array (no fallback)
      console.warn(`No ${type} dictionary entries found in database. Dictionary will be empty until sync is performed.`);
      return [];
      
    } catch (error) {
      console.error(`Error loading ${type} dictionary from database:`, error);
      // Return empty array instead of fallback
      return [];
    }
  }

  /**
   * Get grammar dictionary specifically
   */
  async getGrammarDictionary(): Promise<WordReplacement[]> {
    return this.getDictionary('grammar');
  }

  /**
   * Get style dictionary specifically
   */
  async getStyleDictionary(): Promise<WordReplacement[]> {
    return this.getDictionary('style');
  }

  /**
   * Get paginated dictionary entries for table display
   */
  async getDictionaryTableData(
    page: number = 1, 
    pageSize: number = 50, 
    searchTerm: string = '',
    type: 'grammar' | 'style' = 'grammar'
  ): Promise<DictionaryTableData> {
    try {
      let query = supabase
        .from('word_dictionary')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .eq('dictionary_type', type);

      // Add search filter if provided
      if (searchTerm) {
        query = query.or(`original.ilike.%${searchTerm}%,replacement.ilike.%${searchTerm}%`);
      }

      // Add pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data: dbEntries, error, count } = await query;

      if (error) {
        console.error('Error fetching dictionary table data:', error);
        // Return empty data instead of fallback
        return {
          entries: [],
          totalCount: 0,
          page,
          pageSize
        };
      }

      // Return database entries or empty array
      return {
        entries: (dbEntries || []).map(entry => ({ 
          ...entry, 
          source: 'google_sheets',
          dictionary_type: entry.dictionary_type as 'grammar' | 'style'
        })),
        totalCount: count || 0,
        page,
        pageSize
      };

    } catch (error) {
      console.error('Error in getDictionaryTableData:', error);
      // Return empty data instead of fallback
      return {
        entries: [],
        totalCount: 0,
        page,
        pageSize
      };
    }
  }

  /**
   * Get dictionary from database (Google Sheets cache)
   */
  private async getDictionaryFromDB(type: 'grammar' | 'style' = 'grammar'): Promise<WordReplacement[]> {
    const { data, error } = await supabase
      .from('word_dictionary')
      .select('*')
      .eq('is_active', true)
      .eq('dictionary_type', type)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`Error fetching ${type} dictionary from database:`, error);
      throw error;
    }

    return (data || []).map(entry => ({
      ...entry,
      dictionary_type: entry.dictionary_type as 'grammar' | 'style'
    }));
  }

  /**
   * Trigger manual sync from Google Sheets
   */
  async syncFromGoogleSheets(
    sheetId?: string, 
    type: 'grammar' | 'style' = 'grammar'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('sync-dictionary', {
        body: { sheetId, dictionaryType: type }
      });

      if (error) {
        throw error;
      }

      // Clear appropriate cache to force reload
      if (type === 'grammar') {
        this.cachedGrammarDictionary = null;
        this.grammarCacheTimestamp = 0;
      } else {
        this.cachedStyleDictionary = null;
        this.styleCacheTimestamp = 0;
      }

      return data;
    } catch (error) {
      console.error(`Error syncing ${type} dictionary:`, error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred during sync'
      };
    }
  }

  /**
   * Get sync status information
   */
  async getSyncStatus(type: 'grammar' | 'style' = 'grammar'): Promise<DictionarySyncStatus | null> {
    try {
      const { data, error } = await supabase
        .from('dictionary_sync_status')
        .select('*')
        .eq('dictionary_type', type)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error(`Error fetching ${type} sync status:`, error);
        return null;
      }

      return data ? {
        ...data,
        dictionary_type: data.dictionary_type as 'grammar' | 'style'
      } : null;
    } catch (error) {
      console.error(`Error getting ${type} sync status:`, error);
      return null;
    }
  }

  /**
   * Get dictionary statistics
   */
  async getDictionaryStats(type: 'grammar' | 'style' = 'grammar'): Promise<{
    totalEntries: number;
    databaseEntries: number;
    staticEntries: number;
    lastSync: string | null;
  }> {
    try {
      const currentDictionary = await this.getDictionary(type);
      const syncStatus = await this.getSyncStatus(type);

      return {
        totalEntries: currentDictionary.length,
        databaseEntries: currentDictionary.length,
        staticEntries: 0, // No more static entries
        lastSync: syncStatus?.last_sync_at || null
      };
    } catch (error) {
      console.error(`Error getting ${type} dictionary stats:`, error);
      return {
        totalEntries: 0,
        databaseEntries: 0,
        staticEntries: 0,
        lastSync: null
      };
    }
  }

  /**
   * Export dictionary data
   */
  async exportDictionary(
    format: 'csv' | 'json' = 'csv', 
    type: 'grammar' | 'style' = 'grammar'
  ): Promise<string> {
    try {
      const allEntries = await this.getDictionary(type);
      
      if (format === 'json') {
        return JSON.stringify(allEntries, null, 2);
      }
      
      // CSV format
      const headers = ['Original', 'Replacement', 'Type', 'Source'];
      const csvRows = [
        headers.join(','),
        ...allEntries.map(entry => [
          `"${entry.original}"`,
          `"${entry.replacement}"`,
          `"${type}"`,
          `"${entry.source || 'google_sheets'}"`
        ].join(','))
      ];
      
      return csvRows.join('\n');
    } catch (error) {
      console.error(`Error exporting ${type} dictionary:`, error);
      throw new Error(`Failed to export ${type} dictionary`);
    }
  }

  /**
   * Clear dictionary cache
   */
  clearCache(type?: 'grammar' | 'style'): void {
    if (!type || type === 'grammar') {
      this.cachedGrammarDictionary = null;
      this.grammarCacheTimestamp = 0;
    }
    if (!type || type === 'style') {
      this.cachedStyleDictionary = null;
      this.styleCacheTimestamp = 0;
    }
  }
}

// Export singleton instance
export const dictionaryService = DictionaryService.getInstance();
