-- Create text_corrections table for storing user text processing history
CREATE TABLE public.text_corrections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  processing_type TEXT NOT NULL CHECK (processing_type IN ('grammar', 'style')),
  corrections_data JSONB DEFAULT '[]'::jsonb,
  words_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.text_corrections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own text corrections" 
ON public.text_corrections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own text corrections" 
ON public.text_corrections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own text corrections" 
ON public.text_corrections 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_text_corrections_user_id_created_at ON public.text_corrections(user_id, created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_text_corrections_updated_at
BEFORE UPDATE ON public.text_corrections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();