
import { supabase } from "@/integrations/supabase/client";
import { wordReplacements } from "@/data/wordReplacements";

export const callGrammarCheckAPI = async (inputText: string) => {
  console.log('Sending text for correction:', inputText);
  
  const { data, error } = await supabase.functions.invoke('grammar-check', {
    body: { inputText }
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

export const callDictionaryApplyAPI = async (correctedText: string, wordReplacements: any[]) => {
  console.log('Applying dictionary to corrected text:', correctedText);
  
  const { data, error } = await supabase.functions.invoke('dictionary-apply', {
    body: {
      correctedText,
      wordReplacements
    }
  });

  if (error) {
    console.error('Dictionary apply error:', error);
    throw new Error(`Dictionary application failed: ${error.message}`);
  }

  if (!data || !data.textWithDictionary) {
    throw new Error('No text with dictionary received from the API');
  }

  console.log('Received text with dictionary:', data.textWithDictionary);
  return data.textWithDictionary;
};

export const callTextComparisonAPI = async (originalText: string, finalText: string, processingType: string = 'grammar_check') => {
  console.log('Comparing texts for highlighting:', { originalText, finalText, processingType });
  
  const { data, error } = await supabase.functions.invoke('text-comparison', {
    body: {
      originalText,
      finalText,
      processingType
    }
  });

  if (error) {
    console.error('Text comparison error:', error);
    throw new Error(`Text comparison failed: ${error.message}`);
  }

  if (!data || !data.corrections) {
    throw new Error('No corrections received from comparison API');
  }

  console.log('Received comparison corrections:', data.corrections);
  return data.corrections;
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
