
import { useState, useMemo } from 'react';
import { Correction } from '@/types/grammarChecker';
import { logger } from '@/utils/logger';

export interface HighlightedSegment {
  text: string;
  isHighlighted: boolean;
  type: 'incorrect' | 'correct' | 'normal';
  correctionIndex?: number;
  position: { start: number; end: number };
}

export const useTextHighlighting = () => {
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);

  // Enhanced Hindi-aware text matching
  const findWordPositions = (text: string, searchWord: string): Array<{ start: number; end: number }> => {
    const positions: Array<{ start: number; end: number }> = [];
    
    // Create multiple search strategies for robust matching
    const searchStrategies = [
      // Exact match
      searchWord,
      // Trimmed match (remove extra spaces)
      searchWord.trim(),
      // Normalized match (normalize Unicode)
      searchWord.normalize('NFD'),
    ];

    for (const strategy of searchStrategies) {
      if (!strategy) continue;
      
      // Use regex for word boundary-aware matching in Hindi
      const escapedWord = strategy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Hindi word boundary patterns
      const patterns = [
        // Standard word boundaries
        new RegExp(`\\b${escapedWord}\\b`, 'gi'),
        // Hindi-specific boundaries (space, punctuation, devanagari marks)
        new RegExp(`(^|[\\s\\u0964\\u0965।\\.,!?;:])${escapedWord}(?=[\\s\\u0964\\u0965।\\.,!?;:]|$)`, 'gi'),
        // Fallback: exact substring match
        new RegExp(escapedWord, 'gi')
      ];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const start = match.index + (match[1] ? match[1].length : 0);
          const end = start + strategy.length;
          
          // Avoid duplicates
          const isDuplicate = positions.some(pos => 
            Math.abs(pos.start - start) < 3 && Math.abs(pos.end - end) < 3
          );
          
          if (!isDuplicate) {
            positions.push({ start, end });
          }
        }
      }
      
      // If we found matches with this strategy, use them
      if (positions.length > 0) break;
    }

    return positions;
  };

  const parseTextWithHighlights = useMemo(() => {
    return (
      text: string, 
      corrections: Correction[], 
      type: 'input' | 'output'
    ): HighlightedSegment[] => {
      if (!text || corrections.length === 0) {
        return [{ 
          text, 
          isHighlighted: false, 
          type: 'normal',
          position: { start: 0, end: text.length }
        }];
      }

      logger.debug('Parsing text with highlights', { 
        textLength: text.length, 
        correctionsCount: corrections.length, 
        type 
      }, 'useTextHighlighting');

      const segments: HighlightedSegment[] = [];
      const processedRanges: Array<{ start: number; end: number; correctionIndex: number }> = [];

      // Find all correction positions in the text
      corrections.forEach((correction, index) => {
        const searchText = type === 'input' ? correction.incorrect : correction.correct;
        const highlightType = type === 'input' ? 'incorrect' : 'correct';
        
        const positions = findWordPositions(text, searchText);
        
        positions.forEach(position => {
          // Avoid overlapping ranges
          const isOverlapping = processedRanges.some(range => 
            (position.start < range.end && position.end > range.start)
          );
          
          if (!isOverlapping) {
            processedRanges.push({
              start: position.start,
              end: position.end,
              correctionIndex: index
            });
          }
        });
      });

      // Sort ranges by start position
      processedRanges.sort((a, b) => a.start - b.start);

      let lastIndex = 0;

      // Create segments with highlights
      processedRanges.forEach(range => {
        // Add text before this correction
        if (range.start > lastIndex) {
          segments.push({
            text: text.substring(lastIndex, range.start),
            isHighlighted: false,
            type: 'normal',
            position: { start: lastIndex, end: range.start }
          });
        }

        // Add the highlighted correction
        const correction = corrections[range.correctionIndex];
        const segmentText = text.substring(range.start, range.end);
        
        segments.push({
          text: segmentText,
          isHighlighted: selectedCorrectionIndex === range.correctionIndex,
          type: type === 'input' ? 'incorrect' : 'correct',
          correctionIndex: range.correctionIndex,
          position: { start: range.start, end: range.end }
        });

        lastIndex = range.end;
      });

      // Add remaining text
      if (lastIndex < text.length) {
        segments.push({
          text: text.substring(lastIndex),
          isHighlighted: false,
          type: 'normal',
          position: { start: lastIndex, end: text.length }
        });
      }

      logger.debug('Generated highlight segments', { 
        segmentsCount: segments.length,
        highlightedSegments: segments.filter(s => s.type !== 'normal').length
      }, 'useTextHighlighting');

      return segments;
    };
  }, [selectedCorrectionIndex]);

  const highlightCorrection = (correctionIndex: number) => {
    setSelectedCorrectionIndex(prevIndex => 
      prevIndex === correctionIndex ? null : correctionIndex
    );
    logger.debug('Correction highlight toggled', { correctionIndex }, 'useTextHighlighting');
  };

  const clearHighlight = () => {
    setSelectedCorrectionIndex(null);
    logger.debug('All highlights cleared', undefined, 'useTextHighlighting');
  };

  const hasHighlights = (segments: HighlightedSegment[]) => {
    return segments.some(segment => segment.type !== 'normal');
  };

  return {
    selectedCorrectionIndex,
    parseTextWithHighlights,
    highlightCorrection,
    clearHighlight,
    hasHighlights
  };
};
