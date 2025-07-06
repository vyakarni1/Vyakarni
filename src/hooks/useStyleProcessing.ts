
import { useState } from 'react';
import { toast } from "sonner";
import { Correction } from "@/types/grammarChecker";
import { callStyleEnhanceAPI, callDictionaryApplyAPI, callTextComparisonAPI } from "@/services/grammarApi";
import { wordReplacements } from "@/data/wordReplacements";

export const useStyleProcessing = () => {
  const [enhancedText, setEnhancedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);

  const processStyleEnhancement = async (inputText: string, trackUsage: Function, trackWordUsage: Function) => {
    try {
      console.log('=== NEW 3-STEP GPT STYLE ENHANCEMENT PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      // STEP 1: Send original text directly to GPT for style enhancement
      console.log('\n=== STEP 1: GPT STYLE ENHANCEMENT ===');
      console.log('Sending original text to GPT for style enhancement:', inputText);
      const enhanced = await callStyleEnhanceAPI(inputText);
      console.log('GPT enhanced text:', enhanced);
      
      // STEP 2: Apply dictionary replacements to GPT enhanced text using GPT
      console.log('\n=== STEP 2: GPT DICTIONARY APPLICATION ===');
      console.log('Applying dictionary replacements to GPT enhanced text:', enhanced);
      const textWithDictionary = await callDictionaryApplyAPI(enhanced, wordReplacements);
      console.log('Text after dictionary application:', textWithDictionary);
      
      // STEP 3: Compare original and final text using GPT to get highlighting data
      console.log('\n=== STEP 3: GPT TEXT COMPARISON ===');
      console.log('Comparing original and final text for highlighting');
      const comparisonCorrections = await callTextComparisonAPI(inputText, textWithDictionary, 'style_enhance');
      console.log('Comparison corrections found:', comparisonCorrections.length);
      
      setEnhancedText(textWithDictionary);
      setCorrections(comparisonCorrections);
      
      console.log('\n=== FINAL RESULTS SUMMARY ===');
      console.log('Original text:', inputText);
      console.log('Final enhanced text:', textWithDictionary);
      console.log('Text changed overall:', textWithDictionary !== inputText);
      console.log('Total corrections from comparison:', comparisonCorrections.length);
      console.log('All corrections:', comparisonCorrections);
      
      await trackUsage('style_enhance');
      await trackWordUsage(inputText, 'style_enhance');
      
      console.log('=== NEW 3-STEP GPT STYLE ENHANCEMENT PROCESS COMPLETE ===');
      toast.success(`शैली सुधार पूरा हो गया! ${comparisonCorrections.length} सुधार मिले।`);
      
      return { enhanced: textWithDictionary, styleEnhancements: comparisonCorrections };
    } catch (error) {
      console.error('Error in style processing:', error);
      throw error;
    }
  };

  const resetStyleData = () => {
    setEnhancedText('');
    setCorrections([]);
  };

  return {
    enhancedText,
    corrections,
    processStyleEnhancement,
    resetStyleData
  };
};
