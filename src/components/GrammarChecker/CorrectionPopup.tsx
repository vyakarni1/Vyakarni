import React, { useRef, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, BookOpen, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Correction } from '@/types/grammarChecker';

interface CorrectionPopupProps {
  correction: Correction;
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const CorrectionPopup = ({ correction, isVisible, onClose, position }: CorrectionPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getSourceIcon = (source?: string) => {
    if (source === 'dictionary') return <BookOpen className="h-3 w-3" />;
    if (source === 'gpt') return <Brain className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getSourceText = (source?: string) => {
    if (source === 'dictionary') return 'शब्दकोश';
    if (source === 'gpt') return 'AI विश्लेषण';
    return 'सुधार';
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'grammar': return 'व्याकरण';
      case 'spelling': return 'वर्तनी';
      case 'punctuation': return 'विराम चिह्न';
      case 'syntax': return 'वाक्य संरचना';
      case 'vocabulary': return 'शब्दावली';
      case 'flow': return 'प्रवाह';
      case 'eloquence': return 'वाक्य सुधार';
      case 'engagement': return 'रोचकता';
      default: return 'सुधार';
    }
  };

  // Calculate popup position to keep it within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 320), // 320px is approximate popup width
    y: Math.max(20, Math.min(position.y - 100, window.innerHeight - 200)) // Keep within viewport
  };

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ 
        left: `${adjustedPosition.x}px`, 
        top: `${adjustedPosition.y}px` 
      }}
    >
      <Card 
        ref={popupRef}
        className={`w-80 bg-white border-2 border-gray-200 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto transform transition-all duration-200 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  {getSourceIcon(correction.source)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">सुधार विवरण</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {getTypeText(correction.type)}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {getSourceText(correction.source)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Incorrect Text */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-red-700">गलत</span>
              </div>
              <p className="text-sm text-red-800 font-medium line-through">
                {correction.incorrect}
              </p>
            </div>

            {/* Correct Text */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium text-green-700">सही</span>
              </div>
              <p className="text-sm text-green-800 font-semibold">
                {correction.correct}
              </p>
            </div>

            {/* Reason */}
            {correction.reason && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Brain className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-700">कारण</span>
                </div>
                <p className="text-sm text-blue-800">
                  {correction.reason}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrectionPopup;
