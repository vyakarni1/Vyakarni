
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, CheckCircle, AlertCircle, BookOpen, Zap } from "lucide-react";
import { Correction } from "@/types/grammarChecker";

interface CorrectionsPanelProps {
  corrections: Correction[];
  isLoading: boolean;
  processingMode: 'grammar' | 'style';
}

const CorrectionsPanel = ({ corrections, isLoading, processingMode }: CorrectionsPanelProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-red-100 text-red-800 border-red-200';
      case 'spelling': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'punctuation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'style': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'dictionary': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return AlertCircle;
      case 'spelling': return BookOpen;
      case 'punctuation': return CheckCircle;
      case 'style': return Zap;
      case 'dictionary': return BookOpen;
      default: return CheckCircle;
    }
  };

  const headerGradient = processingMode === 'grammar' 
    ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
    : "bg-gradient-to-r from-purple-600 to-pink-600";

  if (isLoading) {
    return (
      <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className={`${headerGradient} text-white p-6`}>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            सुधार विश्लेषण
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-pulse text-slate-500">
                सुधारों का विश्लेषण हो रहा है...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!corrections || corrections.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className={`${headerGradient} text-white p-6`}>
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <CheckCircle className="h-6 w-6" />
          सुधार विश्लेषण ({corrections.length} सुधार)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {corrections.map((correction, index) => {
              const TypeIcon = getTypeIcon(correction.type);
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <TypeIcon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      {/* Correction Type Badge */}
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs font-medium border ${getTypeColor(correction.type)}`}>
                          {correction.type === 'grammar' && 'व्याकरण'}
                          {correction.type === 'spelling' && 'वर्तनी'}
                          {correction.type === 'punctuation' && 'विराम चिह्न'}
                          {correction.type === 'style' && 'शैली'}
                          {correction.type === 'dictionary' && 'शब्दकोश'}
                          {!['grammar', 'spelling', 'punctuation', 'style', 'dictionary'].includes(correction.type) && correction.type}
                        </Badge>
                        {correction.source && (
                          <Badge variant="outline" className="text-xs">
                            {correction.source === 'grok' ? 'AI सुधार' : 'शब्दकोश'}
                          </Badge>
                        )}
                      </div>

                      {/* Before and After Text */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                          <span className="text-red-600 font-medium">पहले: </span>
                          <span className="text-red-800 line-through">{correction.incorrect}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                          <span className="text-green-600 font-medium">बाद में: </span>
                          <span className="text-green-800 font-medium">{correction.correct}</span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-blue-600 font-medium text-sm mb-1">कारण:</div>
                        <div className="text-blue-800 text-sm leading-relaxed">
                          {correction.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CorrectionsPanel;
