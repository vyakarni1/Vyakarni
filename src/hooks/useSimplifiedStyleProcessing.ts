
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { applyStyleEnhancementDictionaryCorrections } from '@/utils/styleEnhancementDictionaryCorrections';
import { useWordLimits } from './useWordLimits';
import { useTextHistory } from './useTextHistory';

interface UseSimplifiedStyleProcessingProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

export const useSimplifiedStyleProcessing = ({ onProgressUpdate }: UseSimplifiedStyleProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const { saveTextCorrection } = useTextHistory();

  const processStyleEnhancement = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया शैली सुधार के लिए कुछ पाठ लिखें');
    }

    // Check word limits before processing
    if (!checkAndEnforceWordLimit(inputText)) {
      throw new Error('शब्द सीमा पार हो गई या पर्याप्त बैलेंस नहीं है');
    }

    console.log(`Starting simplified style enhancement`);
    setIsProcessing(true);
    
    try {
      // Calculate word count for tracking
      const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      // Step 1: Vyakarni Processing (0-60%)
      onProgressUpdate?.(20, 'Vyakarni से शैली सुधार...');
      
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

      // Step 2: Style Dictionary Application (60-90%)
      const finalText = await applyStyleEnhancementDictionaryCorrections(aiEnhancedText);
      onProgressUpdate?.(90, 'अंतिम सुधार...');

      // Step 3: Track word usage and save text history
      await trackWordUsage(inputText, 'style_enhancement');
      
      // Save text correction to history
      const textHistoryId = await saveTextCorrection({
        originalText: inputText,
        correctedText: finalText,
        processingType: 'style',
        correctionsData: [], // Will be populated by comparison function
        wordsUsed: wordCount,
      });

      // Step 4: Display (90-100%)
      setEnhancedText(finalText);
      onProgressUpdate?.(100, 'पूर्ण!');

      console.log(`Simplified style enhancement completed successfully`);

      return { enhancedText: finalText, textHistoryId };
    } catch (error) {
      console.error('Simplified style processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate, checkAndEnforceWordLimit, trackWordUsage, saveTextCorrection]);

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
