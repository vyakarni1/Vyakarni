
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Copy, ArrowRight } from "lucide-react";
import { Correction } from "@/types/grammarChecker";
import CorrectionsDropdown from './CorrectionsDropdown';

interface CorrectedTextPanelProps {
  correctedText: string;
  corrections: Correction[];
  isLoading: boolean;
  progress: number;
  onCopyToClipboard: () => void;
}

const CorrectedTextPanel = ({ 
  correctedText, 
  corrections, 
  isLoading, 
  progress, 
  onCopyToClipboard 
}: CorrectedTextPanelProps) => {
  const wordCount = correctedText.trim() ? correctedText.trim().split(/\s+/).length : 0;

  return (
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            सुधारा गया टेक्स्ट
          </CardTitle>
          <div className="flex items-center space-x-3">
            {correctedText && (
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
          {correctedText ? (
            <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
              {correctedText}
            </p>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg font-medium">
                  सुधारा गया टेक्स्ट यहाँ दिखेगा...
                </p>
                <p className="text-sm text-slate-300 mt-2">
                  पहले मूल टेक्स्ट में कुछ लिखें
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
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out" />
            </Progress>
          </div>
        )}

        {correctedText && !isLoading && (
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
