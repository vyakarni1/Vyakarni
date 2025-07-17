import { useState, useCallback } from 'react';
import { callGrokGrammarCheckAPI, callGrokDictionaryApplyAPI, callGrokTextComparisonAPI } from '@/services/grammarApi';
import { wordReplacements } from '@/data/wordReplacements';

interface UseGrokGrammarProcessingProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

// Parse the structured response from Grok
const parseGrokResponse = (response: string): string => {
  try {
    // Split response into corrected text and corrections list
    const parts = response.split('\n\n');
    
    // Find the first part that contains substantial Hindi text (corrected version)
    for (const part of parts) {
      const cleanPart = part.trim();
      // Look for Hindi text that's longer than a few words and doesn't start with bullet points or dashes
      if (cleanPart.length > 20 && 
          !cleanPart.startsWith('-') && 
          !cleanPart.startsWith('•') && 
          !cleanPart.includes(':') &&
          /[\u0900-\u097F]/.test(cleanPart)) {
        return cleanPart;
      }
    }
    
    // Fallback: return the first substantial part
    return parts[0]?.trim() || response.trim();
  } catch (error) {
    console.warn('Error parsing Grok response, using full response:', error);
    return response.trim();
  }
};

export const useGrokGrammarProcessing = ({ onProgressUpdate }: UseGrokGrammarProcessingProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState([]);

  const processGrammarCorrection = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया सुधार के लिए कुछ पाठ लिखें');
    }

    setIsProcessing(true);
    
    try {
      // Stage 1: Grammar Correction with Grok (0-50%)
      onProgressUpdate?.(5, 'व्याकरण सुधार...');
      const grokResponse = await callGrokGrammarCheckAPI(inputText);
      
      // Parse the corrected text
      const correctedText = parseGrokResponse(grokResponse);
      onProgressUpdate?.(50, 'शब्दकोश लागू...');

      // Stage 2: Dictionary Application (50-100%)
      const textWithDictionary = await callGrokDictionaryApplyAPI(correctedText, wordReplacements);
      onProgressUpdate?.(100, 'पूर्ण!');

      await new Promise(resolve => setTimeout(resolve, 300));

      setCorrectedText(textWithDictionary);
      setCorrections([]); // No corrections since we removed text comparison

      return {
        correctedText: textWithDictionary,
        corrections: []
      };
    } catch (error) {
      console.error('Grok grammar processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate]);

  const resetGrammarData = () => {
    setCorrectedText('');
    setCorrections([]);
  };

  return {
    processGrammarCorrection,
    isProcessing,
    correctedText,
    corrections,
    resetGrammarData
  };
};