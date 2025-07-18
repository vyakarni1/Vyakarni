import { useState } from 'react';
import { toast } from "sonner";
import { Correction } from "@/types/grammarChecker";
import { callGrammarCheckAPI, callDictionaryApplyAPI, callTextComparisonAPI } from "@/services/grammarApi";
import { dictionaryService } from '@/services/dictionaryService';

export const useRestructuredGrammarProcessing = () => {
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);

  const processGrammarCorrection = async (inputText: string, trackUsage: Function, trackWordUsage: Function, progressCallback?: (stage: number, progress: number) => void) => {
    try {
      console.log('=== NEW 3-STEP GPT GRAMMAR CORRECTION PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      // STEP 1: Send original text directly to GPT for grammar correction
      console.log('\n=== STEP 1: GPT GRAMMAR CORRECTION ===');
      console.log('Sending original text to GPT for grammar correction:', inputText);
      progressCallback?.(1, 0);
      const gptResult = await callGrammarCheckAPI(inputText);
      progressCallback?.(1, 100);
      console.log('GPT corrected text:', gptResult.correctedText);
      console.log('GPT corrections found:', gptResult.corrections.length);
      
      // STEP 2: Apply dictionary replacements to GPT corrected text using GPT
      console.log('\n=== STEP 2: GPT DICTIONARY APPLICATION ===');
      console.log('Applying dictionary replacements to GPT corrected text:', gptResult.correctedText);
      progressCallback?.(2, 0);
      const dictionary = await dictionaryService.getDictionary();
      const textWithDictionary = await callDictionaryApplyAPI(gptResult.correctedText, dictionary);
      progressCallback?.(2, 100);
      console.log('Text after dictionary application:', textWithDictionary);
      
      // STEP 3: Compare original and final text using GPT to get highlighting data
      console.log('\n=== STEP 3: GPT TEXT COMPARISON ===');
      console.log('Comparing original and final text for highlighting');
      progressCallback?.(3, 0);
      const comparisonCorrections = await callTextComparisonAPI(inputText, textWithDictionary, 'grammar_check');
      progressCallback?.(3, 100);
      console.log('Comparison corrections found:', comparisonCorrections.length);
      
      setCorrectedText(textWithDictionary);
      setCorrections(comparisonCorrections);
      
      console.log('\n=== FINAL RESULTS SUMMARY ===');
      console.log('Original text:', inputText);
      console.log('Final corrected text:', textWithDictionary);
      console.log('Text changed overall:', textWithDictionary !== inputText);
      console.log('Total corrections from comparison:', comparisonCorrections.length);
      console.log('All corrections:', comparisonCorrections);
      
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      console.log('=== NEW 3-STEP GPT GRAMMAR CORRECTION PROCESS COMPLETE ===');
      toast.success(`व्याकरण सुधार पूरा हो गया! ${comparisonCorrections.length} सुधार मिले।`);
      
      return { finalText: textWithDictionary, allCorrections: comparisonCorrections };
    } catch (error) {
      console.error('Error in restructured grammar processing:', error);
      throw error;
    }
  };

  const resetGrammarData = () => {
    setCorrectedText('');
    setCorrections([]);
  };

  return {
    correctedText,
    corrections,
    processGrammarCorrection,
    resetGrammarData
  };
};