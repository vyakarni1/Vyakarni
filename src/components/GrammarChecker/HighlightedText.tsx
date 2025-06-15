
import React from 'react';
import { HighlightedSegment } from '@/hooks/useTextHighlighting';

interface HighlightedTextProps {
  segments: HighlightedSegment[];
  onSegmentClick?: (correctionIndex: number) => void;
  className?: string;
  showAllHighlights?: boolean;
}

const HighlightedText = ({ 
  segments, 
  onSegmentClick, 
  className = "",
  showAllHighlights = true 
}: HighlightedTextProps) => {
  
  const getSegmentStyles = (segment: HighlightedSegment) => {
    if (segment.type === 'normal') {
      return "";
    }

    const baseStyles = "transition-all duration-200 ease-in-out rounded-sm px-1 py-0.5 mx-0.5 cursor-pointer";
    
    // Always show base highlighting when showAllHighlights is true
    if (showAllHighlights) {
      if (segment.isHighlighted) {
        // Selected/focused state
        if (segment.type === 'incorrect') {
          return `${baseStyles} bg-red-300 border-l-4 border-red-600 text-red-900 shadow-lg transform scale-105 font-semibold`;
        } else if (segment.type === 'correct') {
          return `${baseStyles} bg-green-300 border-l-4 border-green-600 text-green-900 shadow-lg transform scale-105 font-semibold`;
        }
      } else {
        // Base highlighting state (always visible)
        if (segment.type === 'incorrect') {
          return `${baseStyles} bg-red-100 border-l-2 border-red-400 text-red-800 hover:bg-red-200`;
        } else if (segment.type === 'correct') {
          return `${baseStyles} bg-green-100 border-l-2 border-green-400 text-green-800 hover:bg-green-200`;
        }
      }
    } else {
      // Only show highlights when selected
      if (segment.isHighlighted) {
        if (segment.type === 'incorrect') {
          return `${baseStyles} bg-red-200 border-l-4 border-red-500 text-red-900 shadow-md`;
        } else if (segment.type === 'correct') {
          return `${baseStyles} bg-green-200 border-l-4 border-green-500 text-green-900 shadow-md`;
        }
      } else {
        return `${baseStyles} hover:bg-gray-100`;
      }
    }
    
    return "";
  };

  const handleSegmentClick = (segment: HighlightedSegment) => {
    if (segment.correctionIndex !== undefined && onSegmentClick) {
      onSegmentClick(segment.correctionIndex);
    }
  };

  return (
    <div className={`leading-relaxed select-text ${className}`}>
      {segments.map((segment, index) => (
        <span
          key={`${index}-${segment.position.start}-${segment.position.end}`}
          className={getSegmentStyles(segment)}
          onClick={() => handleSegmentClick(segment)}
          title={segment.type !== 'normal' ? 'Click to highlight this correction' : undefined}
          style={{
            display: 'inline',
            whiteSpace: 'pre-wrap',
            wordBreak: 'keep-all'
          }}
        >
          {segment.text}
        </span>
      ))}
    </div>
  );
};

export default HighlightedText;
