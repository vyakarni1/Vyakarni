
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

export const applyDictionaryCorrections = (text: string): { correctedText: string; corrections: Correction[] } => {
  let correctedText = text;
  const corrections: Correction[] = [];

  wordReplacements.forEach(({ original, replacement }) => {
    const regex = new RegExp(`\\b${original}\\b`, 'g');
    const matches = text.match(regex);
    
    if (matches) {
      correctedText = correctedText.replace(regex, replacement);
      
      // Track each unique correction
      const existingCorrection = corrections.find(c => c.incorrect === original && c.correct === replacement);
      if (!existingCorrection) {
        corrections.push({
          incorrect: original,
          correct: replacement,
          reason: "शब्दावली सुधार - मानक वर्तनी के अनुसार सुधार किया गया",
          type: 'vocabulary',
          source: 'dictionary'
        });
      }
    }
  });

  return { correctedText, corrections };
};

export const trackDictionaryCorrections = (originalText: string, correctedText: string): Correction[] => {
  const corrections: Correction[] = [];
  
  wordReplacements.forEach(({ original, replacement }) => {
    const originalRegex = new RegExp(`\\b${original}\\b`, 'g');
    const originalMatches = originalText.match(originalRegex);
    
    if (originalMatches) {
      corrections.push({
        incorrect: original,
        correct: replacement,
        reason: "शब्दावली सुधार - मानक वर्तनी के अनुसार सुधार किया गया",
        type: 'vocabulary',
        source: 'dictionary'
      });
    }
  });

  return corrections;
};
