
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
      // Step 1: Apply dictionary corrections to input text
      console.log('Step 1: Applying dictionary corrections to input');
      const { correctedText: step1Text, corrections: step1Corrections } = applyDictionaryCorrections(inputText);
      
      // Step 2: Send dictionary-corrected text to GPT for grammar analysis
      console.log('Step 2: Sending to GPT for grammar analysis');
      const gptResult = await callGrammarCheckAPI(step1Text);
      
      // Step 3: Apply dictionary corrections again to GPT output
      console.log('Step 3: Applying dictionary corrections to GPT output');
      const { correctedText: finalText, corrections: step3Corrections } = applyDictionaryCorrections(gptResult.correctedText);
      
      completeProgress(setProgress, progressInterval);
      setCorrectedText(finalText);
      
      // Combine all corrections: Step 1 + GPT + Step 3
      const allCorrections = [
        ...step1Corrections,
        ...gptResult.corrections.map(correction => ({ ...correction, source: 'gpt' as const })),
        ...step3Corrections
      ];
      
      setCorrections(allCorrections);
      setIsLoading(false);
      
      // Track usage for both systems
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      console.log(`Grammar correction completed with ${allCorrections.length} total corrections`);
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
