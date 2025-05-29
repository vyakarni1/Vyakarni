
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className={`${headerGradient} text-white p-8`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            {React.createElement(headerIcon, { className: "h-6 w-6" })}
            {headerTitle}
          </CardTitle>
          <div className="flex items-center space-x-3">
            {currentText && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                {wordCount} शब्द
              </Badge>
            )}
            <CorrectionsDropdown corrections={corrections} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="min-h-[400px] p-6 bg-slate-50 rounded-2xl">
          {currentText ? (
            <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
              {currentText}
            </p>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg font-medium">
                  {isGrammarMode ? "सुधारा गया टेक्स्ट यहाँ दिखेगा..." : "शैली सुधारा गया टेक्स्ट यहाँ दिखेगा..."}
                </p>
                <p className="text-sm text-slate-300 mt-2">
                  {isGrammarMode ? "पहले व्याकरण सुधार बटन दबाएं" : "पहले शैली सुधार बटन दबाएं"}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {isLoading && (
          <div className="mt-8">
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
          <div className="flex space-x-4 mt-8">
            <Button
              onClick={onCopyToClipboard}
              variant="outline"
              className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
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
