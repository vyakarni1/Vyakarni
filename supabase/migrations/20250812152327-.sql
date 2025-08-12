-- Create admin_drafts table for persistent auto-save functionality
CREATE TABLE public.admin_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  draft_type TEXT NOT NULL, -- 'blog_create', 'blog_edit', etc.
  draft_key TEXT NOT NULL, -- unique identifier for the draft (e.g., 'blog_create' or 'blog_edit_{post_id}')
  form_data JSONB NOT NULL DEFAULT '{}', -- stores all form field data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(admin_id, draft_key)
);

-- Enable RLS
ALTER TABLE public.admin_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage their own drafts" 
ON public.admin_drafts 
FOR ALL 
USING (admin_id = auth.uid() AND is_admin(auth.uid()))
WITH CHECK (admin_id = auth.uid() AND is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_drafts_updated_at
BEFORE UPDATE ON public.admin_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();