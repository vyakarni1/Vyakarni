
import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { callGrammarCheckAPI, callStyleEnhanceAPI } from "@/services/grammarApi";
import { createProgressSimulator, completeProgress, resetProgress } from "@/utils/progressUtils";

const MAX_WORD_LIMIT = 5000;

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

    const progressInterval = createProgressSimulator(setProgress);

    try {
      const response = await callGrammarCheckAPI(inputText);
      
      completeProgress(setProgress, progressInterval);
      setCorrectedText(response.correctedText);
      setCorrections(response.corrections);
      
      setIsLoading(false);
      
      await trackUsage('grammar_check');
      await trackWordUsage(inputText, 'grammar_check');
      
      toast.success(`व्याकरण सुधार पूरा हो गया! ${response.corrections.length} सुधार मिले।`);
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

    const progressInterval = createProgressSimulator(setProgress);

    try {
      const response = await callStyleEnhanceAPI(inputText);
      
      completeProgress(setProgress, progressInterval);
      setEnhancedText(response.enhancedText);
      setCorrections(response.corrections);
      
      setIsLoading(false);
      
      await trackUsage('style_enhance');
      await trackWordUsage(inputText, 'style_enhance');
      
      toast.success(`शैली सुधार पूरा हो गया! ${response.corrections.length} सुधार मिले।`);
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
