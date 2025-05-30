
import { useState } from 'react';
import { Correction } from '@/types/grammarChecker';

export interface HighlightedSegment {
  text: string;
  isHighlighted: boolean;
  type: 'incorrect' | 'correct' | 'normal';
  correctionIndex?: number;
}

export const useTextHighlighting = () => {
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);

  const parseTextWithHighlights = (
    text: string, 
    corrections: Correction[], 
    type: 'input' | 'output'
  ): HighlightedSegment[] => {
    if (!text || corrections.length === 0) {
      return [{ text, isHighlighted: false, type: 'normal' }];
    }

    const segments: HighlightedSegment[] = [];
    let lastIndex = 0;

    corrections.forEach((correction, index) => {
      const searchText = type === 'input' ? correction.incorrect : correction.correct;
      const highlightType = type === 'input' ? 'incorrect' : 'correct';
      
      const wordIndex = text.indexOf(searchText, lastIndex);
      
      if (wordIndex !== -1) {
        // Add text before the correction
        if (wordIndex > lastIndex) {
          segments.push({
            text: text.substring(lastIndex, wordIndex),
            isHighlighted: false,
            type: 'normal'
          });
        }
        
        // Add the highlighted correction
        segments.push({
          text: searchText,
          isHighlighted: selectedCorrectionIndex === index,
          type: highlightType,
          correctionIndex: index
        });
        
        lastIndex = wordIndex + searchText.length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isHighlighted: false,
        type: 'normal'
      });
    }

    return segments;
  };

  const highlightCorrection = (correctionIndex: number) => {
    setSelectedCorrectionIndex(prevIndex => 
      prevIndex === correctionIndex ? null : correctionIndex
    );
  };

  const clearHighlight = () => {
    setSelectedCorrectionIndex(null);
  };

  return {
    selectedCorrectionIndex,
    parseTextWithHighlights,
    highlightCorrection,
    clearHighlight
  };
};
