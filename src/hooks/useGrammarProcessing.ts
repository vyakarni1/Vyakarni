
import { useState } from 'react';
import { toast } from "sonner";
import { Correction } from "@/types/grammarChecker";
import { callGrammarCheckAPI } from "@/services/grammarApi";
import { applyDictionaryCorrections } from "@/utils/dictionaryCorrections";
import { applyFinalDictionaryCorrections, verifyCorrections } from "@/utils/finalDictionaryCorrections";

export const useGrammarProcessing = () => {
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);

  const processGrammarCorrection = async (inputText: string, trackUsage: Function, trackWordUsage: Function) => {
    try {
      console.log('=== 4-STEP GRAMMAR CORRECTION PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      // Step 1: Dictionary corrections on input
      const step1Result = await applyDictionaryCorrections(inputText);
      const step1Text = step1Result.correctedText;
      const step1Corrections = step1Result.corrections;
      console.log('\n=== STEP 1: Dictionary corrections on input ===');
      console.log('Step 1 input:', inputText);
      console.log('Step 1 output:', step1Text);
      console.log('Step 1 corrections found:', step1Corrections.length);
      
      // Step 2: GPT analysis
      console.log('\n=== STEP 2: GPT analysis on dictionary-corrected text ===');
      console.log('Sending to GPT:', step1Text);
      const gptResult = await callGrammarCheckAPI(step1Text);
      console.log('GPT input:', step1Text);
      console.log('GPT output:', gptResult.correctedText);
      console.log('GPT corrections found:', gptResult.corrections.length);
      
      // Step 3: Dictionary corrections on GPT output
      console.log('\n=== STEP 3: Dictionary corrections on GPT output ===');
      const step3Result = await applyDictionaryCorrections(gptResult.correctedText);
      const step3Text = step3Result.correctedText;
      const step3Corrections = step3Result.corrections;
      console.log('Step 3 input:', gptResult.correctedText);
      console.log('Step 3 output:', step3Text);
      console.log('Step 3 corrections found:', step3Corrections.length);
      
      // Step 4: Final dictionary pass
      console.log('\n=== STEP 4: FINAL DICTIONARY PASS (NEW ROBUST METHOD) ===');
      const finalResult = await applyFinalDictionaryCorrections(step3Text);
      const finalText = finalResult.correctedText;
      const finalCorrections = finalResult.corrections;
      console.log('Step 4 input:', step3Text);
      console.log('Step 4 output:', finalText);
      console.log('Step 4 corrections found:', finalCorrections.length);
      
      // Final verification
      console.log('\n=== FINAL TEXT VERIFICATION ===');
      verifyCorrections(finalText);
      
      setCorrectedText(finalText);
      
      const allCorrections = [
        ...step1Corrections.map(correction => ({ 
          ...correction, 
          source: 'dictionary' as const,
          step: 'step1'
        })),
        ...gptResult.corrections.map(correction => ({ 
          ...correction, 
          source: 'gpt' as const,
          step: 'step2'
        })),
        ...step3Corrections.map(correction => ({ 
          ...correction, 
          source: 'dictionary' as const,
          step: 'step3'
        })),
        ...finalCorrections.map(correction => ({ 
          ...correction, 
          source: 'dictionary' as const,
          step: 'step4'
        }))
      ];
      
      console.log('\n=== FINAL RESULTS SUMMARY ===');
      console.log('Original text:', inputText);
      console.log('Final corrected text:', finalText);
      console.log('Text changed overall:', finalText !== inputText);
      console.log('Total corrections:', allCorrections.length);
      console.log('All corrections combined:', allCorrections);
      
      setCorrections(allCorrections);
      
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      console.log('=== 4-STEP GRAMMAR CORRECTION PROCESS COMPLETE ===');
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
      
      return { finalText, allCorrections };
    } catch (error) {
      console.error('Error in grammar processing:', error);
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
