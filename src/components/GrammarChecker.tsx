
import React, { useState, useEffect } from 'react';
import { useOptimizedGrammarChecker } from "@/hooks/useOptimizedGrammarChecker";
import { usePerformanceTracking } from "@/hooks/usePerformanceTracking";
import { logger } from '@/utils/logger';
import Header from './GrammarChecker/Header';
import TextInputPanel from './GrammarChecker/TextInputPanel';
import CorrectedTextPanel from './GrammarChecker/CorrectedTextPanel';
import FeaturesSection from './GrammarChecker/FeaturesSection';
import LazyComponentWrapper from './Performance/LazyComponentWrapper';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

const GrammarChecker = () => {
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { trackInteraction } = usePerformanceTracking('GrammarChecker');

  logger.debug('Component mounting with optimizations', undefined, 'GrammarChecker');

  // Initialize grammar checker hook at top level
  let grammarCheckerData;
  try {
    grammarCheckerData = useOptimizedGrammarChecker();
    logger.debug('Optimized hook loaded successfully', undefined, 'GrammarChecker');
  } catch (err) {
    logger.error('Error initializing grammar checker', err, 'GrammarChecker');
    setError(err instanceof Error ? err.message : 'Failed to initialize grammar checker');
    trackInteraction('component-mount-error', { error: err instanceof Error ? err.message : 'Unknown' });
  }

  // Track successful mount
  useEffect(() => {
    if (grammarCheckerData && !error) {
      trackInteraction('component-mounted');
    }
  }, [grammarCheckerData, error, trackInteraction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (grammarCheckerData?.cleanup) {
        grammarCheckerData.cleanup();
      }
    };
  }, [grammarCheckerData]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    trackInteraction('retry-initialization');
    logger.debug('Retrying grammar checker initialization', { retryCount: retryCount + 1 }, 'GrammarChecker');
    // Force component re-render to retry hook initialization
    window.location.reload();
  };

  if (error || !grammarCheckerData) {
    logger.debug('Showing error state', { error }, 'GrammarChecker');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">व्याकरण चेकर लोड नहीं हो सका</h2>
            <p className="text-gray-600 mb-4">{error || 'Failed to initialize grammar checker'}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                पुनः प्रयास करें
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                पेज रीफ्रेश करें
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  logger.debug('Rendering optimized interface', undefined, 'GrammarChecker');

  const {
    inputText,
    setInputText,
    correctedText,
    enhancedText,
    isLoading: processingLoading,
    processingMode,
    progress,
    corrections,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    highlighting,
    hookError,
  } = grammarCheckerData;

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  // Generate highlighted segments for both input and output text
  const inputHighlightedSegments = highlighting.parseTextWithHighlights(
    inputText, 
    corrections, 
    'input'
  );

  const outputText = processingMode === 'style' ? enhancedText : correctedText;
  const outputHighlightedSegments = highlighting.parseTextWithHighlights(
    outputText,
    corrections,
    'output'
  );

  // Show highlights only when we have corrections and text
  const showHighlights = Boolean(corrections.length > 0 && (correctedText || enhancedText));

  const handleSegmentClick = (correctionIndex: number) => {
    highlighting.highlightCorrection(correctionIndex);
    trackInteraction('highlight-click', { correctionIndex });
  };

  const handleCorrectionClick = (index: number) => {
    highlighting.highlightCorrection(index);
    trackInteraction('correction-click', { correctionIndex: index });
  };

  // Create a wrapper function for copyToClipboard that matches the expected signature
  const handleCopyToClipboard = () => {
    const textToCopy = processingMode === 'style' ? enhancedText : correctedText;
    if (textToCopy) {
      copyToClipboard(textToCopy);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Show hook error if present */}
      {hookError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              चेतावनी: {hookError} - मूल कार्यक्षमता अभी भी उपलब्ध है।
            </p>
          </div>
        </div>
      )}

      <LazyComponentWrapper componentName="GrammarChecker-Header">
        <Header />
      </LazyComponentWrapper>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-stretch">
          <LazyComponentWrapper componentName="TextInputPanel">
            <TextInputPanel
              inputText={inputText}
              setInputText={setInputText}
              isLoading={processingLoading}
              wordCount={wordCount}
              charCount={charCount}
              onCorrectGrammar={correctGrammar}
              onEnhanceStyle={enhanceStyle}
              onResetText={resetText}
              highlightedSegments={inputHighlightedSegments}
              onSegmentClick={handleSegmentClick}
              showHighlights={showHighlights}
            />
          </LazyComponentWrapper>

          <LazyComponentWrapper componentName="CorrectedTextPanel">
            <CorrectedTextPanel
              correctedText={correctedText}
              enhancedText={enhancedText}
              corrections={corrections}
              isLoading={processingLoading}
              processingMode={processingMode}
              progress={progress}
              onCopyToClipboard={handleCopyToClipboard}
              highlightedSegments={outputHighlightedSegments}
              onSegmentClick={handleSegmentClick}
              selectedCorrectionIndex={highlighting.selectedCorrectionIndex}
              onCorrectionClick={handleCorrectionClick}
            />
          </LazyComponentWrapper>
        </div>

        <LazyComponentWrapper 
          componentName="FeaturesSection"
          enableIntersectionObserver={true}
          threshold={0.2}
          rootMargin="100px"
        >
          <FeaturesSection />
        </LazyComponentWrapper>
      </div>
    </div>
  );
};

export default React.memo(GrammarChecker);
