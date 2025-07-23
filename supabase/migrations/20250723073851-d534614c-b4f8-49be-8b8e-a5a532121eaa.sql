-- Add dictionary_type column to word_dictionary table
ALTER TABLE public.word_dictionary 
ADD COLUMN dictionary_type TEXT DEFAULT 'grammar' CHECK (dictionary_type IN ('grammar', 'style'));

-- Update existing records to have default type
UPDATE public.word_dictionary 
SET dictionary_type = 'grammar' 
WHERE dictionary_type IS NULL;

-- Make dictionary_type NOT NULL after setting defaults
ALTER TABLE public.word_dictionary 
ALTER COLUMN dictionary_type SET NOT NULL;

-- Create index for better performance on dictionary_type
CREATE INDEX idx_word_dictionary_type ON public.word_dictionary(dictionary_type);

-- Create composite index for dictionary_type and is_active
CREATE INDEX idx_word_dictionary_type_active ON public.word_dictionary(dictionary_type, is_active);

-- Update dictionary_sync_status table to track dictionary type
ALTER TABLE public.dictionary_sync_status 
ADD COLUMN dictionary_type TEXT DEFAULT 'grammar' CHECK (dictionary_type IN ('grammar', 'style'));

-- Make dictionary_type NOT NULL with default
ALTER TABLE public.dictionary_sync_status 
ALTER COLUMN dictionary_type SET NOT NULL;

-- Create index on dictionary_sync_status for dictionary_type
CREATE INDEX idx_dictionary_sync_status_type ON public.dictionary_sync_status(dictionary_type);