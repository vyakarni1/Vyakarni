
import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { supabase } from "@/integrations/supabase/client";
import { Correction } from "@/types/grammarChecker";
import { wordReplacements } from "@/data/wordReplacements";

export const useGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const { trackUsage } = useUsageStats();

  const extractCorrectionsFromResponse = (original: string, corrected: string): Correction[] => {
    const foundCorrections: Correction[] = [];

    // First, add word replacement corrections
    const { appliedCorrections } = applyWordReplacements(original);
    foundCorrections.push(...appliedCorrections);

    // Split texts into words for comparison
    const originalWords = original.toLowerCase().split(/\s+/);
    const correctedWords = corrected.toLowerCase().split(/\s+/);

    // Find differences between original and corrected text
    const minLength = Math.min(originalWords.length, correctedWords.length);
    for (let i = 0; i < minLength; i++) {
      if (originalWords[i] !== correctedWords[i]) {
        // Skip if already covered by word replacements
        const alreadyCovered = foundCorrections.some(c => 
          originalWords[i].includes(c.incorrect.toLowerCase()) || 
          correctedWords[i].includes(c.correct.toLowerCase())
        );
        if (!alreadyCovered) {
          foundCorrections.push({
            incorrect: originalWords[i],
            correct: correctedWords[i],
            reason: `व्याकरण सुधार: "${originalWords[i]}" को "${correctedWords[i]}" से बदला गया`,
            type: 'grammar'
          });
        }
      }
    }

    // Check for additional words in corrected text
    if (correctedWords.length > originalWords.length) {
      for (let i = minLength; i < correctedWords.length; i++) {
        foundCorrections.push({
          incorrect: '[अनुपस्थित]',
          correct: correctedWords[i],
          reason: 'वाक्य पूर्णता के लिए शब्द जोड़ा गया',
          type: 'syntax'
        });
      }
    }

    // Check for removed words
    if (originalWords.length > correctedWords.length) {
      for (let i = minLength; i < originalWords.length; i++) {
        foundCorrections.push({
          incorrect: originalWords[i],
          correct: '[हटाया गया]',
          reason: 'अनावश्यक शब्द हटाया गया',
          type: 'syntax'
        });
      }
    }
    return foundCorrections;
  };

  const applyWordReplacements = (text: string): {
    correctedText: string;
    appliedCorrections: Correction[];
  } => {
    let correctedText = text;
    const appliedCorrections: Correction[] = [];
    
    wordReplacements.forEach(({ original, replacement }) => {
      if (correctedText.includes(original)) {
        correctedText = correctedText.replace(new RegExp(original, 'g'), replacement);
        appliedCorrections.push({
          incorrect: original,
          correct: replacement,
          reason: `सही वर्तनी के लिए "${original}" को "${replacement}" से बदला गया`,
          type: 'spelling'
        });
      }
    });
    
    return { correctedText, appliedCorrections };
  };

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const { data, error } = await supabase.functions.invoke('grammar-check', {
        body: {
          inputText,
          wordReplacements
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error('Grammar correction failed');
      }

      const aiCorrected = data.correctedText;
      setProgress(100);
      setCorrectedText(aiCorrected);

      // Extract all corrections from the comparison
      const allCorrections = extractCorrectionsFromResponse(inputText, aiCorrected);
      setCorrections(allCorrections);
      setIsLoading(false);
      clearInterval(progressInterval);
      
      // Track usage after successful correction
      await trackUsage('grammar_check');
      
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
    } catch (error) {
      console.error('Error correcting grammar:', error);
      setIsLoading(false);
      setProgress(0);
      clearInterval(progressInterval);
      toast.error("कुछ गलत हुआ है। कृपया फिर से कोशिश करें।");
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setProgress(0);
    setCorrections([]);
  };

  const copyToClipboard = async () => {
    if (correctedText) {
      await navigator.clipboard.writeText(correctedText);
      toast.success("टेक्स्ट कॉपी किया गया!");
    }
  };

  return {
    inputText,
    setInputText,
    correctedText,
    isLoading,
    progress,
    corrections,
    correctGrammar,
    resetText,
    copyToClipboard
  };
};
