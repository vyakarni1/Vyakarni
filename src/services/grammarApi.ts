
import { supabase } from "@/integrations/supabase/client";
import { wordReplacements } from "@/data/wordReplacements";

export const callGrammarCheckAPI = async (inputText: string) => {
  console.log('Sending text for correction:', inputText);
  
  const { data, error } = await supabase.functions.invoke('grammar-check', {
    body: {
      inputText,
      wordReplacements
    }
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(`Grammar correction failed: ${error.message}`);
  }

  if (!data || !data.correctedText) {
    throw new Error('No corrected text received from the API');
  }

  console.log('Received corrected text:', data.correctedText);
  console.log('Received corrections:', data.corrections);
  
  return {
    correctedText: data.correctedText,
    corrections: data.corrections || []
  };
};

export const callStyleEnhanceAPI = async (inputText: string) => {
  console.log('Sending text for style enhancement:', inputText);
  
  const { data, error } = await supabase.functions.invoke('style-enhance', {
    body: { inputText }
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(`Style enhancement failed: ${error.message}`);
  }

  if (!data || !data.enhancedText) {
    throw new Error('No enhanced text received from the API');
  }

  console.log('Received enhanced text:', data.enhancedText);
  return data.enhancedText;
};
