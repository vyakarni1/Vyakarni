
-- Create word_dictionary table for caching Google Sheets data
CREATE TABLE public.word_dictionary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original TEXT NOT NULL,
  replacement TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source TEXT DEFAULT 'google_sheets',
  is_active BOOLEAN DEFAULT true
);

-- Create dictionary_sync_status table for tracking sync operations
CREATE TABLE public.dictionary_sync_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT CHECK (sync_status IN ('success', 'failed', 'in_progress')),
  total_records INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for word_dictionary
ALTER TABLE public.word_dictionary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read word dictionary" 
  ON public.word_dictionary 
  FOR SELECT 
  USING (true);

CREATE POLICY "Service role can manage word dictionary" 
  ON public.word_dictionary 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Add RLS policies for dictionary_sync_status
ALTER TABLE public.dictionary_sync_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync status" 
  ON public.dictionary_sync_status 
  FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage sync status" 
  ON public.dictionary_sync_status 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_word_dictionary_original ON public.word_dictionary(original);
CREATE INDEX idx_word_dictionary_active ON public.word_dictionary(is_active);
CREATE INDEX idx_dictionary_sync_status_latest ON public.dictionary_sync_status(created_at DESC);
