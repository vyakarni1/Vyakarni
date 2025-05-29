
import React from 'react';
import { Correction } from "@/types/grammarChecker";

interface OriginalHighlightedTextProps {
  text: string;
  corrections: Correction[];
  selectedCorrectionId: string | null;
  onClick: () => void;
}

const OriginalHighlightedText = ({ text, corrections, selectedCorrectionId, onClick }: OriginalHighlightedTextProps) => {
  const selectedCorrection = corrections.find(c => c.id === selectedCorrectionId);
  
  if (!selectedCorrection || !text) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    );
  }

  // Find all occurrences of the incorrect word in the original text
  const incorrectWord = selectedCorrection.incorrect;
  
  // Skip highlighting for special cases like [अनुपस्थित] or [हटाया गया]
  if (incorrectWord.startsWith('[') && incorrectWord.endsWith(']')) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    );
  }
  
  const parts = text.split(new RegExp(`(${incorrectWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return (
    <div onClick={onClick} className="cursor-pointer">
      <p className="text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
        {parts.map((part, index) => {
          const isHighlighted = part.toLowerCase() === incorrectWord.toLowerCase();
          return (
            <span
              key={index}
              className={isHighlighted ? 'bg-red-100 text-red-800 px-1 py-0.5 rounded font-semibold shadow-sm border border-red-200' : ''}
            >
              {part}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default OriginalHighlightedText;
