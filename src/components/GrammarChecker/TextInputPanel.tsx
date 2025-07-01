
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, RotateCcw, PenTool } from "lucide-react";
import EnhancedHighlightedText from './EnhancedHighlightedText';
import { EnhancedHighlightedSegment } from '@/hooks/useEnhancedTextHighlighting';

interface TextInputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  wordCount: number;
  charCount: number;
  onCorrectGrammar: () => void;
  onEnhanceStyle: () => void;
  onResetText: () => void;
  highlightedSegments: EnhancedHighlightedSegment[];
  onSegmentClick: (correctionIndex: number) => void;
  showHighlights: boolean;
}

const TextInputPanel = ({
  inputText,
  setInputText,
  isLoading,
  wordCount,
  charCount,
  onCorrectGrammar,
  onEnhanceStyle,
  onResetText,
  highlightedSegments,
  onSegmentClick,
  showHighlights
}: TextInputPanelProps) => {
  return (
    <Card className="h-full shadow-xl border-0 rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <PenTool className="h-6 w-6 sm:h-8 sm:w-8" />
          टेक्स्ट लिखें
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-8 flex flex-col h-full">
        <div className="flex-1 mb-6">
          {showHighlights ? (
            <div className="min-h-[300px] sm:min-h-[400px] p-4 sm:p-6 text-base sm:text-lg leading-relaxed bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-y-auto">
              <EnhancedHighlightedText
                segments={highlightedSegments}
                onSegmentClick={onSegmentClick}
                className="font-hindi"
              />
            </div>
          ) : (
            <Textarea
              placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें या पेस्ट करें..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] sm:min-h-[400px] text-base sm:text-lg resize-none border-2 border-gray-200 rounded-2xl p-4 sm:p-6 focus:border-blue-400 transition-colors font-hindi leading-relaxed"
              disabled={isLoading}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="px-3 py-1">
                {wordCount} शब्द
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {charCount} अक्षर
              </Badge>
            </div>
            {inputText && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetText}
                disabled={isLoading}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="h-4 w-4" />
                रीसेट करें
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={onCorrectGrammar}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <CheckCircle2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              व्याकरण जांचें
            </Button>
            
            <Button
              onClick={onEnhanceStyle}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              शैली सुधारें
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextInputPanel;
