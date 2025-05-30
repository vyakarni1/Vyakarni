
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

export const applyDictionaryCorrections = (text: string): { correctedText: string; corrections: Correction[] } => {
  let correctedText = text;
  const corrections: Correction[] = [];

  wordReplacements.forEach(({ original, replacement }) => {
    // Use word boundary regex for precise matching
    const regex = new RegExp(`\\b${original}\\b`, 'g');
    const matches = correctedText.match(regex);
    
    if (matches) {
      console.log(`Dictionary correction found: "${original}" → "${replacement}" (${matches.length} occurrences)`);
      correctedText = correctedText.replace(regex, replacement);
      
      // Track each occurrence as a separate correction
      corrections.push({
        incorrect: original,
        correct: replacement,
        reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
        type: 'vocabulary',
        source: 'dictionary'
      });
    }
  });

  console.log(`Dictionary corrections applied: ${corrections.length} corrections found`);
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
        reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
        type: 'vocabulary',
        source: 'dictionary'
      });
    }
  });

  return corrections;
};
