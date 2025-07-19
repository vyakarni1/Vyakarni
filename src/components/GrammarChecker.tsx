
import React, { memo } from 'react';
import { useGrammarChecker } from "@/hooks/useGrammarChecker";
import Header from './GrammarChecker/Header';
import TextInputPanel from './GrammarChecker/TextInputPanel';
import CorrectedTextPanel from './GrammarChecker/CorrectedTextPanel';
import FeaturesSection from './GrammarChecker/FeaturesSection';

const GrammarChecker = memo(() => {
  const {
    inputText,
    setInputText,
    correctedText,
    enhancedText,
    isLoading,
    processingMode,
    progress,
    currentStage,
    correctGrammar,
    enhanceStyle,
    resetText,
    copyToClipboard,
    wordCount,
    charCount
  } = useGrammarChecker();

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
          />

          <CorrectedTextPanel
            correctedText={correctedText}
            enhancedText={enhancedText}
            isLoading={isLoading}
            processingMode={processingMode}
            progress={progress}
            currentStage={currentStage}
            onCopyToClipboard={copyToClipboard}
          />
        </div>

        <FeaturesSection />
      </div>
    </div>
  );
});

GrammarChecker.displayName = 'GrammarChecker';

export default GrammarChecker;
