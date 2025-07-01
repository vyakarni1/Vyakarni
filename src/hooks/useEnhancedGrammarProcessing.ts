
import { useState } from 'react';
import { toast } from "sonner";
import { Correction } from "@/types/grammarChecker";
import { callGrammarCheckAPI } from "@/services/grammarApi";
import { applyEnhancedDictionaryCorrections, verifyDictionaryCorrections } from "@/utils/enhancedDictionaryCorrections";
import { TextTransformationTracker } from "@/utils/textTransformationTracker";

export const useEnhancedGrammarProcessing = () => {
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [transformationTracker] = useState(new TextTransformationTracker(''));

  const processEnhancedGrammarCorrection = async (
    inputText: string, 
    trackUsage: Function, 
    trackWordUsage: Function
  ) => {
    try {
      console.log('=== ENHANCED 4-STEP GRAMMAR CORRECTION PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      // Reset the transformation tracker
      transformationTracker.reset();

      // Step 1: Enhanced Dictionary corrections on input
      console.log('\n=== STEP 1: Enhanced Dictionary corrections on input ===');
      const step1Result = applyEnhancedDictionaryCorrections(inputText);
      const step1Text = step1Result.correctedText;
      const step1Corrections = step1Result.corrections;
      
      transformationTracker.addTransformation(
        1, 
        'step1-dictionary-input', 
        inputText, 
        step1Text, 
        step1Corrections
      );
      
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
      
      const gptCorrections = gptResult.corrections.map(correction => ({
        ...correction,
        source: 'gpt' as const
      }));
      
      transformationTracker.addTransformation(
        2, 
        'step2-gpt-analysis', 
        step1Text, 
        gptResult.correctedText, 
        gptCorrections
      );
      
      // Step 3: Enhanced Dictionary corrections on GPT output
      console.log('\n=== STEP 3: Enhanced Dictionary corrections on GPT output ===');
      const step3Result = applyEnhancedDictionaryCorrections(gptResult.correctedText);
      const step3Text = step3Result.correctedText;
      const step3Corrections = step3Result.corrections.map(correction => ({
        ...correction,
        source: 'dictionary' as const
      }));
      
      transformationTracker.addTransformation(
        3, 
        'step3-dictionary-output', 
        gptResult.correctedText, 
        step3Text, 
        step3Corrections
      );
      
      console.log('Step 3 input:', gptResult.correctedText);
      console.log('Step 3 output:', step3Text);
      console.log('Step 3 corrections found:', step3Corrections.length);
      
      // Step 4: Final verification and cleanup
      console.log('\n=== STEP 4: Final verification ===');
      verifyDictionaryCorrections(step3Text);
      
      const finalText = step3Text;
      setCorrectedText(finalText);
      
      // Get all corrections from the transformation tracker
      const allCorrections = transformationTracker.getAllCorrections();
      
      console.log('\n=== FINAL RESULTS SUMMARY ===');
      console.log('Original text:', inputText);
      console.log('Final corrected text:', finalText);
      console.log('Text changed overall:', finalText !== inputText);
      console.log('Total corrections:', allCorrections.length);
      console.log('All corrections combined:', allCorrections);
      
      setCorrections(allCorrections);
      
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      console.log('=== ENHANCED 4-STEP GRAMMAR CORRECTION PROCESS COMPLETE ===');
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
      
      return { finalText, allCorrections, transformationTracker };
    } catch (error) {
      console.error('Error in enhanced grammar processing:', error);
      throw error;
    }
  };

  const resetGrammarData = () => {
    setCorrectedText('');
    setcorrections([]);
    transformationTracker.reset();
  };

  return {
    correctedText,
    corrections,
    transformationTracker,
    processEnhancedGrammarCorrection,
    resetGrammarData
  };
};
