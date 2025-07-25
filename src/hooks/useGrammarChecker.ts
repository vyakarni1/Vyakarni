import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useProgressManagement } from "@/hooks/useProgressManagement";
import { useTextOperations } from "@/hooks/useTextOperations";
import { useSimplifiedGrammarChecker } from "@/hooks/useSimplifiedGrammarChecker";
import { useSimplifiedStyleProcessing } from "@/hooks/useSimplifiedStyleProcessing";
import { callGrokTextComparisonAPI } from "@/services/grammarApi";
import { useState } from "react";
import { Correction } from "@/types/grammarChecker";

export const useGrammarChecker = () => {
  const { trackUsage } = useUsageStats();
  const [corrections, setCorrections] = useState<Correction[]>([]);
  
  const progressManagement = useProgressManagement();
  const textOperations = useTextOperations();
  
  const grammarProcessing = useSimplifiedGrammarChecker({
    onProgressUpdate: progressManagement.updateProgress
  });
  
  const styleProcessing = useSimplifiedStyleProcessing({
    onProgressUpdate: progressManagement.updateProgress
  });

  const generateCorrections = async (originalText: string, processedText: string, processingType: string, textHistoryId?: string) => {
    try {
      progressManagement.updateProgress(85, 'सुधार विश्लेषण');
      
      // Validate that both texts are available
      if (!originalText || !processedText) {
        console.warn('Cannot generate corrections: missing text', { originalText: !!originalText, processedText: !!processedText });
        setCorrections([]);
        progressManagement.updateProgress(100, 'पूर्ण!');
        return;
      }
      
      // Skip if texts are identical
      if (originalText.trim() === processedText.trim()) {
        console.log('Texts are identical, no corrections needed');
        setCorrections([]);
        progressManagement.updateProgress(100, 'पूर्ण!');
        return;
      }
      
      console.log('Generating corrections comparison:', { 
        originalLength: originalText.length, 
        processedLength: processedText.length,
        processingType,
        textHistoryId
      });
      
      const correctionData = await callGrokTextComparisonAPI(
        originalText, 
        processedText, 
        processingType,
        textHistoryId
      );
      
      setCorrections(correctionData || []);
      progressManagement.updateProgress(100, 'पूर्ण!');
      
      console.log('Generated corrections:', correctionData);
    } catch (error) {
      console.error('Error generating corrections:', error);
      // Don't show error toast for corrections as it's supplementary
      setCorrections([]);
      progressManagement.updateProgress(100, 'पूर्ण!');
    }
  };

  const correctGrammar = async () => {
    if (!textOperations.validateInput(textOperations.inputText)) {
      return;
    }

    textOperations.setProcessingMode('grammar');
    setCorrections([]); // Reset corrections
    
    try {
      const result = await grammarProcessing.processGrammarCorrection(textOperations.inputText);
      
      if (result) {
        // Track usage after successful processing
        trackUsage('correction');
        
        // Generate corrections comparison using the actual result text
        await generateCorrections(
          textOperations.inputText,
          result.correctedText,
          'grammar_check',
          result.textHistoryId
        );
        
        toast.success("व्याकरण सुधार पूर्ण हुआ!");
      }
    } catch (error) {
      console.error('Error correcting grammar:', error);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const enhanceStyle = async () => {
    if (!textOperations.validateInput(textOperations.inputText)) {
      return;
    }

    textOperations.setProcessingMode('style');
    setCorrections([]); // Reset corrections
    
    try {
      const result = await styleProcessing.processStyleEnhancement(textOperations.inputText);
      
      if (result) {
        // Track usage after successful processing
        trackUsage('enhancement');
        
        // Generate corrections comparison using the actual result text
        await generateCorrections(
          textOperations.inputText,
          result.enhancedText,
          'style_enhance',
          result.textHistoryId
        );
        
        toast.success("शैली सुधार पूर्ण हुआ!");
      }
    } catch (error) {
      console.error('Error enhancing style:', error);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const resetText = () => {
    textOperations.resetTextData();
    grammarProcessing.resetGrammarData();
    styleProcessing.resetStyleData();
    progressManagement.resetProgressState();
    setCorrections([]); // Reset corrections
  };

  const copyToClipboard = async () => {
    const textToCopy = textOperations.processingMode === 'style' 
      ? styleProcessing.enhancedText 
      : grammarProcessing.correctedText;
    await textOperations.copyToClipboard(textToCopy);
  };

  const getCurrentProcessedText = () => {
    return textOperations.processingMode === 'style' 
      ? styleProcessing.enhancedText 
      : grammarProcessing.correctedText;
  };

  const wordCount = textOperations.getWordCount(textOperations.inputText);
  const charCount = textOperations.getCharCount(textOperations.inputText);

  return {
    inputText: textOperations.inputText,
    setInputText: textOperations.setInputText,
    correctedText: grammarProcessing.correctedText,
    enhancedText: styleProcessing.enhancedText,
    corrections,
    isLoading: progressManagement.isLoading,
    processingMode: textOperations.processingMode,
    progress: progressManagement.progress,
    currentStage: progressManagement.currentStage,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    getCurrentProcessedText,
    highlighting: { // Empty highlighting object for compatibility
      segments: [],
      highlightedIndex: null,
      highlightCorrection: () => {},
      clearHighlight: () => {}
    },
    wordCount,
    charCount
  };
};
