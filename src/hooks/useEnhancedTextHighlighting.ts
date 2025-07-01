
import { useState } from 'react';
import { Correction } from '@/types/grammarChecker';
import { TextTransformationTracker, WordMapping } from '@/utils/textTransformationTracker';

export interface EnhancedHighlightedSegment {
  text: string;
  isHighlighted: boolean;
  type: 'incorrect' | 'correct' | 'normal';
  correctionIndex?: number;
  transformationStep?: number;
  correctionSource?: 'dictionary' | 'gpt';
  correctionReason?: string;
}

export const useEnhancedTextHighlighting = () => {
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);
  const [transformationTracker] = useState(new TextTransformationTracker(''));

  const parseTextWithEnhancedHighlights = (
    text: string,
    corrections: Correction[],
    type: 'input' | 'output',
    wordMappings?: WordMapping[]
  ): EnhancedHighlightedSegment[] => {
    if (!text || corrections.length === 0) {
      return [{ text, isHighlighted: false, type: 'normal' }];
    }

    console.log('=== ENHANCED HIGHLIGHTING START ===');
    console.log('Text:', text);
    console.log('Corrections:', corrections);
    console.log('Type:', type);
    console.log('Word mappings:', wordMappings);

    const segments: EnhancedHighlightedSegment[] = [];
    let lastIndex = 0;

    // Create a list of all words to highlight with their positions
    const wordsToHighlight: Array<{
      word: string;
      position: number;
      length: number;
      correctionIndex: number;
      highlightType: 'incorrect' | 'correct';
      source: 'dictionary' | 'gpt';
      reason: string;
      step?: number;
    }> = [];

    corrections.forEach((correction, index) => {
      const searchText = type === 'input' ? correction.incorrect : correction.correct;
      const highlightType = type === 'input' ? 'incorrect' : 'correct';
      
      // Find all occurrences of this word
      let searchIndex = 0;
      while (searchIndex < text.length) {
        const wordIndex = text.indexOf(searchText, searchIndex);
        if (wordIndex === -1) break;

        // Check if this position is already covered by a longer word
        const isAlreadyCovered = wordsToHighlight.some(existing => 
          wordIndex >= existing.position && wordIndex < existing.position + existing.length
        );

        if (!isAlreadyCovered) {
          wordsToHighlight.push({
            word: searchText,
            position: wordIndex,
            length: searchText.length,
            correctionIndex: index,
            highlightType,
            source: (correction.source || 'dictionary') as 'dictionary' | 'gpt',
            reason: correction.reason,
            step: correction.step ? parseInt(correction.step.replace('step', '')) : undefined
          });
        }

        searchIndex = wordIndex + 1;
      }
    });

    // Sort by position to process in order
    wordsToHighlight.sort((a, b) => a.position - b.position);

    console.log('Words to highlight:', wordsToHighlight);

    // Build segments
    wordsToHighlight.forEach(wordInfo => {
      // Add text before the highlighted word
      if (wordInfo.position > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, wordInfo.position),
          isHighlighted: false,
          type: 'normal'
        });
      }

      // Add the highlighted word
      segments.push({
        text: wordInfo.word,
        isHighlighted: selectedCorrectionIndex === wordInfo.correctionIndex,
        type: wordInfo.highlightType,
        correctionIndex: wordInfo.correctionIndex,
        transformationStep: wordInfo.step,
        correctionSource: wordInfo.source,
        correctionReason: wordInfo.reason
      });

      lastIndex = wordInfo.position + wordInfo.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isHighlighted: false,
        type: 'normal'
      });
    }

    console.log('Generated segments:', segments);
    console.log('=== ENHANCED HIGHLIGHTING END ===');

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
    parseTextWithEnhancedHighlights,
    highlightCorrection,
    clearHighlight,
    transformationTracker
  };
};
