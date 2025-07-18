
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useOptimizedSubscription } from "./optimized/useOptimizedSubscription";
import { supabase } from '@/integrations/supabase/client';
import { applyFinalDictionaryCorrections } from '@/utils/finalDictionaryCorrections';
import { Correction } from "@/types/grammarChecker";

interface UseEnhancedGrammarCheckerProps {
  onProgressUpdate?: (progress: number, stage: string) => void;
}

export const useEnhancedGrammarChecker = ({ onProgressUpdate }: UseEnhancedGrammarCheckerProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [correctedText, setCorrectedText] = useState('');
  const [aiCorrections, setAiCorrections] = useState<Correction[]>([]);
  const [dictionaryCorrections, setDictionaryCorrections] = useState<Correction[]>([]);
  
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const { isSubscriptionActive } = useOptimizedSubscription();

  const processGrammarCorrection = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      throw new Error('कृपया सुधार के लिए कुछ पाठ लिखें');
    }

    // Determine user tier and word limits
    const userTier = isSubscriptionActive ? 'paid' : 'free';
    const wordLimit = userTier === 'paid' ? 1000 : 100;
    const wordCount = inputText.trim().split(/\s+/).length;

    // Check word limits
    if (wordCount > wordLimit) {
      toast.error(`शब्द सीमा पार हो गई! ${userTier === 'paid' ? 'प्रीमियम' : 'मुफ्त'} उपयोगकर्ता ${wordLimit} शब्दों तक सीमित हैं। आपके पाठ में ${wordCount} शब्द हैं।`);
      throw new Error(`Word limit exceeded: ${wordCount}/${wordLimit} words`);
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    console.log(`Starting 3-step grammar correction for ${wordCount} words (${userTier} user)`);
    setIsProcessing(true);
    
    try {
      // Step 1: AI Correction with Grok-3 (0-40%)
      onProgressUpdate?.(5, 'AI व्याकरण विश्लेषण...');
      
      const { data: grokData, error: grokError } = await supabase.functions.invoke('grok-grammar-check', {
        body: { 
          inputText,
          userTier
        }
      });

      if (grokError) {
        console.error('Grok function error:', grokError);
        throw new Error(`AI सुधार विफल: ${grokError.message}`);
      }

      if (!grokData || !grokData.correctedText) {
        throw new Error('AI से कोई सुधारा गया पाठ प्राप्त नहीं हुआ');
      }

      const { correctedText: aiCorrectedText, corrections: aiCorrs = [] } = grokData;
      
      onProgressUpdate?.(40, 'AI सुधार पूर्ण...');
      setAiCorrections(aiCorrs);

      // Step 2: Dictionary Application (40-80%)
      onProgressUpdate?.(50, 'शब्दकोश लागू कर रहे हैं...');
      
      const { correctedText: finalText, corrections: dictCorrs } = await applyFinalDictionaryCorrections(aiCorrectedText);
      
      onProgressUpdate?.(80, 'शब्दकोश सुधार पूर्ण...');
      setDictionaryCorrections(dictCorrs);

      // Step 3: Finalization (80-100%)
      onProgressUpdate?.(90, 'अंतिम सुधार...');
      
      setCorrectedText(finalText);
      
      onProgressUpdate?.(100, 'पूर्ण!');

      // Track usage after successful processing
      await trackWordUsage(inputText, 'grammar_correction');

      console.log(`Grammar correction completed successfully`);
      console.log(`AI corrections: ${aiCorrs.length}, Dictionary corrections: ${dictCorrs.length}`);

      return {
        correctedText: finalText,
        aiCorrections: aiCorrs,
        dictionaryCorrections: dictCorrs
      };
    } catch (error) {
      console.error('Enhanced grammar processing error:', error);
      
      // Show user-friendly error messages
      if (error.message.includes('Word limit exceeded')) {
        // Already handled above
        throw error;
      } else if (error.message.includes('XAI API key')) {
        toast.error('सिस्टम कॉन्फ़िगरेशन त्रुटि। कृपया बाद में पुनः प्रयास करें।');
        throw new Error('सिस्टम कॉन्फ़िगरेशन त्रुटि');
      } else if (error.message.includes('Grok API error')) {
        toast.error('AI सेवा अस्थायी रूप से अनुपलब्ध है। कृपया कुछ समय बाद पुनः प्रयास करें।');
        throw new Error('AI सेवा अनुपलब्ध');
      } else {
        toast.error('व्याकरण सुधार में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        throw error;
      }
    } finally {
      setIsProcessing(false);
    }
  }, [onProgressUpdate, checkAndEnforceWordLimit, trackWordUsage, isSubscriptionActive]);

  const resetGrammarData = () => {
    setCorrectedText('');
    setAiCorrections([]);
    setDictionaryCorrections([]);
  };

  const getAllCorrections = () => {
    return [...aiCorrections, ...dictionaryCorrections];
  };

  return {
    processGrammarCorrection,
    isProcessing,
    correctedText,
    aiCorrections,
    dictionaryCorrections,
    resetGrammarData,
    getAllCorrections
  };
};
