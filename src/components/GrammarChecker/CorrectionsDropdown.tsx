
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertCircle, ChevronDown, CheckCircle, X, Eye } from "lucide-react";
import { Correction } from "@/types/grammarChecker";

interface CorrectionsDropdownProps {
  corrections: Correction[];
  selectedCorrectionId: string | null;
  onCorrectionSelect: (correctionId: string | null) => void;
}

const CorrectionsDropdown = ({ corrections, selectedCorrectionId, onCorrectionSelect }: CorrectionsDropdownProps) => {
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
      default:
        return 'सुधार';
    }
  };

  if (corrections.length === 0) {
    return null;
  }

  const handleCorrectionClick = (correctionId: string) => {
    if (selectedCorrectionId === correctionId) {
      onCorrectionSelect(null); // Deselect if already selected
    } else {
      onCorrectionSelect(correctionId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white/20 text-white border-0 hover:bg-white/30 rounded-xl px-4 py-2"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          {corrections.length} सुधार
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-2 z-50">
        <DropdownMenuLabel className="text-base font-semibold text-slate-700 px-4 py-3">
          सभी सुधार ({corrections.length})
          <p className="text-xs text-slate-500 font-normal mt-1">सुधार पर क्लिक करें और टेक्स्ट में हाइलाइट देखें</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {corrections.map((correction, index) => {
          const isSelected = selectedCorrectionId === correction.id;
          return (
            <DropdownMenuItem 
              key={correction.id} 
              className="p-0 focus:bg-slate-50 rounded-xl cursor-pointer"
              onClick={() => handleCorrectionClick(correction.id)}
            >
              <div className={`w-full p-4 border-b border-slate-100 last:border-b-0 transition-all ${isSelected ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'}`}>
                      {isSelected ? <Eye className="h-3 w-3" /> : index + 1}
                    </span>
                    <Badge className={`${getCorrectionTypeColor(correction.type)} text-xs font-medium`}>
                      {getCorrectionTypeLabel(correction.type)}
                    </Badge>
                  </div>
                  {isSelected && (
                    <div className="text-emerald-600 text-xs font-medium">
                      टेक्स्ट में हाइलाइट किया गया
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 text-sm line-through font-medium">"{correction.incorrect}"</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`}>"{correction.correct}"</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 ml-7 leading-relaxed">
                    {correction.reason}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CorrectionsDropdown;
