import { useState, useCallback } from 'react';
import { callGrokStyleEnhanceAPI, callGrokDictionaryApplyAPI, callGrokTextComparisonAPI } from '@/services/grammarApi';
import { dictionaryService } from '@/services/dictionaryService';

interface UseGrokStyleProcessingProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

export const useGrokStyleProcessing = ({ onProgressUpdate }: UseGrokStyleProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  const [corrections, setCorrections] = useState([]);

  const processStyleEnhancement = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया शैली सुधार के लिये कुछ पाठ लिखें');
    }

    setIsProcessing(true);
    
    try {
      // Stage 1: Initial Setup (0-15%)
      onProgressUpdate?.(5, 'प्रारंभिक सेटअप...');
      await new Promise(resolve => setTimeout(resolve, 300));
      onProgressUpdate?.(15, 'Grok 3 के साथ शैली सुधार...');

      // Stage 2: Style Enhancement with Grok (15-50%)
      const enhancedText = await callGrokStyleEnhanceAPI(inputText);
      onProgressUpdate?.(50, 'शब्दकोश लागू किया जा रहा है...');

      // Stage 3: Dictionary Application (50-80%)
      const dictionary = await dictionaryService.getDictionary();
      const textWithDictionary = await callGrokDictionaryApplyAPI(enhancedText, dictionary);
      onProgressUpdate?.(80, 'तुलना और हाइलाइटिंग तैयार की जा रही है...');

      // Stage 4: Text Comparison for Highlighting (80-100%)
      const corrections = await callGrokTextComparisonAPI(inputText, textWithDictionary, 'style_enhance');
      onProgressUpdate?.(100, 'पूर्ण!');

      await new Promise(resolve => setTimeout(resolve, 500));

      setEnhancedText(textWithDictionary);
      setCorrections(corrections);

      return {
        enhancedText: textWithDictionary,
        corrections
      };
    } catch (error) {
      console.error('Grok style processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate]);

  const resetStyleData = () => {
    setEnhancedText('');
    setCorrections([]);
  };

  return {
    processStyleEnhancement,
    isProcessing,
    enhancedText,
    corrections,
    resetStyleData
  };
};