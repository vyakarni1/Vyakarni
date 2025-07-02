
import React from 'react';
import { HighlightedSegment } from '@/hooks/useAdvancedHighlighting';

interface HighlightedTextProps {
  segments: HighlightedSegment[];
  onSegmentClick?: (correctionIndex: number) => void;
  className?: string;
}

const HighlightedText = ({ segments, onSegmentClick, className = "" }: HighlightedTextProps) => {
  const getSegmentStyles = (segment: HighlightedSegment) => {
    if (!segment.isHighlighted && segment.type === 'normal') {
      return "";
    }

    const baseStyles = "transition-all duration-300 ease-in-out rounded-md px-1 py-0.5 mx-0.5";
    
    if (segment.isHighlighted) {
      if (segment.type === 'incorrect') {
        return segment.source === 'gpt' 
          ? `${baseStyles} bg-blue-200 border-l-4 border-blue-500 text-blue-900 shadow-lg transform scale-105`
          : `${baseStyles} bg-red-200 border-l-4 border-red-500 text-red-900 shadow-lg transform scale-105`;
      } else if (segment.type === 'correct') {
        return segment.source === 'gpt'
          ? `${baseStyles} bg-blue-200 border-l-4 border-blue-500 text-blue-900 shadow-lg transform scale-105`
          : `${baseStyles} bg-green-200 border-l-4 border-green-500 text-green-900 shadow-lg transform scale-105`;
      }
    } else {
      // Subtle indication for non-highlighted corrections with source attribution
      if (segment.type === 'incorrect') {
        return segment.source === 'gpt'
          ? `${baseStyles} bg-blue-50 text-blue-700 border-l-2 border-blue-300 hover:bg-blue-100 cursor-pointer`
          : `${baseStyles} bg-red-50 text-red-700 border-l-2 border-red-300 hover:bg-red-100 cursor-pointer`;
      } else if (segment.type === 'correct') {
        return segment.source === 'gpt'
          ? `${baseStyles} bg-blue-50 text-blue-700 border-l-2 border-blue-300 hover:bg-blue-100 cursor-pointer`
          : `${baseStyles} bg-green-50 text-green-700 border-l-2 border-green-300 hover:bg-green-100 cursor-pointer`;
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
    <div className={`leading-relaxed ${className}`}>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={getSegmentStyles(segment)}
          onClick={() => handleSegmentClick(segment)}
          style={{
            display: 'inline',
            whiteSpace: 'pre-wrap'
          }}
        >
          {segment.text}
        </span>
      ))}
    </div>
  );
};

export default HighlightedText;
