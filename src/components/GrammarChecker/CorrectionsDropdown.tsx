
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertCircle, ChevronDown, CheckCircle, X, BookOpen, Brain, Zap } from "lucide-react";
import { Correction } from "@/types/grammarChecker";

interface CorrectionsDropdownProps {
  corrections?: Correction[];
  aiCorrections?: Correction[];
  dictionaryCorrections?: Correction[];
  selectedCorrectionIndex?: number | null;
  onCorrectionClick?: (index: number) => void;
}

const CorrectionsDropdown = ({ 
  corrections = [], 
  aiCorrections = [], 
  dictionaryCorrections = [],
  selectedCorrectionIndex, 
  onCorrectionClick 
}: CorrectionsDropdownProps) => {
  
  const totalCorrections = aiCorrections.length + dictionaryCorrections.length;
  
  const getCorrectionTypeColor = (type: string) => {
    switch (type) {
      case 'grammar':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'spelling':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'punctuation':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'syntax':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'vocabulary':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCorrectionTypeLabel = (type: string) => {
    switch (type) {
      case 'grammar':
        return 'व्याकरण';
      case 'spelling':
        return 'वर्तनी';
      case 'punctuation':
        return 'विराम चिह्न';
      case 'syntax':
        return 'वाक्य संरचना';
      case 'vocabulary':
        return 'शब्दावली';
      default:
        return 'सुधार';
    }
  };

  const handleCorrectionClick = (index: number) => {
    if (onCorrectionClick) {
      onCorrectionClick(index);
    }
  };

  const renderCorrectionItem = (correction: Correction, index: number, source: 'ai' | 'dictionary') => {
    const isSelected = selectedCorrectionIndex === index;
    const sourceColor = source === 'ai' ? 'from-blue-500 to-indigo-500' : 'from-emerald-500 to-green-500';
    const sourceIcon = source === 'ai' ? Brain : BookOpen;
    const sourceLabel = source === 'ai' ? 'AI विश्लेषण' : 'शब्दकोश';

    return (
      <DropdownMenuItem 
        key={`${source}-${index}`}
        className={`p-0 focus:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
          isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
        onClick={() => handleCorrectionClick(index)}
      >
        <div className="w-full p-4 border-b border-slate-100 last:border-b-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className={`bg-gradient-to-r ${sourceColor} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-fade-in`}>
                {index + 1}
              </span>
              <Badge className={`${getCorrectionTypeColor(correction.type)} text-xs font-medium transition-all duration-200`}>
                {getCorrectionTypeLabel(correction.type)}
              </Badge>
              <Badge className={`${source === 'ai' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'} text-xs font-medium flex items-center gap-1 transition-all duration-200`}>
                {React.createElement(sourceIcon, { className: "h-3 w-3" })}
                {sourceLabel}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 animate-slide-in-right">
              <X className="h-4 w-4 text-red-500" />
              <span className="text-red-600 text-sm line-through font-medium">"{correction.incorrect}"</span>
            </div>
            <div className="flex items-center space-x-3 animate-slide-in-right">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600 text-sm font-semibold">"{correction.correct}"</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 ml-7 leading-relaxed animate-fade-in">
              {correction.reason}
            </p>
          </div>
        </div>
      </DropdownMenuItem>
    );
  };

  if (totalCorrections === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white/20 text-white border-0 hover:bg-white/30 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105"
        >
          <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
          {totalCorrections} सुधार
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-2 z-50 animate-scale-in">
        <DropdownMenuLabel className="text-base font-semibold text-slate-700 px-4 py-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          सभी सुधार ({totalCorrections})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* AI Corrections Section */}
        {aiCorrections.length > 0 && (
          <>
            <DropdownMenuLabel className="text-sm font-medium text-blue-600 px-4 py-2 flex items-center gap-2 animate-fade-in">
              <Brain className="h-4 w-4" />
              AI विश्लेषण सुधार ({aiCorrections.length})
            </DropdownMenuLabel>
            {aiCorrections.map((correction, index) => 
              renderCorrectionItem(correction, index, 'ai')
            )}
            {dictionaryCorrections.length > 0 && <DropdownMenuSeparator />}
          </>
        )}

        {/* Dictionary Corrections Section */}
        {dictionaryCorrections.length > 0 && (
          <>
            <DropdownMenuLabel className="text-sm font-medium text-emerald-600 px-4 py-2 flex items-center gap-2 animate-fade-in">
              <BookOpen className="h-4 w-4" />
              शब्दकोश सुधार ({dictionaryCorrections.length})
            </DropdownMenuLabel>
            {dictionaryCorrections.map((correction, index) => 
              renderCorrectionItem(correction, aiCorrections.length + index, 'dictionary')
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CorrectionsDropdown;
