
import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useTextHighlighting } from "@/hooks/useTextHighlighting";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { extractStyleEnhancements } from "@/utils/textProcessing";
import { callGrammarCheckAPI, callStyleEnhanceAPI } from "@/services/grammarApi";
import { createProgressSimulator, completeProgress, resetProgress } from "@/utils/progressUtils";
import { applyDictionaryCorrections } from "@/utils/dictionaryCorrections";
import { applyFinalDictionaryCorrections, verifyCorrections } from "@/utils/finalDictionaryCorrections";
import { logger } from '@/utils/logger';

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
  
  // Add highlighting functionality
  const highlighting = useTextHighlighting();

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

    if (!checkWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('grammar');
    setProgress(0);
    setCorrectedText('');
    setCorrections([]);
    highlighting.clearHighlight();

    const progressInterval = createProgressSimulator(setProgress);

    try {
      logger.info('4-STEP GRAMMAR CORRECTION PROCESS START', { inputLength: inputText.length }, 'useGrammarChecker');
      logger.debug('Original input text', { text: inputText }, 'useGrammarChecker');
      
      const { correctedText: step1Text, corrections: step1Corrections } = applyDictionaryCorrections(inputText);
      logger.debug('STEP 1: Dictionary corrections on input', { 
        inputText: inputText, 
        outputText: step1Text, 
        correctionsFound: step1Corrections.length 
      }, 'useGrammarChecker');
      
      logger.debug('STEP 2: GPT analysis on dictionary-corrected text', { inputText: step1Text }, 'useGrammarChecker');
      const gptResult = await callGrammarCheckAPI(step1Text);
      logger.debug('GPT processing completed', { 
        inputText: step1Text, 
        outputText: gptResult.correctedText, 
        correctionsFound: gptResult.corrections.length 
      }, 'useGrammarChecker');
      
      logger.debug('STEP 3: Dictionary corrections on GPT output', undefined, 'useGrammarChecker');
      const { correctedText: step3Text, corrections: step3Corrections } = applyDictionaryCorrections(gptResult.correctedText);
      logger.debug('Step 3 completed', { 
        inputText: gptResult.correctedText, 
        outputText: step3Text, 
        correctionsFound: step3Corrections.length 
      }, 'useGrammarChecker');
      
      logger.debug('STEP 4: FINAL DICTIONARY PASS (NEW ROBUST METHOD)', undefined, 'useGrammarChecker');
      const { correctedText: finalText, corrections: finalCorrections } = applyFinalDictionaryCorrections(step3Text);
      logger.debug('Step 4 completed', { 
        inputText: step3Text, 
        outputText: finalText, 
        correctionsFound: finalCorrections.length 
      }, 'useGrammarChecker');
      
      logger.debug('FINAL TEXT VERIFICATION', undefined, 'useGrammarChecker');
      verifyCorrections(finalText);
      
      completeProgress(setProgress, progressInterval);
      
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
      
      logger.info('FINAL RESULTS SUMMARY', {
        originalText: inputText,
        finalText: finalText,
        textChanged: finalText !== inputText,
        totalCorrections: allCorrections.length
      }, 'useGrammarChecker');
      
      setCorrections(allCorrections);
      setIsLoading(false);
      
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      logger.info('4-STEP GRAMMAR CORRECTION PROCESS COMPLETE', { totalCorrections: allCorrections.length }, 'useGrammarChecker');
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
    } catch (error) {
      logger.error('Error correcting grammar', error, 'useGrammarChecker');
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

    if (!checkWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('style');
    setProgress(0);
    setEnhancedText('');
    setCorrections([]);
    highlighting.clearHighlight();

    const progressInterval = createProgressSimulator(setProgress);

    try {
      logger.debug('Starting style enhancement', { textLength: inputText.length }, 'useGrammarChecker');
      const enhanced = await callStyleEnhanceAPI(inputText);
      
      completeProgress(setProgress, progressInterval);
      setEnhancedText(enhanced);

      const styleEnhancements = extractStyleEnhancements(inputText, enhanced);
      setCorrections(styleEnhancements);
      
      setIsLoading(false);
      
      await trackUsage('style_enhance');
      await trackWordUsage(inputText, 'style_enhance');
      
      logger.info('Style enhancement completed', { enhancementCount: styleEnhancements.length }, 'useGrammarChecker');
      toast.success(`शैली सुधार पूरा हो गया! ${styleEnhancements.length} सुधार मिले।`);
    } catch (error) {
      logger.error('Error enhancing style', error, 'useGrammarChecker');
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
    highlighting.clearHighlight();
    logger.debug('Text and state reset', undefined, 'useGrammarChecker');
  };

  const copyToClipboard = async () => {
    const textToCopy = processingMode === 'style' ? enhancedText : correctedText;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      logger.debug('Text copied to clipboard', { textLength: textToCopy.length }, 'useGrammarChecker');
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
    getCurrentProcessedText,
    highlighting
  };
};
