
import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { callGrammarCheckAPI, callStyleEnhanceAPI } from '@/services/grammarApi';
import { useWordLimits } from './useWordLimits';
import { usePerformanceTracking } from './usePerformanceTracking';
import { apiCache } from '@/services/cacheManager';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorLogger } from '@/services/ErrorLogger';
import { logger } from '@/utils/logger';
import type { Correction, ProcessingMode } from '@/types/grammarChecker';

export const useOptimizedGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('grammar');
  const [progress, setProgress] = useState(0);
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const { trackInteraction, measureOperation } = usePerformanceTracking('GrammarChecker');
  
  const abortControllerRef = useRef<AbortController>();
  const processingTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate cache key for API requests
  const generateCacheKey = useCallback((text: string, mode: ProcessingMode): string => {
    const textHash = btoa(encodeURIComponent(text.slice(0, 100))); // Use first 100 chars for hash
    return `${mode}-${textHash}-${text.length}`;
  }, []);

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
          result = await callGrammarCheckAPI(text);
        } else {
          const enhancedText = await callStyleEnhanceAPI(text);
          result = { correctedText: enhancedText, corrections: [] };
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
  }, [generateCacheKey, measureOperation, trackInteraction]);

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

  // Memoized derived state
  const correctedText = useMemo(() => {
    return grammarQuery.data?.correctedText || '';
  }, [grammarQuery.data]);

  const enhancedText = useMemo(() => {
    return processingMode === 'style' ? correctedText : '';
  }, [correctedText, processingMode]);

  // Optimized text processing with progress simulation
  const processTextOptimized = useCallback(async (mode: ProcessingMode) => {
    if (!inputText.trim()) {
      trackInteraction('empty-text-submit', { mode });
      logger.warn('Empty text submitted for processing', { mode }, 'useOptimizedGrammarChecker');
      return;
    }

    if (!checkAndEnforceWordLimit(inputText)) {
      trackInteraction('word-limit-exceeded', { mode, textLength: inputText.length });
      logger.warn('Word limit exceeded', { mode, textLength: inputText.length }, 'useOptimizedGrammarChecker');
      return;
    }

    try {
      setProcessingMode(mode);
      setProgress(0);

      logger.debug('Starting text processing', { mode, textLength: inputText.length }, 'useOptimizedGrammarChecker');

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 85));
      }, 200);

      processingTimeoutRef.current = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(90);
      }, 1000);

      // Track word usage
      await trackWordUsage(inputText, `${mode}_check`);
      
      // Process text
      const result = await grammarQuery.refetch();
      
      clearInterval(progressInterval);
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      if (result.data) {
        setCorrections(result.data.corrections || []);
        setProgress(100);
        
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

        // Reset progress after showing completion
        setTimeout(() => setProgress(0), 1000);
      }
    } catch (error) {
      setProgress(0);
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      trackInteraction('processing-error', { 
        mode, 
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Text processing failed', { 
        mode, 
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'useOptimizedGrammarChecker');
    }
  }, [inputText, checkAndEnforceWordLimit, trackWordUsage, grammarQuery, trackInteraction]);

  // Optimized text input handler with debouncing
  const setInputTextOptimized = useCallback((text: string) => {
    setInputText(text);
    
    // Clear previous corrections when text changes significantly
    const wordCountDiff = Math.abs(
      text.trim().split(/\s+/).length - inputText.trim().split(/\s+/).length
    );
    
    if (wordCountDiff > 5) {
      setCorrections([]);
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

  return {
    inputText,
    setInputText: setInputTextOptimized,
    correctedText,
    enhancedText,
    corrections,
    isLoading: grammarQuery.isFetching,
    processingMode,
    progress,
    correctGrammar: () => processTextOptimized('grammar'),
    enhanceStyle: () => processTextOptimized('style'),
    resetText: useCallback(() => {
      cleanup();
      setInputText('');
      setCorrections([]);
      setProgress(0);
      trackInteraction('reset-all');
      logger.debug('All text and state reset', undefined, 'useOptimizedGrammarChecker');
    }, [cleanup, trackInteraction]),
    copyToClipboard: useCallback((text: string) => {
      navigator.clipboard.writeText(text);
      trackInteraction('copy-text', { textLength: text.length });
      logger.debug('Text copied to clipboard', { textLength: text.length }, 'useOptimizedGrammarChecker');
    }, [trackInteraction]),
    cleanup,
  };
};
