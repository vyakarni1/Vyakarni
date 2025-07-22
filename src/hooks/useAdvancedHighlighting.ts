import { useState } from 'react';
import { Correction } from '@/types/grammarChecker';

export interface HighlightedSegment {
  text: string;
  isHighlighted: boolean;
  type: 'incorrect' | 'correct' | 'normal';
  correctionIndex?: number;
  source?: 'gpt' | 'dictionary' | 'grok';
}

export const useAdvancedHighlighting = () => {
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);

  const parseTextWithHighlights = (
    text: string, 
    corrections: Correction[], 
    type: 'input' | 'output'
  ): HighlightedSegment[] => {
    if (!text || corrections.length === 0) {
      return [{ text, isHighlighted: false, type: 'normal' }];
    }

    console.log('=== ADVANCED HIGHLIGHTING START ===');
    console.log(`Parsing ${type} text:`, text);
    console.log('Corrections to highlight:', corrections);

    const segments: HighlightedSegment[] = [];
    let processedText = text;
    let lastIndex = 0;

    // Create a sorted list of corrections by their position in the text
    const sortedCorrections = corrections
      .map((correction, index) => {
        const searchText = type === 'input' ? correction.incorrect : correction.correct;
        const position = processedText.indexOf(searchText);
        return {
          correction,
          index,
          searchText,
          position: position !== -1 ? position : Infinity
        };
      })
      .filter(item => item.position !== Infinity)
      .sort((a, b) => a.position - b.position);

    console.log('Sorted corrections by position:', sortedCorrections);

    sortedCorrections.forEach((item) => {
      const { correction, index, searchText, position } = item;
      const highlightType = type === 'input' ? 'incorrect' : 'correct';
      
      console.log(`Processing correction ${index}: "${searchText}" at position ${position}`);
      
      // Add text before the correction
      if (position > lastIndex) {
        const beforeText = processedText.substring(lastIndex, position);
        if (beforeText) {
          segments.push({
            text: beforeText,
            isHighlighted: false,
            type: 'normal'
          });
          console.log(`Added normal text: "${beforeText}"`);
        }
      }
      
      // Add the highlighted correction
      segments.push({
        text: searchText,
        isHighlighted: selectedCorrectionIndex === index,
        type: highlightType,
        correctionIndex: index,
        source: correction.source
      });
      
      console.log(`Added ${highlightType} segment: "${searchText}" (highlighted: ${selectedCorrectionIndex === index})`);
      
      lastIndex = position + searchText.length;
    });

    // Add remaining text
    if (lastIndex < processedText.length) {
      const remainingText = processedText.substring(lastIndex);
      if (remainingText) {
        segments.push({
          text: remainingText,
          isHighlighted: false,
          type: 'normal'
        });
        console.log(`Added remaining normal text: "${remainingText}"`);
      }
    }

    console.log('Final segments:', segments);
    console.log('=== ADVANCED HIGHLIGHTING END ===');

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