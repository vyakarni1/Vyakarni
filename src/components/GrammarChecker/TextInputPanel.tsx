
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, RotateCcw, Zap, Sparkles } from "lucide-react";

interface TextInputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  wordCount: number;
  charCount: number;
  onCorrectGrammar: () => void;
  onEnhanceStyle: () => void;
  onResetText: () => void;
}

const TextInputPanel = ({ 
  inputText, 
  setInputText, 
  isLoading, 
  wordCount, 
  charCount, 
  onCorrectGrammar,
  onEnhanceStyle,
  onResetText 
}: TextInputPanelProps) => {
  return (
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 sm:p-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            मूल टेक्स्ट
          </CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white border-0 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
            {wordCount} शब्द
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-8">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
          className="min-h-[300px] sm:min-h-[400px] text-base sm:text-lg border-0 resize-none focus-visible:ring-0 p-4 sm:p-6 bg-slate-50 rounded-2xl text-slate-800 placeholder:text-slate-400 leading-relaxed"
          disabled={isLoading}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8 gap-4 sm:gap-0">
          <span className="text-sm text-slate-500 font-medium">{charCount} अक्षर</span>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={onResetText}
              variant="outline"
              disabled={isLoading}
              className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 text-sm sm:text-base px-4 py-2"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              रीसेट
            </Button>
            <Button
              onClick={onCorrectGrammar}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isLoading ? 'सुधार रहे हैं...' : 'व्याकरण सुधारें'}
            </Button>
            <Button
              onClick={onEnhanceStyle}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? 'शैली सुधार रहे हैं...' : 'शैली सुधारें'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextInputPanel;
