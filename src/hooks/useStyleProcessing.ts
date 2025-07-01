
import { useState } from 'react';
import { toast } from "sonner";
import { Correction } from "@/types/grammarChecker";
import { callStyleEnhanceAPI } from "@/services/grammarApi";
import { extractStyleEnhancements } from "@/utils/textProcessing";

export const useStyleProcessing = () => {
  const [enhancedText, setEnhancedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);

  const processStyleEnhancement = async (inputText: string, trackUsage: Function, trackWordUsage: Function) => {
    try {
      const enhanced = await callStyleEnhanceAPI(inputText);
      const styleEnhancements = extractStyleEnhancements(inputText, enhanced);
      
      setEnhancedText(enhanced);
      setCorrections(styleEnhancements);
      
      await trackUsage('style_enhance');
      await trackWordUsage(inputText, 'style_enhance');
      
      toast.success(`शैली सुधार पूरा हो गया! ${styleEnhancements.length} सुधार मिले।`);
      
      return { enhanced, styleEnhancements };
    } catch (error) {
      console.error('Error in style processing:', error);
      throw error;
    }
  };

  const resetStyleData = () => {
    setEnhancedText('');
    setCorrections([]);
  };

  return {
    enhancedText,
    corrections,
    processStyleEnhancement,
    resetStyleData
  };
};
