import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleSheetsRow {
  original: string;
  replacement: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body for manual sync or use default sheet ID
    const { sheetId, range = 'A:B' } = await req.json().catch(() => ({}))
    
    const googleSheetsApiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY')
    const defaultSheetId = Deno.env.get('GOOGLE_SHEETS_DICTIONARY_ID')
    
    if (!googleSheetsApiKey) {
      throw new Error('GOOGLE_SHEETS_API_KEY environment variable is required')
    }

    const finalSheetId = sheetId || defaultSheetId
    if (!finalSheetId) {
      throw new Error('Sheet ID is required either in request body or GOOGLE_SHEETS_DICTIONARY_ID env var')
    }

    // Update sync status to in_progress
    const { error: statusError } = await supabaseClient
      .from('dictionary_sync_status')
      .insert({
        sync_status: 'in_progress',
        total_records: 0
      })

    if (statusError) {
      console.error('Error updating sync status:', statusError)
    }

    // Fetch data from Google Sheets
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${finalSheetId}/values/${range}?key=${googleSheetsApiKey}`
    
    console.log('Fetching dictionary from Google Sheets...')
    const response = await fetch(sheetsUrl)
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const rows: string[][] = data.values || []

    // Process rows and validate data
    const dictionaryEntries: GoogleSheetsRow[] = []
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (row.length >= 2 && row[0]?.trim() && row[1]?.trim()) {
        dictionaryEntries.push({
          original: row[0].trim(),
          replacement: row[1].trim()
        })
      }
    }

    console.log(`Processing ${dictionaryEntries.length} dictionary entries`)

    // Clear existing dictionary entries
    const { error: deleteError } = await supabaseClient
      .from('word_dictionary')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

    if (deleteError) {
      console.error('Error clearing existing dictionary:', deleteError)
      throw deleteError
    }

    // Insert new dictionary entries in batches
    const batchSize = 100
    let totalInserted = 0

    for (let i = 0; i < dictionaryEntries.length; i += batchSize) {
      const batch = dictionaryEntries.slice(i, i + batchSize)
      
      const { error: insertError } = await supabaseClient
        .from('word_dictionary')
        .insert(batch.map(entry => ({
          original: entry.original,
          replacement: entry.replacement,
          source: 'google_sheets',
          is_active: true
        })))

      if (insertError) {
        console.error('Error inserting dictionary batch:', insertError)
        throw insertError
      }

      totalInserted += batch.length
    }

    // Update sync status to success
    const { error: finalStatusError } = await supabaseClient
      .from('dictionary_sync_status')
      .insert({
        last_sync_at: new Date().toISOString(),
        sync_status: 'success',
        total_records: totalInserted
      })

    if (finalStatusError) {
      console.error('Error updating final sync status:', finalStatusError)
    }

    console.log(`Successfully synced ${totalInserted} dictionary entries`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${totalInserted} dictionary entries`,
        totalRecords: totalInserted
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Dictionary sync failed:', error)

    // Update sync status to failed
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseClient
        .from('dictionary_sync_status')
        .insert({
          sync_status: 'failed',
          error_message: error.message,
          total_records: 0
        })
    } catch (statusError) {
      console.error('Error updating failed sync status:', statusError)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})