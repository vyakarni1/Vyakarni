
import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { extractCorrectionsFromResponse, extractStyleEnhancements } from "@/utils/textProcessing";
import { callGrammarCheckAPI, callStyleEnhanceAPI } from "@/services/grammarApi";
import { createProgressSimulator, completeProgress, resetProgress } from "@/utils/progressUtils";

export const useGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');
  const [progress, setProgress] = useState(0);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const { trackUsage } = useUsageStats();
  const { checkAndEnforceWordLimit, checkAndEnforceCorrectionLimit, trackUsage: trackLimitUsage } = useUsageLimits();

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    // Check limits before processing
    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceCorrectionLimit()) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('grammar');
    setProgress(0);
    setCorrectedText('');
    setCorrections([]);

    const progressInterval = createProgressSimulator(setProgress);

    try {
      const aiCorrected = await callGrammarCheckAPI(inputText);
      
      completeProgress(setProgress, progressInterval);
      setCorrectedText(aiCorrected);

      const allCorrections = extractCorrectionsFromResponse(inputText, aiCorrected);
      setCorrections(allCorrections);
      
      setIsLoading(false);
      
      // Track usage for both systems
      await trackUsage('grammar_check');
      await trackLimitUsage(inputText);
      
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

    // Check limits before processing
    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceCorrectionLimit()) {
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
      await trackLimitUsage(inputText);
      
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
