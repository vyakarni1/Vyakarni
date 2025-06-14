
import React, { useState, useEffect } from 'react';
import { useGrammarChecker } from "@/hooks/useGrammarChecker";
import Header from './GrammarChecker/Header';
import TextInputPanel from './GrammarChecker/TextInputPanel';
import CorrectedTextPanel from './GrammarChecker/CorrectedTextPanel';
import FeaturesSection from './GrammarChecker/FeaturesSection';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

const GrammarChecker = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('[GrammarChecker] Component mounting');

  try {
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
      highlighting
    } = useGrammarChecker();

    useEffect(() => {
      console.log('[GrammarChecker] Hook loaded successfully');
      setIsLoading(false);
    }, []);

    if (error) {
      console.log('[GrammarChecker] Showing error state:', error);
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">व्याकरण चेकर लोड नहीं हो सका</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                पेज रीफ्रेश करें
              </button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isLoading) {
      console.log('[GrammarChecker] Showing loading state');
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600">व्याकरण चेकर लोड हो रहा है...</p>
          </div>
        </div>
      );
    }

    console.log('[GrammarChecker] Rendering main interface');

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
    };

    const handleCorrectionClick = (index: number) => {
      highlighting.highlightCorrection(index);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Header />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-12 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-stretch">
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

            <CorrectedTextPanel
              correctedText={correctedText}
              enhancedText={enhancedText}
              corrections={corrections}
              isLoading={processingLoading}
              processingMode={processingMode}
              progress={progress}
              onCopyToClipboard={copyToClipboard}
              highlightedSegments={outputHighlightedSegments}
              onSegmentClick={handleSegmentClick}
              selectedCorrectionIndex={highlighting.selectedCorrectionIndex}
              onCorrectionClick={handleCorrectionClick}
            />
          </div>

          <FeaturesSection />
        </div>
      </div>
    );
  } catch (error) {
    console.error('[GrammarChecker] Catch block error:', error);
    setError(error instanceof Error ? error.message : 'Unknown error in GrammarChecker');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">व्याकरण चेकर में त्रुटि</h2>
            <p className="text-gray-600 mb-4">कृपया पेज रीफ्रेश करके दोबारा कोशिश करें।</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              पेज रीफ्रेश करें
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default GrammarChecker;
