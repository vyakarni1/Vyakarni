
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { applySimplifiedDictionaryCorrections } from '@/utils/simplifiedDictionaryCorrections';
import { useWordLimits } from './useWordLimits';
import { useTextHistory } from './useTextHistory';

interface UseSimplifiedGrammarCheckerProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

export const useSimplifiedGrammarChecker = ({ onProgressUpdate }: UseSimplifiedGrammarCheckerProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const { saveTextCorrection } = useTextHistory();

  const processGrammarCorrection = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया सुधार के लिए कुछ पाठ लिखें');
    }

    // Check word limits before processing
    if (!checkAndEnforceWordLimit(inputText)) {
      throw new Error('शब्द सीमा पार हो गई या पर्याप्त बैलेंस नहीं है');
    }

    console.log(`Starting simplified grammar correction`);
    setIsProcessing(true);
    
    try {
      // Calculate word count for tracking
      const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      // Step 1: Vyakarni Processing (0-60%)
      onProgressUpdate?.(20, 'व्याकरणी से व्याकरण सुधार...');
      
      const { data: grokData, error: grokError } = await supabase.functions.invoke('grok-grammar-check', {
        body: { inputText }
      });

      if (grokError) {
        console.error('Grok function error:', grokError);
        throw new Error(`AI सुधार विफल: ${grokError.message}`);
      }

      if (!grokData || !grokData.correctedText) {
        throw new Error('AI से कोई सुधारा गया पाठ प्राप्त नहीं हुआ');
      }

      const aiCorrectedText = grokData.correctedText;
      onProgressUpdate?.(60, 'शब्दकोश लागू कर रहे हैं...');

      // Step 2: Dictionary Application (60-90%)
      const finalText = await applySimplifiedDictionaryCorrections(aiCorrectedText);
      onProgressUpdate?.(90, 'अंतिम सुधार...');

      // Step 3: Track word usage and save text history
      await trackWordUsage(inputText, 'grammar_check');
      
      // Save text correction to history
      const textHistoryId = await saveTextCorrection({
        originalText: inputText,
        correctedText: finalText,
        processingType: 'grammar',
        correctionsData: [], // Will be populated by comparison function
        wordsUsed: wordCount,
      });

      // Step 4: Display (90-100%)
      setCorrectedText(finalText);
      onProgressUpdate?.(100, 'पूर्ण!');

      console.log(`Simplified grammar correction completed successfully`);

      return { correctedText: finalText, textHistoryId };
    } catch (error) {
      console.error('Simplified grammar processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate, checkAndEnforceWordLimit, trackWordUsage, saveTextCorrection]);

  const resetGrammarData = () => {
    setCorrectedText('');
  };

  return {
    processGrammarCorrection,
    isProcessing,
    correctedText,
    resetGrammarData
  };
};
