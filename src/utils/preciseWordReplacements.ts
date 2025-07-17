import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

// Devanagari word boundary patterns
const DEVANAGARI_RANGE = '\u0900-\u097F';
const WORD_BOUNDARY_BEFORE = `(?<![${DEVANAGARI_RANGE}])`;
const WORD_BOUNDARY_AFTER = `(?![${DEVANAGARI_RANGE}])`;

export const applyPreciseWordReplacements = (text: string): { correctedText: string; corrections: Correction[] } => {
  let correctedText = text;
  const corrections: Correction[] = [];

  console.log('=== PRECISE WORD REPLACEMENTS START ===');
  console.log('Input text:', text);

  wordReplacements.forEach(({ original, replacement }) => {
    // Create regex pattern for exact word matching with Devanagari boundaries
    const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordPattern = new RegExp(
      `${WORD_BOUNDARY_BEFORE}${escapedOriginal}${WORD_BOUNDARY_AFTER}`,
      'g'
    );

    // Check if pattern matches
    const matches = correctedText.match(wordPattern);
    if (matches && matches.length > 0) {
      console.log(`✅ Found exact word "${original}" (${matches.length} times), replacing with "${replacement}"`);
      
      // Replace using the regex pattern
      const beforeReplacement = correctedText;
      correctedText = correctedText.replace(wordPattern, replacement);
      
      if (correctedText !== beforeReplacement) {
        corrections.push({
          incorrect: original,
          correct: replacement,
          reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
          type: 'vocabulary',
          source: 'dictionary'
        });
      }
    } else {
      console.log(`ℹ️ Exact word "${original}" not found in text`);
    }
  });

  console.log(`Precise word replacements completed: ${corrections.length} corrections applied`);
  console.log('Final corrected text:', correctedText);
  console.log('=== PRECISE WORD REPLACEMENTS END ===');
  
  return { correctedText, corrections };
};

// Validation function to test specific problematic cases
export const validateReplacements = (text: string): void => {
  console.log('=== VALIDATION OF PROBLEMATIC CASES ===');
  
  // Test cases that should NOT be replaced
  const shouldNotChange = ['परम्पराओं', 'शुभकामनाओं', 'खाओं', 'जाओं'];
  
  shouldNotChange.forEach(word => {
    const { correctedText } = applyPreciseWordReplacements(word);
    const unchanged = correctedText === word;
    console.log(`Word "${word}": ${unchanged ? '✅ UNCHANGED' : '❌ INCORRECTLY CHANGED to "' + correctedText + '"'}`);
  });
  
  // Test cases that SHOULD be replaced
  const shouldChange = [
    { original: 'शुभकामनाएं', expected: 'शुभकामनायें' },
    { original: 'खाएं', expected: 'खाये' },
    { original: 'जाएं', expected: 'जाये' }
  ];
  
  shouldChange.forEach(({ original, expected }) => {
    const { correctedText } = applyPreciseWordReplacements(original);
    const correct = correctedText === expected;
    console.log(`Word "${original}": ${correct ? '✅ CORRECTLY CHANGED to "' + expected + '"' : '❌ INCORRECT RESULT "' + correctedText + '"'}`);
  });
  
  console.log('=== VALIDATION END ===');
};