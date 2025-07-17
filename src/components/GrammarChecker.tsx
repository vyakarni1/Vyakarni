
import React from 'react';
import { useGrammarChecker } from "@/hooks/useGrammarChecker";
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
  } = useGrammarChecker();

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const outputText = processingMode === 'style' ? enhancedText : correctedText;


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
            corrections={corrections}
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
};

export default GrammarChecker;
