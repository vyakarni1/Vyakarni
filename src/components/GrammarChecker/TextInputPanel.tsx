
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, RotateCcw, Zap } from "lucide-react";

interface TextInputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  wordCount: number;
  charCount: number;
  onCorrectGrammar: () => void;
  onResetText: () => void;
}

const TextInputPanel = ({ 
  inputText, 
  setInputText, 
  isLoading, 
  wordCount, 
  charCount, 
  onCorrectGrammar, 
  onResetText 
}: TextInputPanelProps) => {
  return (
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-6 w-6" />
            मूल टेक्स्ट
          </CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
            {wordCount} शब्द
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
          className="min-h-[400px] text-lg border-0 resize-none focus-visible:ring-0 p-6 bg-slate-50 rounded-2xl text-slate-800 placeholder:text-slate-400 leading-relaxed"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-8">
          <span className="text-sm text-slate-500 font-medium">{charCount} अक्षर</span>
          <div className="flex space-x-4">
            <Button
              onClick={onResetText}
              variant="outline"
              disabled={isLoading}
              className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              रीसेट
            </Button>
            <Button
              onClick={onCorrectGrammar}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isLoading ? 'सुधार रहे हैं...' : 'व्याकरण सुधारें'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextInputPanel;
