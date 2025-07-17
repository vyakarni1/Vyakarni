
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useAdvancedHighlighting } from "@/hooks/useAdvancedHighlighting";
import { useGrokGrammarProcessing } from "@/hooks/useGrokGrammarProcessing";
import { useGrokStyleProcessing } from "@/hooks/useGrokStyleProcessing";
import { useProgressManagement } from "@/hooks/useProgressManagement";
import { useTextOperations } from "@/hooks/useTextOperations";

export const useGrammarChecker = () => {
  const { trackUsage } = useUsageStats();
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const highlighting = useAdvancedHighlighting();
  
  const progressManagement = useProgressManagement();
  const textOperations = useTextOperations();
  
  const grammarProcessing = useGrokGrammarProcessing({
    onProgressUpdate: progressManagement.updateProgress
  });
  const styleProcessing = useGrokStyleProcessing({
    onProgressUpdate: progressManagement.updateProgress
  });

  const correctGrammar = async () => {
    if (!textOperations.validateInput(textOperations.inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(textOperations.inputText)) {
      return;
    }

    textOperations.setProcessingMode('grammar');
    
    try {
      const result = await grammarProcessing.processGrammarCorrection(textOperations.inputText);
      
      if (result) {
        // Track usage after successful processing
        trackUsage('correction');
        trackWordUsage(textOperations.inputText, 'grammar_correction');
        
        // Results are automatically set in the hook state
        
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

    if (!checkAndEnforceWordLimit(textOperations.inputText)) {
      return;
    }

    textOperations.setProcessingMode('style');
    
    try {
      const result = await styleProcessing.processStyleEnhancement(textOperations.inputText);
      
      if (result) {
        // Track usage after successful processing
        trackUsage('enhancement');
        trackWordUsage(textOperations.inputText, 'style_enhancement');
        
        // Results are automatically set in the hook state
        
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
    highlighting.clearHighlight();
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

  // Get current corrections based on processing mode
  const currentCorrections = textOperations.processingMode === 'style' 
    ? styleProcessing.corrections 
    : grammarProcessing.corrections;

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
    corrections: currentCorrections,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    getCurrentProcessedText,
    highlighting,
    wordCount,
    charCount
  };
};
