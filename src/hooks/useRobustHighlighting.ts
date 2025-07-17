import { useState } from 'react';
import { Correction } from '@/types/grammarChecker';

export interface HighlightedSegment {
  text: string;
  isHighlighted: boolean;
  type: 'incorrect' | 'correct' | 'normal';
  correctionIndex?: number;
  source?: 'gpt' | 'dictionary';
}

export const useRobustHighlighting = () => {
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);

  const parseTextWithHighlights = (
    text: string, 
    corrections: Correction[], 
    type: 'input' | 'output'
  ): HighlightedSegment[] => {
    if (!text || corrections.length === 0) {
      return [{ text, isHighlighted: false, type: 'normal' }];
    }

    console.log('=== ROBUST HIGHLIGHTING START ===');
    console.log(`Parsing ${type} text:`, text);
    console.log('Corrections to process:', corrections);

    // Create correction markers with positions
    const markers: Array<{
      position: number;
      length: number;
      correctionIndex: number;
      correction: Correction;
      searchText: string;
    }> = [];

    corrections.forEach((correction, index) => {
      const searchText = type === 'input' ? correction.incorrect : correction.correct;
      let searchIndex = 0;
      
      // Find all occurrences of this correction in the text
      while (searchIndex < text.length) {
        const position = text.indexOf(searchText, searchIndex);
        if (position === -1) break;
        
        // Check if this position overlaps with existing markers
        const hasOverlap = markers.some(marker => 
          (position >= marker.position && position < marker.position + marker.length) ||
          (position + searchText.length > marker.position && position < marker.position + marker.length)
        );
        
        if (!hasOverlap) {
          markers.push({
            position,
            length: searchText.length,
            correctionIndex: index,
            correction,
            searchText
          });
        }
        
        searchIndex = position + 1;
      }
    });

    // Sort markers by position
    markers.sort((a, b) => a.position - b.position);

    console.log('Final markers:', markers);

    // Build segments from markers
    const segments: HighlightedSegment[] = [];
    let lastIndex = 0;

    markers.forEach((marker) => {
      // Add text before the marker
      if (marker.position > lastIndex) {
        const beforeText = text.substring(lastIndex, marker.position);
        if (beforeText) {
          segments.push({
            text: beforeText,
            isHighlighted: false,
            type: 'normal'
          });
        }
      }

      // Add the highlighted segment
      const highlightType = type === 'input' ? 'incorrect' : 'correct';
      segments.push({
        text: marker.searchText,
        isHighlighted: selectedCorrectionIndex === marker.correctionIndex,
        type: highlightType,
        correctionIndex: marker.correctionIndex,
        source: marker.correction.source
      });

      lastIndex = marker.position + marker.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        segments.push({
          text: remainingText,
          isHighlighted: false,
          type: 'normal'
        });
      }
    }

    console.log('Final segments:', segments);
    console.log('=== ROBUST HIGHLIGHTING END ===');

    return segments;
  };

  const highlightCorrection = (correctionIndex: number) => {
    setSelectedCorrectionIndex(prevIndex => 
      prevIndex === correctionIndex ? null : correctionIndex
    );
    console.log(`Highlighted correction index: ${correctionIndex}`);
  };

  const clearHighlight = () => {
    setSelectedCorrectionIndex(null);
    console.log('Cleared all highlights');
  };

  return {
    selectedCorrectionIndex,
    parseTextWithHighlights,
    highlightCorrection,
    clearHighlight
  };
};