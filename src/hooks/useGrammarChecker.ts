
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useProgressManagement } from "@/hooks/useProgressManagement";
import { useTextOperations } from "@/hooks/useTextOperations";
import { useSimplifiedGrammarChecker } from "@/hooks/useSimplifiedGrammarChecker";
import { useSimplifiedStyleProcessing } from "@/hooks/useSimplifiedStyleProcessing";

export const useGrammarChecker = () => {
  const { trackUsage } = useUsageStats();
  
  const progressManagement = useProgressManagement();
  const textOperations = useTextOperations();
  
  const grammarProcessing = useSimplifiedGrammarChecker({
    onProgressUpdate: progressManagement.updateProgress
  });
  
  const styleProcessing = useSimplifiedStyleProcessing({
    onProgressUpdate: progressManagement.updateProgress
  });

  const correctGrammar = async () => {
    if (!textOperations.validateInput(textOperations.inputText)) {
      return;
    }

    textOperations.setProcessingMode('grammar');
    
    try {
      const result = await grammarProcessing.processGrammarCorrection(textOperations.inputText);
      
      if (result) {
        // Track usage after successful processing
        trackUsage('correction');
        
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
    
    try {
      const result = await styleProcessing.processStyleEnhancement(textOperations.inputText);
      
      if (result) {
        // Track usage after successful processing
        trackUsage('enhancement');
        
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
    isLoading: progressManagement.isLoading,
    processingMode: textOperations.processingMode,
    progress: progressManagement.progress,
    currentStage: progressManagement.currentStage,
    corrections: [], // No corrections tracking in simplified version
    aiCorrections: [], // No AI corrections tracking
    dictionaryCorrections: [], // No dictionary corrections tracking
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    getCurrentProcessedText,
    highlighting: { // Empty highlighting object
      segments: [],
      highlightedIndex: null,
      highlightCorrection: () => {},
      clearHighlight: () => {}
    },
    wordCount,
    charCount
  };
};
