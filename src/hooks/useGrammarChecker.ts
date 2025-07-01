
import { useState } from 'react';
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useTextHighlighting } from "@/hooks/useTextHighlighting";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { extractStyleEnhancements } from "@/utils/textProcessing";
import { callGrammarCheckAPI, callStyleEnhanceAPI } from "@/services/grammarApi";
import { 
  createRealTimeProgressManager, 
  runStagesSequentially, 
  GRAMMAR_STAGES, 
  STYLE_STAGES,
  resetProgress 
} from "@/utils/progressUtils";
import { applyDictionaryCorrections } from "@/utils/dictionaryCorrections";
import { applyFinalDictionaryCorrections, verifyCorrections } from "@/utils/finalDictionaryCorrections";

const MAX_WORD_LIMIT = 1000;

export const useGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const { trackUsage } = useUsageStats();
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  
  // Add highlighting functionality
  const highlighting = useTextHighlighting();

  const checkWordLimit = (text: string): boolean => {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount > MAX_WORD_LIMIT) {
      toast.error(
        `शब्द सीमा पार हो गई! अधिकतम ${MAX_WORD_LIMIT} शब्द की अनुमति है। वर्तमान में ${wordCount} शब्द हैं।`,
        {
          duration: 5000,
        }
      );
      return false;
    }
    
    return true;
  };

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    if (!checkWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('grammar');
    setProgress(0);
    setCurrentStage('');
    setCorrectedText('');
    setCorrections([]);
    highlighting.clearHighlight();

    // Create real-time progress manager
    const progressManager = createRealTimeProgressManager(
      GRAMMAR_STAGES,
      setProgress,
      setCurrentStage
    );

    try {
      console.log('=== 4-STEP GRAMMAR CORRECTION PROCESS START ===');
      console.log('Original input text:', inputText);
      console.log('Input text length:', inputText.length);
      
      let step1Text: string;
      let step1Corrections: any[];
      let gptResult: any;
      let step3Text: string;
      let step3Corrections: any[];
      let finalText: string;
      let finalCorrections: any[];

      // Define stage callbacks
      const stageCallbacks = [
        // Stage 1: Initial setup
        async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
        },
        
        // Stage 2: Dictionary corrections on input
        async () => {
          const result = applyDictionaryCorrections(inputText);
          step1Text = result.correctedText;
          step1Corrections = result.corrections;
          console.log('\n=== STEP 1: Dictionary corrections on input ===');
          console.log('Step 1 input:', inputText);
          console.log('Step 1 output:', step1Text);
          console.log('Step 1 corrections found:', step1Corrections.length);
        },
        
        // Stage 3: GPT analysis
        async () => {
          console.log('\n=== STEP 2: GPT analysis on dictionary-corrected text ===');
          console.log('Sending to GPT:', step1Text);
          gptResult = await callGrammarCheckAPI(step1Text);
          console.log('GPT input:', step1Text);
          console.log('GPT output:', gptResult.correctedText);
          console.log('GPT corrections found:', gptResult.corrections.length);
        },
        
        // Stage 4: Dictionary corrections on GPT output
        async () => {
          console.log('\n=== STEP 3: Dictionary corrections on GPT output ===');
          const result = applyDictionaryCorrections(gptResult.correctedText);
          step3Text = result.correctedText;
          step3Corrections = result.corrections;
          console.log('Step 3 input:', gptResult.correctedText);
          console.log('Step 3 output:', step3Text);
          console.log('Step 3 corrections found:', step3Corrections.length);
        },
        
        // Stage 5: Final dictionary pass
        async () => {
          console.log('\n=== STEP 4: FINAL DICTIONARY PASS (NEW ROBUST METHOD) ===');
          const result = applyFinalDictionaryCorrections(step3Text);
          finalText = result.correctedText;
          finalCorrections = result.corrections;
          console.log('Step 4 input:', step3Text);
          console.log('Step 4 output:', finalText);
          console.log('Step 4 corrections found:', finalCorrections.length);
        },
        
        // Stage 6: Finalization
        async () => {
          console.log('\n=== FINAL TEXT VERIFICATION ===');
          verifyCorrections(finalText);
          
          setCorrectedText(finalText);
          
          const allCorrections = [
            ...step1Corrections.map(correction => ({ 
              ...correction, 
              source: 'dictionary' as const,
              step: 'step1'
            })),
            ...gptResult.corrections.map(correction => ({ 
              ...correction, 
              source: 'gpt' as const,
              step: 'step2'
            })),
            ...step3Corrections.map(correction => ({ 
              ...correction, 
              source: 'dictionary' as const,
              step: 'step3'
            })),
            ...finalCorrections.map(correction => ({ 
              ...correction, 
              source: 'dictionary' as const,
              step: 'step4'
            }))
          ];
          
          console.log('\n=== FINAL RESULTS SUMMARY ===');
          console.log('Original text:', inputText);
          console.log('Final corrected text:', finalText);
          console.log('Text changed overall:', finalText !== inputText);
          console.log('Total corrections:', allCorrections.length);
          console.log('All corrections combined:', allCorrections);
          
          setCorrections(allCorrections);
          
          await trackUsage('grammar_check');
          await trackWordUsage(inputText, 'grammar_check');
          
          console.log('=== 4-STEP GRAMMAR CORRECTION PROCESS COMPLETE ===');
          toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
        }
      ];

      // Run stages sequentially with real-time progress
      runStagesSequentially(progressManager, stageCallbacks, () => {
        setIsLoading(false);
        setCurrentStage('');
      });

    } catch (error) {
      console.error('Error correcting grammar:', error);
      setIsLoading(false);
      resetProgress(setProgress);
      setCurrentStage('');
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const enhanceStyle = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    if (!checkWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    setIsLoading(true);
    setProcessingMode('style');
    setProgress(0);
    setCurrentStage('');
    setEnhancedText('');
    setCorrections([]);
    highlighting.clearHighlight();

    // Create real-time progress manager for style enhancement
    const progressManager = createRealTimeProgressManager(
      STYLE_STAGES,
      setProgress,
      setCurrentStage
    );

    try {
      let enhanced: string;
      let styleEnhancements: any[];

      // Define stage callbacks for style enhancement
      const stageCallbacks = [
        // Stage 1: Initial setup and preparation
        async () => {
          await new Promise(resolve => setTimeout(resolve, 800));
        },
        
        // Stage 2: Style analysis and enhancement
        async () => {
          enhanced = await callStyleEnhanceAPI(inputText);
          styleEnhancements = extractStyleEnhancements(inputText, enhanced);
        },
        
        // Stage 3: Finalization
        async () => {
          setEnhancedText(enhanced);
          setCorrections(styleEnhancements);
          
          await trackUsage('style_enhance');
          await trackWordUsage(inputText, 'style_enhance');
          
          toast.success(`शैली सुधार पूरा हो गया! ${styleEnhancements.length} सुधार मिले।`);
        }
      ];

      // Run stages sequentially with real-time progress
      runStagesSequentially(progressManager, stageCallbacks, () => {
        setIsLoading(false);
        setCurrentStage('');
      });

    } catch (error) {
      console.error('Error enhancing style:', error);
      setIsLoading(false);
      resetProgress(setProgress);
      setCurrentStage('');
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setEnhancedText('');
    setProgress(0);
    setCurrentStage('');
    setCorrections([]);
    setProcessingMode('grammar');
    highlighting.clearHighlight();
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
    currentStage,
    corrections,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    getCurrentProcessedText,
    highlighting
  };
};
