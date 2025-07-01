
import React from 'react';
import { EnhancedHighlightedSegment } from '@/hooks/useEnhancedTextHighlighting';

interface EnhancedHighlightedTextProps {
  segments: EnhancedHighlightedSegment[];
  onSegmentClick?: (correctionIndex: number) => void;
  className?: string;
}

const EnhancedHighlightedText = ({ 
  segments, 
  onSegmentClick, 
  className = "" 
}: EnhancedHighlightedTextProps) => {
  const getSegmentStyles = (segment: EnhancedHighlightedSegment) => {
    if (!segment.isHighlighted && segment.type === 'normal') {
      return "";
    }

    const baseStyles = "transition-all duration-300 ease-in-out rounded-md px-1 py-0.5 mx-0.5 relative";
    
    if (segment.isHighlighted) {
      if (segment.type === 'incorrect') {
        return `${baseStyles} bg-red-200 border-l-4 border-red-500 text-red-900 shadow-lg transform scale-105`;
      } else if (segment.type === 'correct') {
        return `${baseStyles} bg-green-200 border-l-4 border-green-500 text-green-900 shadow-lg transform scale-105`;
      }
    } else {
      // Enhanced styling based on correction source
      if (segment.type === 'incorrect') {
        const sourceColor = segment.correctionSource === 'dictionary' ? 'red' : 'orange';
        return `${baseStyles} bg-${sourceColor}-50 text-${sourceColor}-700 border-l-2 border-${sourceColor}-300 hover:bg-${sourceColor}-100 cursor-pointer`;
      } else if (segment.type === 'correct') {
        const sourceColor = segment.correctionSource === 'dictionary' ? 'green' : 'blue';
        return `${baseStyles} bg-${sourceColor}-50 text-${sourceColor}-700 border-l-2 border-${sourceColor}-300 hover:bg-${sourceColor}-100 cursor-pointer`;
      }
    }
    
    return "";
  };

  const getTooltipContent = (segment: EnhancedHighlightedSegment) => {
    if (segment.correctionReason) {
      const source = segment.correctionSource === 'dictionary' ? 'शब्दकोश' : 'GPT';
      const step = segment.transformationStep ? ` (चरण ${segment.transformationStep})` : '';
      return `${source}${step}: ${segment.correctionReason}`;
    }
    return '';
  };

  const handleSegmentClick = (segment: EnhancedHighlightedSegment) => {
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
          title={getTooltipContent(segment)}
          style={{
            display: 'inline',
            whiteSpace: 'pre-wrap'
          }}
        >
          {segment.text}
          {segment.correctionSource && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 opacity-60 text-xs"></span>
          )}
        </span>
      ))}
    </div>
  );
};

export default EnhancedHighlightedText;
