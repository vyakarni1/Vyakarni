
import { useState } from 'react';
import { Correction } from '@/types/grammarChecker';

export interface HighlightedSegment {
  text: string;
  isHighlighted: boolean;
  type: 'incorrect' | 'correct' | 'normal';
  correctionIndex?: number;
  startIndex?: number;
  endIndex?: number;
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

    // Simplified approach: build segments by finding and replacing words
    const segments: HighlightedSegment[] = [];
    let remainingText = text;
    let currentIndex = 0;

    // Process each correction to find matches in the text
    corrections.forEach((correction, index) => {
      const searchText = type === 'input' ? correction.incorrect : correction.correct;
      const highlightType = type === 'input' ? 'incorrect' : 'correct';
      
      // Find the first occurrence of this word in remaining text
      const wordIndex = remainingText.indexOf(searchText);
      
      if (wordIndex !== -1) {
        // Add any text before this word as normal
        if (wordIndex > 0) {
          segments.push({
            text: remainingText.substring(0, wordIndex),
            isHighlighted: false,
            type: 'normal'
          });
        }
        
        // Add the highlighted word
        segments.push({
          text: searchText,
          isHighlighted: selectedCorrectionIndex === index,
          type: highlightType,
          correctionIndex: index
        });
        
        // Update remaining text
        remainingText = remainingText.substring(wordIndex + searchText.length);
      }
    });

    // Add any remaining text as normal
    if (remainingText.length > 0) {
      segments.push({
        text: remainingText,
        isHighlighted: false,
        type: 'normal'
      });
    }

    // If no segments were created, return the original text as normal
    if (segments.length === 0) {
      return [{ text, isHighlighted: false, type: 'normal' }];
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
