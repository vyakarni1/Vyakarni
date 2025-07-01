
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useEnhancedTextHighlighting } from "@/hooks/useEnhancedTextHighlighting";
import { useEnhancedGrammarProcessing } from "@/hooks/useEnhancedGrammarProcessing";
import { useStyleProcessing } from "@/hooks/useStyleProcessing";
import { useProgressManagement } from "@/hooks/useProgressManagement";
import { useTextOperations } from "@/hooks/useTextOperations";

export const useEnhancedGrammarChecker = () => {
  const { trackUsage } = useUsageStats();
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const highlighting = useEnhancedTextHighlighting();
  
  const grammarProcessing = useEnhancedGrammarProcessing();
  const styleProcessing = useStyleProcessing();
  const progressManagement = useProgressManagement();
  const textOperations = useTextOperations();

  const correctGrammar = async () => {
    if (!textOperations.validateInput(textOperations.inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(textOperations.inputText)) {
      return;
    }

    textOperations.setProcessingMode('grammar');
    progressManagement.startProgress('grammar');
    grammarProcessing.resetGrammarData();
    styleProcessing.resetStyleData();
    highlighting.clearHighlight();

    try {
      const stageCallbacks = [
        // Stage 1: Initial setup
        async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
        },
        
        // Stage 2-6: Enhanced Grammar processing stages
        async () => {
          await grammarProcessing.processEnhancedGrammarCorrection(
            textOperations.inputText,
            trackUsage,
            trackWordUsage
          );
        }
      ];

      progressManagement.runStagesWithProgress('grammar', stageCallbacks);

    } catch (error) {
      console.error('Error correcting grammar:', error);
      progressManagement.resetProgressState();
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
    progressManagement.startProgress('style');
    grammarProcessing.resetGrammarData();
    styleProcessing.resetStyleData();
    highlighting.clearHighlight();

    try {
      const stageCallbacks = [
        // Stage 1: Initial setup
        async () => {
          await new Promise(resolve => setTimeout(resolve, 800));
        },
        
        // Stage 2: Style processing
        async () => {
          await styleProcessing.processStyleEnhancement(
            textOperations.inputText,
            trackUsage,
            trackWordUsage
          );
        }
      ];

      progressManagement.runStagesWithProgress('style', stageCallbacks);

    } catch (error) {
      console.error('Error enhancing style:', error);
      progressManagement.resetProgressState();
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
    transformationTracker: grammarProcessing.transformationTracker,
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
