
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

export interface DictionaryCorrectionResult {
  correctedText: string;
  corrections: Correction[];
  appliedReplacements: Array<{
    original: string;
    replacement: string;
    positions: Array<{ start: number; end: number }>;
  }>;
}

export const applyEnhancedDictionaryCorrections = (text: string): DictionaryCorrectionResult => {
  console.log('=== ENHANCED DICTIONARY CORRECTIONS START ===');
  console.log('Input text:', text);
  console.log('Input text length:', text.length);
  
  let correctedText = text;
  const corrections: Correction[] = [];
  const appliedReplacements: Array<{
    original: string;
    replacement: string;
    positions: Array<{ start: number; end: number }>;
  }> = [];

  // Sort word replacements by length (longest first) to handle overlapping cases
  const sortedReplacements = [...wordReplacements].sort((a, b) => b.original.length - a.original.length);

  sortedReplacements.forEach(({ original, replacement }) => {
    // Create a more precise regex for Hindi text that respects word boundaries
    const regex = new RegExp(escapeRegExp(original), 'g');
    
    if (regex.test(correctedText)) {
      console.log(`Found match for: "${original}" -> "${replacement}"`);
      
      // Find all positions before replacement
      const positions = findAllPositions(correctedText, original);
      
      if (positions.length > 0) {
        // Apply the replacement
        correctedText = correctedText.replace(regex, replacement);
        
        // Track the applied replacement
        appliedReplacements.push({
          original,
          replacement,
          positions
        });
        
        // Add to corrections list
        corrections.push({
          incorrect: original,
          correct: replacement,
          reason: `शब्दकोश सुधार: "${original}" को "${replacement}" से बदला गया`,
          type: 'spelling',
          source: 'dictionary'
        });
        
        console.log(`Applied replacement: "${original}" -> "${replacement}" at positions:`, positions);
      }
    }
  });

  console.log('=== ENHANCED DICTIONARY CORRECTIONS END ===');
  console.log('Output text:', correctedText);
  console.log('Total corrections applied:', corrections.length);
  console.log('Applied replacements:', appliedReplacements);
  
  return {
    correctedText,
    corrections,
    appliedReplacements
  };
};

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findAllPositions(text: string, searchString: string): Array<{ start: number; end: number }> {
  const positions: Array<{ start: number; end: number }> = [];
  let searchIndex = 0;
  
  while (searchIndex < text.length) {
    const index = text.indexOf(searchString, searchIndex);
    if (index === -1) break;
    
    positions.push({
      start: index,
      end: index + searchString.length
    });
    
    searchIndex = index + 1;
  }
  
  return positions;
}

export const verifyDictionaryCorrections = (text: string): void => {
  console.log('=== DICTIONARY VERIFICATION ===');
  
  wordReplacements.forEach(({ original, replacement }) => {
    if (text.includes(original)) {
      console.warn(`⚠️ Dictionary word "${original}" still found in text - may need better matching`);
    }
  });
  
  console.log('=== VERIFICATION COMPLETE ===');
};
