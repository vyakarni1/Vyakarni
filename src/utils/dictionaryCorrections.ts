
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

// Helper function to escape special regex characters in Devanagari text
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Create a more robust word boundary pattern for Devanagari text
const createDevanagariWordBoundary = (word: string): RegExp => {
  const escapedWord = escapeRegex(word);
  // Simplified approach: match the word with optional word boundaries
  // This catches words in context better than strict boundary matching
  return new RegExp(`\\b${escapedWord}\\b|(?<=\\s|^)${escapedWord}(?=\\s|$)|${escapedWord}`, 'g');
};

export const applyDictionaryCorrections = (text: string): { correctedText: string; corrections: Correction[] } => {
  let correctedText = text;
  const corrections: Correction[] = [];

  console.log('=== DICTIONARY CORRECTIONS START ===');
  console.log('Input text:', text);
  console.log('Text length:', text.length);

  wordReplacements.forEach(({ original, replacement }) => {
    // Use simpler global replacement for better matching
    const beforeReplacement = correctedText;
    let replacementCount = 0;
    
    // Check if the word exists in the text first
    if (correctedText.includes(original)) {
      console.log(`Found word "${original}" in text`);
      
      // Simple global replacement with tracking
      correctedText = correctedText.replace(new RegExp(escapeRegex(original), 'g'), (match) => {
        replacementCount++;
        console.log(`Replacing "${match}" with "${replacement}"`);
        return replacement;
      });
      
      if (replacementCount > 0) {
        console.log(`✅ Dictionary correction applied: "${original}" → "${replacement}" (${replacementCount} occurrences)`);
        console.log('Text before:', beforeReplacement);
        console.log('Text after:', correctedText);
        
        // Track the correction
        corrections.push({
          incorrect: original,
          correct: replacement,
          reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
          type: 'vocabulary',
          source: 'dictionary'
        });
      }
    } else {
      console.log(`ℹ️ Word "${original}" not found in text`);
    }
  });

  console.log(`Dictionary corrections completed: ${corrections.length} corrections found`);
  console.log('Final corrected text:', correctedText);
  console.log('Original vs Final comparison:');
  console.log('Original:', text);
  console.log('Final:   ', correctedText);
  console.log('=== DICTIONARY CORRECTIONS END ===');
  
  return { correctedText, corrections };
};

export const trackDictionaryCorrections = (originalText: string, correctedText: string): Correction[] => {
  const corrections: Correction[] = [];
  
  console.log('=== TRACKING DICTIONARY CORRECTIONS ===');
  console.log('Original:', originalText);
  console.log('Corrected:', correctedText);
  
  wordReplacements.forEach(({ original, replacement }) => {
    // Check if the original word exists in original text
    const originalExists = originalText.includes(original);
    // Check if the replacement exists in corrected text
    const replacementExists = correctedText.includes(replacement);
    
    if (originalExists && replacementExists) {
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
