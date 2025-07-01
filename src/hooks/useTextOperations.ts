
import { useState } from 'react';
import { toast } from "sonner";
import { ProcessingMode } from "@/types/grammarChecker";

const MAX_WORD_LIMIT = 1000;

export const useTextOperations = () => {
  const [inputText, setInputText] = useState('');
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');

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

  const validateInput = (text: string): boolean => {
    if (!text.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return false;
    }
    return checkWordLimit(text);
  };

  const copyToClipboard = async (textToCopy: string) => {
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("टेक्स्ट कॉपी किया गया!");
    }
  };

  const resetTextData = () => {
    setInputText('');
    setProcessingMode('grammar');
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  return {
    inputText,
    setInputText,
    processingMode,
    setProcessingMode,
    validateInput,
    copyToClipboard,
    resetTextData,
    getWordCount,
    getCharCount
  };
};
