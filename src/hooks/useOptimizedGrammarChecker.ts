import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { callGrammarCheckAPI, callStyleEnhanceAPI } from '@/services/grammarApi';
import { useWordLimits } from './useWordLimits';
import { useUsageStats } from "./useUsageStats";
import { useTextHighlighting } from "./useTextHighlighting";
import { usePerformanceTracking } from './usePerformanceTracking';
import { apiCache } from '@/services/cacheManager';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorLogger } from '@/services/ErrorLogger';
import { logger } from '@/utils/logger';
import { Correction, ProcessingMode } from '@/types/grammarChecker';
import { extractStyleEnhancements } from "@/utils/textProcessing";
import { createProgressSimulator, completeProgress, resetProgress } from "@/utils/progressUtils";
import { applyInitialDictionaryCorrections, applyFinalDictionaryCorrections, verifyCorrections } from "@/utils/dictionaryProcessor";

const MAX_WORD_LIMIT = 1000;

export const useOptimizedGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const { trackUsage } = useUsageStats();
  const highlighting = useTextHighlighting();
  const { trackInteraction, measureOperation } = usePerformanceTracking('GrammarChecker');
  
  const abortControllerRef = useRef<AbortController>();
  const processingTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate cache key for API requests
  const generateCacheKey = useCallback((text: string, mode: ProcessingMode): string => {
    const textHash = btoa(encodeURIComponent(text.slice(0, 100))); // Use first 100 chars for hash
    return `${mode}-${textHash}-${text.length}`;
  }, []);

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

  // Advanced 4-step grammar correction process
  const processGrammarCorrection = useCallback(async (text: string) => {
    return measureOperation('advanced-grammar-correction', async () => {
      logger.info('4-STEP GRAMMAR CORRECTION PROCESS START', { inputLength: text.length }, 'useOptimizedGrammarChecker');
      logger.debug('Original input text', { text: text }, 'useOptimizedGrammarChecker');
      
      const { correctedText: step1Text, corrections: step1Corrections } = applyInitialDictionaryCorrections(text);
      logger.debug('STEP 1: Dictionary corrections on input', { 
        inputText: text, 
        outputText: step1Text, 
        correctionsFound: step1Corrections.length 
      }, 'useOptimizedGrammarChecker');
      
      logger.debug('STEP 2: GPT analysis on dictionary-corrected text', { inputText: step1Text }, 'useOptimizedGrammarChecker');
      const gptResult = await callGrammarCheckAPI(step1Text);
      logger.debug('GPT processing completed', { 
        inputText: step1Text, 
        outputText: gptResult.correctedText, 
        correctionsFound: gptResult.corrections.length 
      }, 'useOptimizedGrammarChecker');
      
      logger.debug('STEP 3: Dictionary corrections on GPT output', undefined, 'useOptimizedGrammarChecker');
      const { correctedText: step3Text, corrections: step3Corrections } = applyInitialDictionaryCorrections(gptResult.correctedText);
      logger.debug('Step 3 completed', { 
        inputText: gptResult.correctedText, 
        outputText: step3Text, 
        correctionsFound: step3Corrections.length 
      }, 'useOptimizedGrammarChecker');
      
      logger.debug('STEP 4: FINAL DICTIONARY PASS (NEW ROBUST METHOD)', undefined, 'useOptimizedGrammarChecker');
      const { correctedText: finalText, corrections: finalCorrections } = applyFinalDictionaryCorrections(step3Text);
      logger.debug('Step 4 completed', { 
        inputText: step3Text, 
        outputText: finalText, 
        correctionsFound: finalCorrections.length 
      }, 'useOptimizedGrammarChecker');
      
      logger.debug('FINAL TEXT VERIFICATION', undefined, 'useOptimizedGrammarChecker');
      verifyCorrections(finalText);
      
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
      
      logger.info('FINAL RESULTS SUMMARY', {
        originalText: text,
        finalText: finalText,
        textChanged: finalText !== text,
        totalCorrections: allCorrections.length
      }, 'useOptimizedGrammarChecker');
      
      logger.info('4-STEP GRAMMAR CORRECTION PROCESS COMPLETE', { totalCorrections: allCorrections.length }, 'useOptimizedGrammarChecker');
      
      return { correctedText: finalText, corrections: allCorrections };
    });
  }, [measureOperation]);

  // Optimized API call with caching and performance tracking
  const processText = useCallback(async (text: string, mode: ProcessingMode) => {
    return measureOperation(`process-${mode}`, async () => {
      const cacheKey = generateCacheKey(text, mode);
      
      // Check cache first
      const cachedResult = apiCache.get(cacheKey);
      if (cachedResult) {
        trackInteraction('cache-hit', { mode, textLength: text.length });
        logger.debug('Cache hit for text processing', { mode, textLength: text.length }, 'useOptimizedGrammarChecker');
        return cachedResult;
      }

      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const startTime = performance.now();
        let result;

        logger.debug('Starting API call', { mode, textLength: text.length }, 'useOptimizedGrammarChecker');

        if (mode === 'grammar') {
          result = await processGrammarCorrection(text);
        } else {
          const enhancedText = await callStyleEnhanceAPI(text);
          const styleEnhancements = extractStyleEnhancements(text, enhancedText);
          result = { correctedText: enhancedText, corrections: styleEnhancements };
        }

        const duration = performance.now() - startTime;
        
        // Cache successful results
        apiCache.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes
        
        // Track performance metrics
        performanceMonitor.recordMetric({
          name: `api-${mode}-success`,
          value: duration,
          category: 'network',
          details: {
            textLength: text.length,
            mode,
            cached: false,
          },
        });

        trackInteraction('api-success', { mode, duration, textLength: text.length });
        logger.info('API call successful', { mode, duration, textLength: text.length }, 'useOptimizedGrammarChecker');
        
        return result;
      } catch (error) {
        // Log error with context
        errorLogger.logError(error as Error, {
          severity: 'medium',
          category: 'network',
          context: {
            operation: `grammar-${mode}`,
            textLength: text.length,
            cacheKey,
          },
        });

        trackInteraction('api-error', { mode, error: (error as Error).message });
        logger.error('API call failed', { mode, error: (error as Error).message }, 'useOptimizedGrammarChecker');
        throw error;
      }
    });
  }, [generateCacheKey, measureOperation, trackInteraction, processGrammarCorrection]);

  // Grammar correction query with optimizations
  const grammarQuery = useQuery({
    queryKey: ['grammar-check', inputText, processingMode],
    queryFn: () => processText(inputText, processingMode),
    enabled: false, // Manual trigger only
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on word limit errors
      if (error instanceof Error && error.message.includes('शब्द सीमा')) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Optimized text processing with progress simulation
  const processTextOptimized = useCallback(async (mode: ProcessingMode) => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      trackInteraction('empty-text-submit', { mode });
      logger.warn('Empty text submitted for processing', { mode }, 'useOptimizedGrammarChecker');
      return;
    }

    if (!checkWordLimit(inputText)) {
      return;
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      trackInteraction('word-limit-exceeded', { mode, textLength: inputText.length });
      logger.warn('Word limit exceeded', { mode, textLength: inputText.length }, 'useOptimizedGrammarChecker');
      return;
    }

    setIsLoading(true);
    setProcessingMode(mode);
    setProgress(0);
    
    if (mode === 'grammar') {
      setCorrectedText('');
    } else {
      setEnhancedText('');
    }
    
    setCorrections([]);
    highlighting.clearHighlight();

    const progressInterval = createProgressSimulator(setProgress);

    try {
      logger.debug('Starting text processing', { mode, textLength: inputText.length }, 'useOptimizedGrammarChecker');

      // Track word usage
      await trackWordUsage(inputText, `${mode}_check`);
      await trackUsage(`${mode}_check`);
      
      // Process text
      const result = await grammarQuery.refetch();
      
      completeProgress(setProgress, progressInterval);

      if (result.data) {
        if (mode === 'grammar') {
          setCorrectedText(result.data.correctedText);
        } else {
          setEnhancedText(result.data.correctedText);
        }
        
        setCorrections(result.data.corrections || []);
        setIsLoading(false);
        
        trackInteraction('processing-success', { 
          mode, 
          correctionCount: result.data.corrections?.length || 0,
          textLength: inputText.length,
        });

        logger.info('Text processing completed successfully', { 
          mode, 
          correctionCount: result.data.corrections?.length || 0,
          textLength: inputText.length,
        }, 'useOptimizedGrammarChecker');

        const correctionCount = result.data.corrections?.length || 0;
        if (mode === 'grammar') {
          toast.success(`व्याकरण सुधार पूरा हो गया! ${correctionCount} सुधार मिले।`);
        } else {
          toast.success(`शैली सुधार पूरा हो गया! ${correctionCount} सुधार मिले।`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      resetProgress(setProgress, progressInterval);
      
      trackInteraction('processing-error', { 
        mode, 
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Text processing failed', { 
        mode, 
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'useOptimizedGrammarChecker');

      toast.error(`त्रुटि: ${error instanceof Error ? error.message : "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  }, [inputText, checkAndEnforceWordLimit, trackWordUsage, trackUsage, grammarQuery, trackInteraction, highlighting]);

  // Optimized text input handler with debouncing
  const setInputTextOptimized = useCallback((text: string) => {
    setInputText(text);
    
    // Clear previous corrections when text changes significantly
    const wordCountDiff = Math.abs(
      text.trim().split(/\s+/).length - inputText.trim().split(/\s+/).length
    );
    
    if (wordCountDiff > 5) {
      setCorrections([]);
      setCorrectedText('');
      setEnhancedText('');
      trackInteraction('text-reset', { 
        oldLength: inputText.length, 
        newLength: text.length,
      });
      logger.debug('Text reset due to significant change', { 
        oldLength: inputText.length, 
        newLength: text.length,
      }, 'useOptimizedGrammarChecker');
    }
  }, [inputText, trackInteraction]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    logger.debug('Cleanup completed', undefined, 'useOptimizedGrammarChecker');
  }, []);

  const getCurrentProcessedText = useCallback(() => {
    return processingMode === 'style' ? enhancedText : correctedText;
  }, [processingMode, enhancedText, correctedText]);

  return {
    inputText,
    setInputText: setInputTextOptimized,
    correctedText,
    enhancedText,
    corrections,
    isLoading,
    processingMode,
    progress,
    correctGrammar: () => processTextOptimized('grammar'),
    enhanceStyle: () => processTextOptimized('style'),
    resetText: useCallback(() => {
      cleanup();
      setInputText('');
      setCorrectedText('');
      setEnhancedText('');
      setCorrections([]);
      setProgress(0);
      setProcessingMode('grammar');
      highlighting.clearHighlight();
      trackInteraction('reset-all');
      logger.debug('All text and state reset', undefined, 'useOptimizedGrammarChecker');
    }, [cleanup, trackInteraction, highlighting]),
    copyToClipboard: useCallback((text: string) => {
      navigator.clipboard.writeText(text);
      trackInteraction('copy-text', { textLength: text.length });
      logger.debug('Text copied to clipboard', { textLength: text.length }, 'useOptimizedGrammarChecker');
      toast.success("टेक्स्ट कॉपी किया गया!");
    }, [trackInteraction]),
    getCurrentProcessedText,
    highlighting,
    cleanup,
  };
};
