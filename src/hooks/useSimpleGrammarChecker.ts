import { useState, useCallback } from 'react';
import { callGrokGrammarCheckAPI } from '@/services/grammarApi';
import { applySimpleDictionaryCorrections } from '@/utils/simpleDictionaryCorrections';

interface UseSimpleGrammarCheckerProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

// Parse the structured response from Grok to extract just the corrected text
const parseGrokResponse = (response: string): string => {
  try {
    // Split response into lines and find the corrected text
    const lines = response.split('\n');
    
    // Look for the corrected text - it's usually the first substantial Hindi text
    for (const line of lines) {
      const cleanLine = line.trim();
      // Skip empty lines, headers, and formatting
      if (cleanLine.length > 20 && 
          !cleanLine.startsWith('**') && 
          !cleanLine.startsWith('-') && 
          !cleanLine.includes(':') &&
          /[\u0900-\u097F]/.test(cleanLine)) {
        return cleanLine;
      }
    }
    
    // Fallback: return the response without markdown formatting
    return response.replace(/\*\*.*?\*\*/g, '').trim();
  } catch (error) {
    console.warn('Error parsing Grok response:', error);
    return response.trim();
  }
};

export const useSimpleGrammarChecker = ({ onProgressUpdate }: UseSimpleGrammarCheckerProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [finalCorrectedText, setFinalCorrectedText] = useState('');

  const processText = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया सुधार के लिए कुछ पाठ लिखें');
    }

    setIsProcessing(true);
    setOriginalText(inputText);
    
    try {
      // Step 1: Grammar correction with Grok (0-50%)
      onProgressUpdate?.(10, 'Step 1: व्याकरण सुधार...');
      const grokResponse = await callGrokGrammarCheckAPI(inputText);
      const grammarCorrectedText = parseGrokResponse(grokResponse);
      
      onProgressUpdate?.(50, 'Step 2: शब्दकोश लागू किया जा रहा है...');
      
      // Step 2: Apply dictionary replacements directly (50-100%)
      const { correctedText: finalText } = applySimpleDictionaryCorrections(grammarCorrectedText);
      
      onProgressUpdate?.(100, 'पूर्ण!');
      
      // Brief delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFinalCorrectedText(finalText);
      
      return {
        originalText: inputText,
        finalCorrectedText: finalText,
        grammarCorrectedText
      };
    } catch (error) {
      console.error('Grammar processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate]);

  const resetText = () => {
    setOriginalText('');
    setFinalCorrectedText('');
  };

  return {
    processText,
    isProcessing,
    originalText,
    finalCorrectedText,
    resetText
  };
};