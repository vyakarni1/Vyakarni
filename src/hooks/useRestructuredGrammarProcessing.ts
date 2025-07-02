import { useState } from 'react';
import { toast } from "sonner";
import { Correction } from "@/types/grammarChecker";
import { callGrammarCheckAPI } from "@/services/grammarApi";
import { applySimpleDictionaryCorrections } from "@/utils/simpleDictionaryCorrections";

export const useRestructuredGrammarProcessing = () => {
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);

  const processGrammarCorrection = async (inputText: string, trackUsage: Function, trackWordUsage: Function) => {
    try {
      console.log('=== NEW 3-STEP GRAMMAR CORRECTION PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      // STEP 1: Send original text directly to GPT
      console.log('\n=== STEP 1: GPT ANALYSIS ===');
      console.log('Sending original text to GPT:', inputText);
      const gptResult = await callGrammarCheckAPI(inputText);
      console.log('GPT corrected text:', gptResult.correctedText);
      console.log('GPT corrections found:', gptResult.corrections.length);
      
      // STEP 2: Apply dictionary corrections to GPT output
      console.log('\n=== STEP 2: DICTIONARY CORRECTIONS ON GPT OUTPUT ===');
      console.log('Applying dictionary corrections to GPT output:', gptResult.correctedText);
      const dictionaryResult = applySimpleDictionaryCorrections(gptResult.correctedText);
      const finalText = dictionaryResult.correctedText;
      const dictionaryCorrections = dictionaryResult.corrections;
      console.log('Final text after dictionary:', finalText);
      console.log('Dictionary corrections found:', dictionaryCorrections.length);
      
      // STEP 3: Combine all corrections with proper source attribution
      console.log('\n=== STEP 3: COMBINE CORRECTIONS ===');
      const allCorrections = [
        ...gptResult.corrections.map(correction => ({ 
          ...correction, 
          source: 'gpt' as const,
          step: 'gpt'
        })),
        ...dictionaryCorrections.map(correction => ({ 
          ...correction, 
          source: 'dictionary' as const,
          step: 'dictionary'
        }))
      ];
      
      setCorrectedText(finalText);
      setCorrections(allCorrections);
      
      console.log('\n=== FINAL RESULTS SUMMARY ===');
      console.log('Original text:', inputText);
      console.log('Final corrected text:', finalText);
      console.log('Text changed overall:', finalText !== inputText);
      console.log('Total corrections:', allCorrections.length);
      console.log('GPT corrections:', gptResult.corrections.length);
      console.log('Dictionary corrections:', dictionaryCorrections.length);
      console.log('All corrections combined:', allCorrections);
      
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      console.log('=== NEW 3-STEP GRAMMAR CORRECTION PROCESS COMPLETE ===');
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
      
      return { finalText, allCorrections };
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