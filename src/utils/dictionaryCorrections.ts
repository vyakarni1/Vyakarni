
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

// Helper function to escape special regex characters in Devanagari text
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Create a more robust word boundary pattern for Devanagari text
const createDevanagariWordBoundary = (word: string): RegExp => {
  const escapedWord = escapeRegex(word);
  // Use Unicode word boundaries and whitespace/punctuation boundaries
  // \s = whitespace, \p{P} = punctuation, ^ = start of string, $ = end of string
  return new RegExp(`(?<=^|[\\s\\p{P}])${escapedWord}(?=[\\s\\p{P}]|$)`, 'gu');
};

export const applyDictionaryCorrections = (text: string): { correctedText: string; corrections: Correction[] } => {
  let correctedText = text;
  const corrections: Correction[] = [];

  console.log('=== DICTIONARY CORRECTIONS START ===');
  console.log('Input text:', text);

  wordReplacements.forEach(({ original, replacement }) => {
    // Create a more robust regex pattern for Devanagari text
    const regex = createDevanagariWordBoundary(original);
    const matches = correctedText.match(regex);
    
    if (matches) {
      console.log(`Dictionary correction found: "${original}" → "${replacement}" (${matches.length} occurrences)`);
      console.log('Regex pattern used:', regex);
      console.log('Text before replacement:', correctedText);
      
      correctedText = correctedText.replace(regex, replacement);
      console.log('Text after replacement:', correctedText);
      
      // Track each occurrence as a separate correction
      corrections.push({
        incorrect: original,
        correct: replacement,
        reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
        type: 'vocabulary',
        source: 'dictionary'
      });
    } else {
      console.log(`No match found for: "${original}"`);
    }
  });

  console.log(`Dictionary corrections completed: ${corrections.length} corrections found`);
  console.log('Final corrected text:', correctedText);
  console.log('=== DICTIONARY CORRECTIONS END ===');
  
  return { correctedText, corrections };
};

export const trackDictionaryCorrections = (originalText: string, correctedText: string): Correction[] => {
  const corrections: Correction[] = [];
  
  console.log('=== TRACKING DICTIONARY CORRECTIONS ===');
  console.log('Original:', originalText);
  console.log('Corrected:', correctedText);
  
  wordReplacements.forEach(({ original, replacement }) => {
    const originalRegex = createDevanagariWordBoundary(original);
    const originalMatches = originalText.match(originalRegex);
    
    if (originalMatches) {
      console.log(`Tracked correction: "${original}" → "${replacement}"`);
      corrections.push({
        incorrect: original,
        correct: replacement,
        reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
        type: 'vocabulary',
        source: 'dictionary'
      });
    }
  });

  console.log(`Tracked ${corrections.length} dictionary corrections`);
  return corrections;
};
