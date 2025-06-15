
import { supabase } from "@/integrations/supabase/client";
import { wordReplacements } from "@/data/wordReplacements";
import { logger } from '@/utils/logger';

export const callGrammarCheckAPI = async (inputText: string) => {
  logger.debug('Sending text for correction', { textLength: inputText.length }, 'grammarApi');
  
  const { data, error } = await supabase.functions.invoke('grammar-check', {
    body: {
      inputText,
      wordReplacements
    }
  });

  if (error) {
    logger.error('Edge function error', error, 'grammarApi');
    throw new Error(`Grammar correction failed: ${error.message}`);
  }

  if (!data || !data.correctedText) {
    throw new Error('No corrected text received from the API');
  }

  logger.debug('Received corrected text', { 
    correctedTextLength: data.correctedText.length,
    correctionsCount: data.corrections?.length || 0
  }, 'grammarApi');
  
  return {
    correctedText: data.correctedText,
    corrections: data.corrections || []
  };
};

export const callStyleEnhanceAPI = async (inputText: string) => {
  logger.debug('Sending text for style enhancement', { textLength: inputText.length }, 'grammarApi');
  
  const { data, error } = await supabase.functions.invoke('style-enhance', {
    body: { inputText }
  });

  if (error) {
    logger.error('Edge function error', error, 'grammarApi');
    throw new Error(`Style enhancement failed: ${error.message}`);
  }

  if (!data || !data.enhancedText) {
    throw new Error('No enhanced text received from the API');
  }

  logger.debug('Received enhanced text', { enhancedTextLength: data.enhancedText.length }, 'grammarApi');
  return data.enhancedText;
};
