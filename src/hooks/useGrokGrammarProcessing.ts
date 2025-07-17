
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
      
      // Extract corrected text and AI corrections
      const correctedText = grokResponse.correctedText;
      const aiCorrections = grokResponse.corrections.map((correction: any) => ({
        ...correction,
        source: 'gpt',
        type: correction.type === 'word_selection' ? 'vocabulary' : correction.type
      }));
      
      console.log('After parsing - corrected text length:', correctedText.length);
      console.log('AI corrections found:', aiCorrections.length);
      onProgressUpdate?.(50, 'शब्दकोश लागू...');

      // Stage 2: Dictionary Application (50-100%)
      console.log('Starting precise dictionary application...');
      validateReplacements(correctedText); // Validate before applying
      const { correctedText: textWithDictionary, corrections: dictionaryCorrections } = applyPreciseWordReplacements(correctedText);
      console.log('After dictionary application - final text length:', textWithDictionary.length);
      onProgressUpdate?.(100, 'पूर्ण!');

      await new Promise(resolve => setTimeout(resolve, 300));

      // Combine AI corrections and dictionary corrections
      const allCorrections = [...aiCorrections, ...dictionaryCorrections];
      
      setCorrectedText(textWithDictionary);
      setCorrections(allCorrections);

      console.log('Grammar correction completed successfully');
      console.log('Final output length:', textWithDictionary.length);
      console.log('Total corrections:', allCorrections.length);

      return {
        correctedText: textWithDictionary,
        corrections: allCorrections
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
