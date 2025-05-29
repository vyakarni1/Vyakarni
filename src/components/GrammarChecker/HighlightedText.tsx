
import React from 'react';
import { Correction } from "@/types/grammarChecker";

interface HighlightedTextProps {
  text: string;
  corrections: Correction[];
  selectedCorrectionId: string | null;
  onClick: () => void;
}

const HighlightedText = ({ text, corrections, selectedCorrectionId, onClick }: HighlightedTextProps) => {
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

  // Find all occurrences of the corrected word in the text
  const correctedWord = selectedCorrection.correct;
  const parts = text.split(new RegExp(`(${correctedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return (
    <div onClick={onClick} className="cursor-pointer">
      <p className="text-base sm:text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
        {parts.map((part, index) => {
          const isHighlighted = part.toLowerCase() === correctedWord.toLowerCase();
          return (
            <span
              key={index}
              className={isHighlighted ? 'bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-semibold shadow-sm border border-emerald-200' : ''}
            >
              {part}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default HighlightedText;
