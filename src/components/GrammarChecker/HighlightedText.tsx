
import React, { useState } from 'react';
import { HighlightedSegment } from '@/hooks/useRobustHighlighting';
import CorrectionPopup from './CorrectionPopup';
import { Correction } from '@/types/grammarChecker';

interface HighlightedTextProps {
  segments: HighlightedSegment[];
  onSegmentClick?: (correctionIndex: number) => void;
  className?: string;
  corrections?: Correction[];
}

const HighlightedText = ({ segments, onSegmentClick, className = "", corrections = [] }: HighlightedTextProps) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null);
  const getSegmentStyles = (segment: HighlightedSegment) => {
    if (!segment.isHighlighted && segment.type === 'normal') {
      return "";
    }

    const baseStyles = "transition-all duration-300 ease-in-out rounded-md px-1 py-0.5 mx-0.5";
    
    if (segment.isHighlighted) {
      if (segment.type === 'incorrect') {
        return `${baseStyles} bg-red-200 border-l-4 border-red-500 text-red-900 shadow-lg transform scale-105`;
      } else if (segment.type === 'correct') {
        return `${baseStyles} bg-green-200 border-l-4 border-green-500 text-green-900 shadow-lg transform scale-105`;
      }
    } else {
      // Subtle indication for non-highlighted corrections
      if (segment.type === 'incorrect') {
        return `${baseStyles} bg-red-50 text-red-700 border-l-2 border-red-300 hover:bg-red-100 cursor-pointer`;
      } else if (segment.type === 'correct') {
        return `${baseStyles} bg-green-50 text-green-700 border-l-2 border-green-300 hover:bg-green-100 cursor-pointer`;
      }
    }
    
    return "";
  };

  const handleSegmentClick = (segment: HighlightedSegment, event: React.MouseEvent) => {
    if (segment.correctionIndex !== undefined) {
      // Call original handler for highlighting
      if (onSegmentClick) {
        onSegmentClick(segment.correctionIndex);
      }
      
      // Show popup with correction details
      if (corrections && corrections[segment.correctionIndex]) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setPopupPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        });
        setSelectedCorrection(corrections[segment.correctionIndex]);
        setPopupVisible(true);
      }
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedCorrection(null);
  };

  return (
    <>
      <div className={`leading-relaxed ${className}`}>
        {segments.map((segment, index) => (
          <span
            key={index}
            className={getSegmentStyles(segment)}
            onClick={(e) => handleSegmentClick(segment, e)}
            style={{
              display: 'inline',
              whiteSpace: 'pre-wrap'
            }}
          >
            {segment.text}
          </span>
        ))}
      </div>
      
      {/* Correction Popup */}
      {selectedCorrection && (
        <CorrectionPopup
          correction={selectedCorrection}
          isVisible={popupVisible}
          onClose={closePopup}
          position={popupPosition}
        />
      )}
    </>
  );
};

export default HighlightedText;
