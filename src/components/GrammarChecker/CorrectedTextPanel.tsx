
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedProgress } from "@/components/ui/enhanced-progress";
import { FloatingDots } from "@/components/ui/floating-dots";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Copy, ArrowRight, Sparkles, Zap, BookOpen, Brain } from "lucide-react";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { useEnhancedLoading } from "@/hooks/useEnhancedLoading";
import CorrectionsDropdown from './CorrectionsDropdown';

interface CorrectedTextPanelProps {
  correctedText: string;
  enhancedText: string;
  corrections: Correction[];
  aiCorrections?: Correction[];
  dictionaryCorrections?: Correction[];
  isLoading: boolean;
  processingMode: ProcessingMode;
  progress: number;
  currentStage?: string;
  onCopyToClipboard: () => void;
}

const CorrectedTextPanel = ({ 
  correctedText,
  enhancedText,
  corrections, 
  aiCorrections = [],
  dictionaryCorrections = [],
  isLoading, 
  processingMode,
  progress, 
  currentStage,
  onCopyToClipboard,
}: CorrectedTextPanelProps) => {
  const currentText = processingMode === 'style' ? enhancedText : correctedText;
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
  
  const isGrammarMode = processingMode === 'grammar';
  const headerGradient = isGrammarMode 
    ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
    : "bg-gradient-to-r from-purple-600 to-pink-600";
  
  const headerTitle = isGrammarMode ? "सुधारा गया पाठ" : "शैली सुधारा गया पाठ";
  const headerIcon = isGrammarMode ? CheckCircle : Sparkles;

  // Enhanced loading experience
  const {
    currentPhrase,
    isAnimating,
    getProgressBarClass,
    getCardAnimationClass,
    phraseTransitionClass
  } = useEnhancedLoading(isLoading, currentStage || '', processingMode, progress);

  return (
    <Card className={`shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm h-full flex flex-col ${getCardAnimationClass()}`}>
      {/* Floating dots animation */}
      <FloatingDots 
        isActive={isLoading} 
        color={isGrammarMode ? 'green' : 'purple'} 
        className="absolute inset-0 z-0" 
      />
      
      <CardHeader className={`${headerGradient} text-white p-4 sm:p-8 flex-shrink-0 transition-all duration-300 relative z-10`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            {React.createElement(headerIcon, { 
              className: `h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${isLoading ? 'animate-bounce' : ''}` 
            })}
            <span className="hidden sm:inline">{headerTitle}</span>
            <span className="sm:hidden">{isGrammarMode ? "सुधारा गया" : "शैली सुधारा"}</span>
          </CardTitle>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Corrections Badge */}
            {isGrammarMode && aiCorrections.length > 0 && (
              <Badge variant="secondary" className="bg-blue-100/20 text-white border-0 px-2 sm:px-3 py-1 text-xs flex items-center gap-1">
                <Brain className="h-3 w-3" />
                {aiCorrections.length} AI
              </Badge>
            )}
            
            {/* Dictionary Corrections Badge */}
            {isGrammarMode && dictionaryCorrections.length > 0 && (
              <Badge variant="secondary" className="bg-green-100/20 text-white border-0 px-2 sm:px-3 py-1 text-xs flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {dictionaryCorrections.length} शब्दकोश
              </Badge>
            )}
            
            {currentText && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                {wordCount} शब्द
              </Badge>
            )}
          </div>
        </div>
        
        {/* Enhanced Corrections Dropdown */}
        {isGrammarMode && (aiCorrections.length > 0 || dictionaryCorrections.length > 0) && (
          <div className="mt-4 flex justify-end">
            <CorrectionsDropdown 
              aiCorrections={aiCorrections}
              dictionaryCorrections={dictionaryCorrections}
              corrections={corrections}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 sm:p-8 flex-1 flex flex-col relative z-10">
        <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden">
          {currentText ? (
            <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px]">
              <div className="p-4 sm:p-6">
                <p className="text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {currentText}
                </p>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[400px] sm:h-[500px] lg:h-[600px]">
              <div className="text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300`}>
                  {isLoading ? (
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600 animate-pulse" />
                  ) : (
                    <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                  )}
                </div>
                
                {/* Simplified loading text */}
                <div className="min-h-[60px] flex flex-col items-center justify-center">
                  {isLoading && currentPhrase ? (
                    <p className={`text-slate-600 text-base sm:text-lg font-medium mb-2 ${phraseTransitionClass}`}>
                      {currentPhrase}
                    </p>
                  ) : (
                    <p className="text-slate-400 text-base sm:text-lg font-medium">
                      {isGrammarMode ? "सुधारा गया पाठ यहाँ दिखेगा..." : "शैली सुधारा गया पाठ यहाँ दिखेगा..."}
                    </p>
                  )}
                  
                  {!isLoading && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-2">
                      {isGrammarMode ? "पहले व्याकरण सुधार बटन दबायें" : "पहले शैली सुधार बटन दबायें"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Simplified progress section */}
        {isLoading && (
          <div className="mt-6 sm:mt-8 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">प्रगति</span>
                {currentStage && (
                  <span className="text-xs text-slate-500 mt-1">
                    {currentStage}
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500 font-medium">
                {progress}%
              </span>
            </div>
            
            <div className="relative">
              <EnhancedProgress 
                value={progress} 
                showShimmer={true}
                gradient={isGrammarMode ? 'green' : 'purple'}
                className="h-3 bg-slate-200/60"
              />
            </div>
          </div>
        )}

        {/* Copy button */}
        {currentText && !isLoading && (
          <div className="flex space-x-4 mt-6 sm:mt-8 flex-shrink-0">
            <Button
              onClick={onCopyToClipboard}
              variant="outline"
              className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-300 text-sm sm:text-base hover:scale-105 transform"
            >
              <Copy className="h-4 w-4 mr-2" />
              कॉपी करें
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CorrectedTextPanel;
