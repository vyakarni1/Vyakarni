
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useAdvancedHighlighting } from "@/hooks/useAdvancedHighlighting";
import { useRestructuredGrammarProcessing } from "@/hooks/useRestructuredGrammarProcessing";
import { useStyleProcessing } from "@/hooks/useStyleProcessing";
import { useProgressManagement } from "@/hooks/useProgressManagement";
import { useTextOperations } from "@/hooks/useTextOperations";

export const useGrammarChecker = () => {
  const { trackUsage } = useUsageStats();
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const highlighting = useAdvancedHighlighting();
  
  const grammarProcessing = useRestructuredGrammarProcessing();
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
        
        // Stage 2: GPT Analysis  
        async () => {
          // Real progress updates handled via callback in processGrammarCorrection
        },

        // Stage 3: Dictionary Corrections
        async () => {
          // Real progress updates handled via callback in processGrammarCorrection
        },
        
        // Stage 4: Final processing with progress integration
        async () => {
          const progressCallback = (stage: number, progress: number) => {
            // Map internal processing stages to overall progress stages
            const stageMap = { 1: 1, 2: 2, 3: 3 }; // Maps to stages 2, 3, 4 in overall flow
            if (stageMap[stage]) {
              progressManagement.updateStageProgress(stageMap[stage], progress);
            }
          };
          
          await grammarProcessing.processGrammarCorrection(
            textOperations.inputText,
            trackUsage,
            trackWordUsage,
            progressCallback
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
          await new Promise(resolve => setTimeout(resolve, 500));
        },
        
        // Stage 2: GPT Style Enhancement
        async () => {
          // Real progress updates handled via callback in processStyleEnhancement
        },

        // Stage 3: Dictionary Application
        async () => {
          // Real progress updates handled via callback in processStyleEnhancement
        },
        
        // Stage 4: Final processing with progress integration
        async () => {
          const progressCallback = (stage: number, progress: number) => {
            // Map internal processing stages to overall progress stages
            const stageMap = { 1: 1, 2: 2, 3: 3 }; // Maps to stages 2, 3, 4 in overall flow
            if (stageMap[stage]) {
              progressManagement.updateStageProgress(stageMap[stage], progress);
            }
          };
          
          await styleProcessing.processStyleEnhancement(
            textOperations.inputText,
            trackUsage,
            trackWordUsage,
            progressCallback
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
