
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import EnhancedHighlightedText from './EnhancedHighlightedText';
import CorrectionsDropdown from './CorrectionsDropdown';
import { Correction, ProcessingMode } from "@/types/grammarChecker";
import { EnhancedHighlightedSegment } from '@/hooks/useEnhancedTextHighlighting';

interface CorrectedTextPanelProps {
  correctedText: string;
  enhancedText: string;
  corrections: Correction[];
  isLoading: boolean;
  processingMode: ProcessingMode;
  progress: number;
  currentStage: string;
  onCopyToClipboard: () => void;
  highlightedSegments: EnhancedHighlightedSegment[];
  onSegmentClick: (correctionIndex: number) => void;
  selectedCorrectionIndex: number | null;
  onCorrectionClick: (index: number) => void;
}

const CorrectedTextPanel = ({
  correctedText,
  enhancedText,
  corrections,
  isLoading,
  processingMode,
  progress,
  currentStage,
  onCopyToClipboard,
  highlightedSegments,
  onSegmentClick,
  selectedCorrectionIndex,
  onCorrectionClick
}: CorrectedTextPanelProps) => {
  const displayText = processingMode === 'style' ? enhancedText : correctedText;
  const hasText = Boolean(displayText);
  const modeIcon = processingMode === 'style' ? Sparkles : CheckCircle2;
  const modeTitle = processingMode === 'style' ? 'शैली सुधारा गया टेक्स्ट' : 'सुधारा हुआ टेक्स्ट';
  const modeColor = processingMode === 'style' ? 'from-purple-600 to-pink-600' : 'from-green-600 to-emerald-600';

  // Group corrections by source for better display
  const dictionaryCorrections = corrections.filter(c => c.source === 'dictionary');
  const gptCorrections = corrections.filter(c => c.source === 'gpt');

  return (
    <Card className="h-full shadow-xl border-0 rounded-3xl overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${modeColor} text-white pb-6`}>
        <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          {React.createElement(modeIcon, { className: "h-6 w-6 sm:h-8 sm:w-8" })}
          {modeTitle}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-8 flex flex-col h-full">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-blue-600" />
            <div className="text-center space-y-3">
              <p className="text-lg sm:text-xl font-semibold text-gray-700">
                {processingMode === 'style' ? 'शैली सुधार रहे हैं...' : 'व्याकरण जांच रहे हैं...'}
              </p>
              <p className="text-sm text-gray-500">{currentStage}</p>
            </div>
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-3 rounded-full" />
              <p className="text-center text-sm text-gray-500 mt-2">{Math.round(progress)}% पूर्ण</p>
            </div>
          </div>
        ) : hasText ? (
          <>
            <div className="flex-1 mb-6">
              <div className="min-h-[300px] sm:min-h-[400px] p-4 sm:p-6 text-base sm:text-lg leading-relaxed bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-y-auto">
                <EnhancedHighlightedText
                  segments={highlightedSegments}
                  onSegmentClick={onSegmentClick}
                  className="font-hindi"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {corrections.length > 0 && (
                    <>
                      <Badge variant="secondary" className="px-3 py-1">
                        {corrections.length} सुधार
                      </Badge>
                      {dictionaryCorrections.length > 0 && (
                        <Badge variant="outline" className="px-3 py-1 border-blue-300 text-blue-700">
                          {dictionaryCorrections.length} शब्दकोश
                        </Badge>
                      )}
                      {gptCorrections.length > 0 && (
                        <Badge variant="outline" className="px-3 py-1 border-purple-300 text-purple-700">
                          {gptCorrections.length} AI
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                
                <Button
                  onClick={onCopyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  कॉपी करें
                </Button>
              </div>

              {corrections.length > 0 && (
                <CorrectionsDropdown
                  corrections={corrections}
                  selectedIndex={selectedCorrectionIndex}
                  onCorrectionClick={onCorrectionClick}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                {React.createElement(modeIcon, { className: "h-12 w-12 sm:h-16 sm:w-16 text-gray-400" })}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
                  {processingMode === 'style' ? 'शैली सुधार का परिणाम यहाँ दिखेगा' : 'सुधारा हुआ टेक्स्ट यहाँ दिखेगा'}
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  पहले बाएं में अपना टेक्स्ट लिखें या पेस्ट करें
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CorrectedTextPanel;
