import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { supabase } from "@/integrations/supabase/client";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { wordReplacements } from "@/data/wordReplacements";

export const useGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');
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

  const extractStyleEnhancements = (original: string, enhanced: string): Correction[] => {
    const enhancements: Correction[] = [];
    
    // Simple word-level comparison for style enhancements
    const originalWords = original.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const enhancedWords = enhanced.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    let originalIndex = 0;
    let enhancedIndex = 0;

    while (originalIndex < originalWords.length && enhancedIndex < enhancedWords.length) {
      const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
      const enhancedWord = enhancedWords[enhancedIndex].replace(/[।\.\!\?,;:]/g, '');

      if (originalWord !== enhancedWord && originalWord.length > 0 && enhancedWord.length > 0) {
        enhancements.push({
          incorrect: originalWord,
          correct: enhancedWord,
          reason: `शैली सुधार: "${originalWord}" को अधिक प्रभावी "${enhancedWord}" से बदला गया`,
          type: 'vocabulary'
        });
      }
      originalIndex++;
      enhancedIndex++;
    }

    return enhancements;
  };

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    setIsLoading(true);
    setProcessingMode('grammar');
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

  const enhanceStyle = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    setIsLoading(true);
    setProcessingMode('style');
    setProgress(0);
    setEnhancedText('');
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
      console.log('Sending text for style enhancement:', inputText);
      
      const { data, error } = await supabase.functions.invoke('style-enhance', {
        body: { inputText }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Style enhancement failed: ${error.message}`);
      }

      if (!data || !data.enhancedText) {
        throw new Error('No enhanced text received from the API');
      }

      const enhanced = data.enhancedText;
      console.log('Received enhanced text:', enhanced);
      
      setProgress(100);
      setEnhancedText(enhanced);

      // Extract style enhancements
      const styleEnhancements = extractStyleEnhancements(inputText, enhanced);
      setCorrections(styleEnhancements);
      
      clearInterval(progressInterval);
      setIsLoading(false);
      
      // Track usage after successful enhancement
      await trackUsage('style_enhance');
      
      toast.success(`शैली सुधार पूरा हो गया! ${styleEnhancements.length} सुधार मिले।`);
    } catch (error) {
      console.error('Error enhancing style:', error);
      setIsLoading(false);
      setProgress(0);
      clearInterval(progressInterval);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setEnhancedText('');
    setProgress(0);
    setCorrections([]);
    setProcessingMode('grammar');
  };

  const copyToClipboard = async () => {
    const textToCopy = processingMode === 'style' ? enhancedText : correctedText;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("टेक्स्ट कॉपी किया गया!");
    }
  };

  const getCurrentProcessedText = () => {
    return processingMode === 'style' ? enhancedText : correctedText;
  };

  return {
    inputText,
    setInputText,
    correctedText,
    enhancedText,
    isLoading,
    processingMode,
    progress,
    corrections,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    getCurrentProcessedText
  };
};
