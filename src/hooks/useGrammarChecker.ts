
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

    // Split texts into sentences for better comparison
    const originalSentences = original.split(/[।\.\!\?]+/).filter(s => s.trim());
    const correctedSentences = corrected.split(/[।\.\!\?]+/).filter(s => s.trim());

    // Compare words across the entire text
    const originalWords = original.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const correctedWords = corrected.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    let originalIndex = 0;
    let correctedIndex = 0;

    while (originalIndex < originalWords.length && correctedIndex < correctedWords.length) {
      const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
      const correctedWord = correctedWords[correctedIndex].replace(/[।\.\!\?,;:]/g, '');

      if (originalWord !== correctedWord) {
        // Skip if already covered by word replacements
        const alreadyCovered = foundCorrections.some(c => 
          originalWord.includes(c.incorrect.toLowerCase()) || 
          correctedWord.includes(c.correct.toLowerCase())
        );
        
        if (!alreadyCovered && originalWord.length > 0 && correctedWord.length > 0) {
          foundCorrections.push({
            incorrect: originalWord,
            correct: correctedWord,
            reason: `व्याकरण सुधार: "${originalWord}" को "${correctedWord}" से बदला गया`,
            type: 'grammar'
          });
        }
      }
      originalIndex++;
      correctedIndex++;
    }

    // Check for additional words in corrected text
    while (correctedIndex < correctedWords.length) {
      const correctedWord = correctedWords[correctedIndex].replace(/[।\.\!\?,;:]/g, '');
      if (correctedWord.length > 0) {
        foundCorrections.push({
          incorrect: '[अनुपस्थित]',
          correct: correctedWord,
          reason: 'वाक्य पूर्णता के लिए शब्द जोड़ा गया',
          type: 'syntax'
        });
      }
      correctedIndex++;
    }

    // Check for removed words
    while (originalIndex < originalWords.length) {
      const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
      if (originalWord.length > 0) {
        foundCorrections.push({
          incorrect: originalWord,
          correct: '[हटाया गया]',
          reason: 'अनावश्यक शब्द हटाया गया',
          type: 'syntax'
        });
      }
      originalIndex++;
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
      const regex = new RegExp(original, 'g');
      if (regex.test(correctedText)) {
        correctedText = correctedText.replace(regex, replacement);
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
    setCorrectedText('');
    setCorrections([]);

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
      console.log('Sending text for correction:', inputText);
      
      const { data, error } = await supabase.functions.invoke('grammar-check', {
        body: {
          inputText,
          wordReplacements
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Grammar correction failed: ${error.message}`);
      }

      if (!data || !data.correctedText) {
        throw new Error('No corrected text received from the API');
      }

      const aiCorrected = data.correctedText;
      console.log('Received corrected text:', aiCorrected);
      
      setProgress(100);
      setCorrectedText(aiCorrected);

      // Extract all corrections from the comparison
      const allCorrections = extractCorrectionsFromResponse(inputText, aiCorrected);
      setCorrections(allCorrections);
      
      clearInterval(progressInterval);
      setIsLoading(false);
      
      // Track usage after successful correction
      await trackUsage('grammar_check');
      
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
    } catch (error) {
      console.error('Error correcting grammar:', error);
      setIsLoading(false);
      setProgress(0);
      clearInterval(progressInterval);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
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
