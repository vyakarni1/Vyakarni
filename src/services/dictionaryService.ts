
import { supabase } from "@/integrations/supabase/client";
import { wordReplacements } from "@/data/wordReplacements";

export interface WordReplacement {
  original: string;
  replacement: string;
  source?: string;
  id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DictionarySyncStatus {
  id: string;
  last_sync_at: string | null;
  sync_status: string | null;
  total_records: number | null;
  error_message: string | null;
  created_at: string | null;
}

export interface DictionaryTableData {
  entries: WordReplacement[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export class DictionaryService {
  private static instance: DictionaryService;
  private cachedDictionary: WordReplacement[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  /**
   * Get dictionary with smart fallback strategy:
   * 1. Try database cache (Google Sheets)
   * 2. Fallback to static dictionary
   */
  async getDictionary(): Promise<WordReplacement[]> {
    try {
      // Check if we have valid cached data
      const now = Date.now();
      if (this.cachedDictionary && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        return this.cachedDictionary;
      }

      // Try to get dictionary from database
      const dbDictionary = await this.getDictionaryFromDB();
      
      if (dbDictionary.length > 0) {
        console.log(`Loaded ${dbDictionary.length} dictionary entries from database`);
        this.cachedDictionary = dbDictionary;
        this.cacheTimestamp = now;
        return dbDictionary;
      }

      // Fallback to static dictionary
      console.log('Falling back to static dictionary');
      return this.getStaticDictionary();
      
    } catch (error) {
      console.error('Error loading dictionary, falling back to static:', error);
      return this.getStaticDictionary();
    }
  }

  /**
   * Get paginated dictionary entries for table display
   */
  async getDictionaryTableData(
    page: number = 1, 
    pageSize: number = 50, 
    searchTerm: string = ''
  ): Promise<DictionaryTableData> {
    try {
      let query = supabase
        .from('word_dictionary')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

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
        // Fallback to static data
        const staticEntries = this.getStaticDictionary()
          .filter(entry => 
            !searchTerm || 
            entry.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.replacement.toLowerCase().includes(searchTerm.toLowerCase())
          );
        
        const paginatedStatic = staticEntries.slice(from, to + 1);
        return {
          entries: paginatedStatic.map(entry => ({ ...entry, source: 'static' })),
          totalCount: staticEntries.length,
          page,
          pageSize
        };
      }

      // If no database entries, return static data
      if (!dbEntries || dbEntries.length === 0) {
        const staticEntries = this.getStaticDictionary()
          .filter(entry => 
            !searchTerm || 
            entry.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.replacement.toLowerCase().includes(searchTerm.toLowerCase())
          );
        
        const paginatedStatic = staticEntries.slice(from, to + 1);
        return {
          entries: paginatedStatic.map(entry => ({ ...entry, source: 'static' })),
          totalCount: staticEntries.length,
          page,
          pageSize
        };
      }

      return {
        entries: dbEntries.map(entry => ({ ...entry, source: 'google_sheets' })),
        totalCount: count || 0,
        page,
        pageSize
      };

    } catch (error) {
      console.error('Error in getDictionaryTableData:', error);
      // Return static data as fallback
      const staticEntries = this.getStaticDictionary();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const paginatedStatic = staticEntries.slice(from, to + 1);
      
      return {
        entries: paginatedStatic.map(entry => ({ ...entry, source: 'static' })),
        totalCount: staticEntries.length,
        page,
        pageSize
      };
    }
  }

  /**
   * Get dictionary from database (Google Sheets cache)
   */
  private async getDictionaryFromDB(): Promise<WordReplacement[]> {
    const { data, error } = await supabase
      .from('word_dictionary')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching dictionary from database:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get static dictionary as fallback
   */
  private getStaticDictionary(): WordReplacement[] {
    return wordReplacements.map(entry => ({ ...entry, source: 'static' }));
  }

  /**
   * Trigger manual sync from Google Sheets
   */
  async syncFromGoogleSheets(sheetId?: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('sync-dictionary', {
        body: sheetId ? { sheetId } : {}
      });

      if (error) {
        throw error;
      }

      // Clear cache to force reload
      this.cachedDictionary = null;
      this.cacheTimestamp = 0;

      return data;
    } catch (error) {
      console.error('Error syncing dictionary:', error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred during sync'
      };
    }
  }

  /**
   * Get sync status information
   */
  async getSyncStatus(): Promise<DictionarySyncStatus | null> {
    try {
      const { data, error } = await supabase
        .from('dictionary_sync_status')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching sync status:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting sync status:', error);
      return null;
    }
  }

  /**
   * Get dictionary statistics
   */
  async getDictionaryStats(): Promise<{
    totalEntries: number;
    databaseEntries: number;
    staticEntries: number;
    lastSync: string | null;
  }> {
    try {
      const currentDictionary = await this.getDictionary();
      const dbDictionary = await this.getDictionaryFromDB().catch(() => []);
      const syncStatus = await this.getSyncStatus();

      return {
        totalEntries: currentDictionary.length,
        databaseEntries: dbDictionary.length,
        staticEntries: this.getStaticDictionary().length,
        lastSync: syncStatus?.last_sync_at || null
      };
    } catch (error) {
      console.error('Error getting dictionary stats:', error);
      return {
        totalEntries: this.getStaticDictionary().length,
        databaseEntries: 0,
        staticEntries: this.getStaticDictionary().length,
        lastSync: null
      };
    }
  }

  /**
   * Export dictionary data
   */
  async exportDictionary(format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      const allEntries = await this.getDictionary();
      
      if (format === 'json') {
        return JSON.stringify(allEntries, null, 2);
      }
      
      // CSV format
      const headers = ['Original', 'Replacement', 'Source'];
      const csvRows = [
        headers.join(','),
        ...allEntries.map(entry => [
          `"${entry.original}"`,
          `"${entry.replacement}"`,
          `"${entry.source || 'unknown'}"`
        ].join(','))
      ];
      
      return csvRows.join('\n');
    } catch (error) {
      console.error('Error exporting dictionary:', error);
      throw new Error('Failed to export dictionary');
    }
  }

  /**
   * Clear dictionary cache
   */
  clearCache(): void {
    this.cachedDictionary = null;
    this.cacheTimestamp = 0;
  }
}

// Export singleton instance
export const dictionaryService = DictionaryService.getInstance();
