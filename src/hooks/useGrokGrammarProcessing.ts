
import { useState, useCallback } from 'react';
import { callGrokGrammarCheckAPI } from '@/services/grammarApi';
import { applyPreciseWordReplacements, validateReplacements } from '@/utils/preciseWordReplacements';

interface UseGrokGrammarProcessingProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

// Parse the structured response from Grok - simplified to preserve full text
const parseGrokResponse = (response: string): string => {
  try {
    console.log('Parsing Grok response, original length:', response.length);
    
    // Simply trim whitespace and return the full response
    // Grok 4 is returning the complete corrected text directly
    const cleanedResponse = response.trim();
    
    console.log('Parsed response length:', cleanedResponse.length);
    console.log('First 200 characters of parsed response:', cleanedResponse.substring(0, 200));
    
    return cleanedResponse;
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

    console.log('Starting grammar correction for text length:', inputText.length);
    setIsProcessing(true);
    
    try {
      // Stage 1: Grammar Correction with Grok (0-50%)
      onProgressUpdate?.(5, 'व्याकरण सुधार...');
      const grokResponse = await callGrokGrammarCheckAPI(inputText);
      
      // Parse the corrected text - now preserving full length
      const correctedText = parseGrokResponse(grokResponse);
      console.log('After parsing - corrected text length:', correctedText.length);
      onProgressUpdate?.(50, 'शब्दकोश लागू...');

      // Stage 2: Dictionary Application (50-100%)
      console.log('Starting precise dictionary application...');
      await validateReplacements(correctedText); // Validate before applying
      const { correctedText: textWithDictionary, corrections: dictionaryCorrections } = await applyPreciseWordReplacements(correctedText);
      console.log('After dictionary application - final text length:', textWithDictionary.length);
      onProgressUpdate?.(100, 'पूर्ण!');

      await new Promise(resolve => setTimeout(resolve, 300));

      setCorrectedText(textWithDictionary);
      setCorrections([]); // No corrections since we removed text comparison

      console.log('Grammar correction completed successfully');
      console.log('Final output length:', textWithDictionary.length);

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
