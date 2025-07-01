
import React from 'react';
import { useEnhancedGrammarChecker } from "@/hooks/useEnhancedGrammarChecker";
import Header from './GrammarChecker/Header';
import TextInputPanel from './GrammarChecker/TextInputPanel';
import CorrectedTextPanel from './GrammarChecker/CorrectedTextPanel';
import FeaturesSection from './GrammarChecker/FeaturesSection';

const GrammarChecker = () => {
  const {
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
    highlighting
  } = useEnhancedGrammarChecker();

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  // Generate enhanced highlighted segments for both input and output text
  const inputHighlightedSegments = highlighting.parseTextWithEnhancedHighlights(
    inputText, 
    corrections, 
    'input'
  );

  const outputText = processingMode === 'style' ? enhancedText : correctedText;
  const outputHighlightedSegments = highlighting.parseTextWithEnhancedHighlights(
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
            isLoading={isLoading}
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
            isLoading={isLoading}
            processingMode={processingMode}
            progress={progress}
            currentStage={currentStage}
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
};

export default GrammarChecker;
