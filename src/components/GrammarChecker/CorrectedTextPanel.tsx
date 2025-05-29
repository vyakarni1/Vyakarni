
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Copy, ArrowRight, Sparkles } from "lucide-react";
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import CorrectionsDropdown from './CorrectionsDropdown';

interface CorrectedTextPanelProps {
  correctedText: string;
  enhancedText: string;
  corrections: Correction[];
  isLoading: boolean;
  processingMode: ProcessingMode;
  progress: number;
  onCopyToClipboard: () => void;
}

const CorrectedTextPanel = ({ 
  correctedText,
  enhancedText,
  corrections, 
  isLoading, 
  processingMode,
  progress,
  onCopyToClipboard
}: CorrectedTextPanelProps) => {
  const currentText = processingMode === 'style' ? enhancedText : correctedText;
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
  
  const isGrammarMode = processingMode === 'grammar';
  const headerGradient = isGrammarMode 
    ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
    : "bg-gradient-to-r from-purple-600 to-pink-600";
  
  const headerTitle = isGrammarMode ? "सुधारा गया टेक्स्ट" : "शैली सुधारा गया टेक्स्ट";
  const headerIcon = isGrammarMode ? CheckCircle : Sparkles;

  return (
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className={`${headerGradient} text-white p-4 sm:p-8 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            {React.createElement(headerIcon, { className: "h-5 w-5 sm:h-6 sm:w-6" })}
            <span className="hidden sm:inline">{headerTitle}</span>
            <span className="sm:hidden">{isGrammarMode ? "सुधारा गया" : "शैली सुधारा"}</span>
          </CardTitle>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {currentText && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                {wordCount} शब्द
              </Badge>
            )}
            <CorrectionsDropdown corrections={corrections} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-8 flex-1 flex flex-col">
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
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-base sm:text-lg font-medium">
                  {isGrammarMode ? "सुधारा गया टेक्स्ट यहाँ दिखेगा..." : "शैली सुधारा गया टेक्स्ट यहाँ दिखेगा..."}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  {isGrammarMode ? "पहले व्याकरण सुधार बटन दबाएं" : "पहले शैली सुधार बटन दबाएं"}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {isLoading && (
          <div className="mt-6 sm:mt-8 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">प्रगति</span>
              <span className="text-sm text-slate-500 font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full ${isGrammarMode ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} transition-all duration-300 ease-out`} />
            </Progress>
          </div>
        )}

        {currentText && !isLoading && (
          <div className="flex space-x-4 mt-6 sm:mt-8 flex-shrink-0">
            <Button
              onClick={onCopyToClipboard}
              variant="outline"
              className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 text-sm sm:text-base"
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
