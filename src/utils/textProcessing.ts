
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

export const applyWordReplacements = (text: string): {
  correctedText: string;
  appliedCorrections: Correction[];
} => {
  let correctedText = text;
  const appliedCorrections: Correction[] = [];
  
  wordReplacements.forEach(({ original, replacement }) => {
    const regex = new RegExp(original, 'g');
    if (regex.test(correctedText)) {
      correctedText = correctedText.replace(regex, replacement);
      appliedCorrections.push({
        incorrect: original,
        correct: replacement,
        reason: `सही वर्तनी के लिए "${original}" को "${replacement}" से बदला गया`,
        type: 'spelling'
      });
    }
  });
  
  return { correctedText, appliedCorrections };
};

export const extractCorrectionsFromResponse = (original: string, corrected: string): Correction[] => {
  const foundCorrections: Correction[] = [];

  // First, add word replacement corrections
  const { appliedCorrections } = applyWordReplacements(original);
  foundCorrections.push(...appliedCorrections);

  // Split texts into sentences for better comparison
  const originalSentences = original.split(/[।\.\!\?]+/).filter(s => s.trim());
  const correctedSentences = corrected.split(/[।\.\!\?]+/).filter(s => s.trim());

  // Compare words across the entire text
  const originalWords = original.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const correctedWords = corrected.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  let originalIndex = 0;
  let correctedIndex = 0;

  while (originalIndex < originalWords.length && correctedIndex < correctedWords.length) {
    const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
    const correctedWord = correctedWords[correctedIndex].replace(/[।\.\!\?,;:]/g, '');

    if (originalWord !== correctedWord) {
      // Skip if already covered by word replacements
      const alreadyCovered = foundCorrections.some(c => 
        originalWord.includes(c.incorrect.toLowerCase()) || 
        correctedWord.includes(c.correct.toLowerCase())
      );
      
      if (!alreadyCovered && originalWord.length > 0 && correctedWord.length > 0) {
        foundCorrections.push({
          incorrect: originalWord,
          correct: correctedWord,
          reason: `व्याकरण सुधार: "${originalWord}" को "${correctedWord}" से बदला गया`,
          type: 'grammar'
        });
      }
    }
    originalIndex++;
    correctedIndex++;
  }

  // Check for additional words in corrected text
  while (correctedIndex < correctedWords.length) {
    const correctedWord = correctedWords[correctedIndex].replace(/[।\.\!\?,;:]/g, '');
    if (correctedWord.length > 0) {
      foundCorrections.push({
        incorrect: '[अनुपस्थित]',
        correct: correctedWord,
        reason: 'वाक्य पूर्णता के लिए शब्द जोड़ा गया',
        type: 'syntax'
      });
    }
    correctedIndex++;
  }

  // Check for removed words
  while (originalIndex < originalWords.length) {
    const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
    if (originalWord.length > 0) {
      foundCorrections.push({
        incorrect: originalWord,
        correct: '[हटाया गया]',
        reason: 'अनावश्यक शब्द हटाया गया',
        type: 'syntax'
      });
    }
    originalIndex++;
  }

  return foundCorrections;
};

export const extractStyleEnhancements = (original: string, enhanced: string): Correction[] => {
  const enhancements: Correction[] = [];
  
  // Simple word-level comparison for style enhancements
  const originalWords = original.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const enhancedWords = enhanced.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  let originalIndex = 0;
  let enhancedIndex = 0;

  while (originalIndex < originalWords.length && enhancedIndex < enhancedWords.length) {
    const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
    const enhancedWord = enhancedWords[enhancedIndex].replace(/[।\.\!\?,;:]/g, '');

    if (originalWord !== enhancedWord && originalWord.length > 0 && enhancedWord.length > 0) {
      enhancements.push({
        incorrect: originalWord,
        correct: enhancedWord,
        reason: `शैली सुधार: "${originalWord}" को अधिक प्रभावी "${enhancedWord}" से बदला गया`,
        type: 'vocabulary'
      });
    }
    originalIndex++;
    enhancedIndex++;
  }

  return enhancements;
};
