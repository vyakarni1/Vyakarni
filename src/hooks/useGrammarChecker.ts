import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { extractStyleEnhancements } from "@/utils/textProcessing";
import { callGrammarCheckAPI, callStyleEnhanceAPI } from "@/services/grammarApi";
import { createProgressSimulator, completeProgress, resetProgress } from "@/utils/progressUtils";
import { applyDictionaryCorrections, trackDictionaryCorrections } from "@/utils/dictionaryCorrections";

const MAX_WORD_LIMIT = 1000;

export const useGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');
  const [progress, setProgress] = useState(0);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const { trackUsage } = useUsageStats();
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();

  const checkWordLimit = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount > MAX_WORD_LIMIT) {
      toast.error(
        `शब्द सीमा पार हो गई! अधिकतम ${MAX_WORD_LIMIT} शब्द की अनुमति है। वर्तमान में ${wordCount} शब्द हैं।`,
        {
          duration: 5000,
        }
      );
      return false;
    }
    
    return true;
  };

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    // Check 1000 word limit first
    if (!checkWordLimit(inputText)) {
      return;
    }

    // Check word limits before processing (existing word credit system)
    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('grammar');
    setProgress(0);
    setCorrectedText('');
    setCorrections([]);

    const progressInterval = createProgressSimulator(setProgress);

    try {
      console.log('=== 3-STEP GRAMMAR CORRECTION PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      // Step 1: Apply dictionary corrections to input text
      console.log('\n=== STEP 1: Dictionary corrections on input ===');
      const { correctedText: step1Text, corrections: step1Corrections } = applyDictionaryCorrections(inputText);
      console.log('Step 1 input:', inputText);
      console.log('Step 1 output:', step1Text);
      console.log('Step 1 corrections found:', step1Corrections.length);
      console.log('Step 1 corrections:', step1Corrections);
      
      // Verify step 1 actually made changes
      const step1Changed = step1Text !== inputText;
      console.log('Step 1 made changes:', step1Changed);
      
      // Step 2: Send dictionary-corrected text to GPT for grammar analysis
      console.log('\n=== STEP 2: GPT analysis on dictionary-corrected text ===');
      console.log('Sending to GPT:', step1Text);
      console.log('GPT input length:', step1Text.length);
      const gptResult = await callGrammarCheckAPI(step1Text);
      console.log('GPT input:', step1Text);
      console.log('GPT output:', gptResult.correctedText);
      console.log('GPT output length:', gptResult.correctedText.length);
      console.log('GPT corrections found:', gptResult.corrections.length);
      console.log('GPT corrections:', gptResult.corrections);
      
      // Verify GPT made changes
      const gptChanged = gptResult.correctedText !== step1Text;
      console.log('GPT made changes:', gptChanged);
      
      // Step 3: Apply dictionary corrections again to GPT output - CRITICAL FIX
      console.log('\n=== STEP 3: Dictionary corrections on GPT output ===');
      console.log('Step 3 input (GPT output):', gptResult.correctedText);
      const { correctedText: step3Text, corrections: step3Corrections } = applyDictionaryCorrections(gptResult.correctedText);
      console.log('Step 3 input:', gptResult.correctedText);
      console.log('Step 3 output:', step3Text);
      console.log('Step 3 corrections found:', step3Corrections.length);
      console.log('Step 3 corrections:', step3Corrections);
      
      // Verify step 3 made changes
      const step3Changed = step3Text !== gptResult.correctedText;
      console.log('Step 3 made changes:', step3Changed);
      
      // CRITICAL: Ensure we use the final corrected text from Step 3
      const finalText = step3Text;
      console.log('\n=== FINAL TEXT VERIFICATION ===');
      console.log('Final text to display:', finalText);
      console.log('Final text length:', finalText.length);
      
      // Verify specific corrections are in final text
      const testWords = ['शुभकामनायें', 'खाये', 'गये'];
      testWords.forEach(word => {
        const isPresent = finalText.includes(word);
        console.log(`Final text contains "${word}":`, isPresent);
      });
      
      completeProgress(setProgress, progressInterval);
      
      // Set the final corrected text - THIS IS THE KEY FIX
      setCorrectedText(finalText);
      
      // Combine all corrections with proper source attribution and detailed logging
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
        }))
      ];
      
      console.log('\n=== FINAL RESULTS SUMMARY ===');
      console.log('Original text:', inputText);
      console.log('Final corrected text:', finalText);
      console.log('Text changed overall:', finalText !== inputText);
      console.log('Total corrections:', allCorrections.length);
      console.log('Step 1 (dict) corrections:', step1Corrections.length);
      console.log('Step 2 (GPT) corrections:', gptResult.corrections.length);
      console.log('Step 3 (dict) corrections:', step3Corrections.length);
      console.log('All corrections combined:', allCorrections);
      
      setCorrections(allCorrections);
      setIsLoading(false);
      
      // Track usage for both systems
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      console.log('=== 3-STEP GRAMMAR CORRECTION PROCESS COMPLETE ===');
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
    } catch (error) {
      console.error('Error correcting grammar:', error);
      setIsLoading(false);
      resetProgress(setProgress, progressInterval);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const enhanceStyle = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    // Check 1000 word limit first
    if (!checkWordLimit(inputText)) {
      return;
    }

    // Check word limits before processing (existing word credit system)
    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('style');
    setProgress(0);
    setEnhancedText('');
    setCorrections([]);

    const progressInterval = createProgressSimulator(setProgress);

    try {
      const enhanced = await callStyleEnhanceAPI(inputText);
      
      completeProgress(setProgress, progressInterval);
      setEnhancedText(enhanced);

      const styleEnhancements = extractStyleEnhancements(inputText, enhanced);
      setCorrections(styleEnhancements);
      
      setIsLoading(false);
      
      // Track usage for both systems
      await trackUsage('style_enhance');
      await trackWordUsage(inputText, 'style_enhance');
      
      toast.success(`शैली सुधार पूरा हो गया! ${styleEnhancements.length} सुधार मिले।`);
    } catch (error) {
      console.error('Error enhancing style:', error);
      setIsLoading(false);
      resetProgress(setProgress, progressInterval);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setEnhancedText('');
    setProgress(0);
    setCorrections([]);
    setProcessingMode('grammar');
  };

  const copyToClipboard = async () => {
    const textToCopy = processingMode === 'style' ? enhancedText : correctedText;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("टेक्स्ट कॉपी किया गया!");
    }
  };

  const getCurrentProcessedText = () => {
    return processingMode === 'style' ? enhancedText : correctedText;
  };

  return {
    inputText,
    setInputText,
    correctedText,
    enhancedText,
    isLoading,
    processingMode,
    progress,
    corrections,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    getCurrentProcessedText
  };
};
