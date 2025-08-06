-- Add foreign key constraint between text_corrections and profiles
ALTER TABLE text_corrections 
ADD CONSTRAINT fk_text_corrections_user_id 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create index on user_id for better join performance
CREATE INDEX IF NOT EXISTS idx_text_corrections_user_id ON text_corrections(user_id);