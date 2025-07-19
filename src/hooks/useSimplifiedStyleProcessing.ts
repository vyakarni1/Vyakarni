
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { applySimplifiedDictionaryCorrections } from '@/utils/simplifiedDictionaryCorrections';

interface UseSimplifiedStyleProcessingProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

export const useSimplifiedStyleProcessing = ({ onProgressUpdate }: UseSimplifiedStyleProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');

  const processStyleEnhancement = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया शैली सुधार के लिए कुछ पाठ लिखें');
    }

    console.log(`Starting simplified style enhancement`);
    setIsProcessing(true);
    
    try {
      // Step 1: Grok-3 Processing (0-60%)
      onProgressUpdate?.(20, 'Grok-3 से शैली सुधार...');
      
      const { data: grokData, error: grokError } = await supabase.functions.invoke('grok-style-enhance', {
        body: { inputText }
      });

      if (grokError) {
        console.error('Grok function error:', grokError);
        throw new Error(`AI सुधार विफल: ${grokError.message}`);
      }

      if (!grokData || !grokData.enhancedText) {
        throw new Error('AI से कोई सुधारा गया पाठ प्राप्त नहीं हुआ');
      }

      const aiEnhancedText = grokData.enhancedText;
      onProgressUpdate?.(60, 'शब्दकोश लागू कर रहे हैं...');

      // Step 2: Dictionary Application (60-90%)
      const finalText = await applySimplifiedDictionaryCorrections(aiEnhancedText);
      onProgressUpdate?.(90, 'अंतिम सुधार...');

      // Step 3: Display (90-100%)
      setEnhancedText(finalText);
      onProgressUpdate?.(100, 'पूर्ण!');

      console.log(`Simplified style enhancement completed successfully`);

      return { enhancedText: finalText };
    } catch (error) {
      console.error('Simplified style processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate]);

  const resetStyleData = () => {
    setEnhancedText('');
  };

  return {
    processStyleEnhancement,
    isProcessing,
    enhancedText,
    resetStyleData
  };
};
