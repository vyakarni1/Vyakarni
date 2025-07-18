
import { dictionaryService } from "@/services/dictionaryService";
import { Correction } from "@/types/grammarChecker";

// Helper function to escape special regex characters in Devanagari text
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Create a more robust word boundary pattern for Devanagari text
const createDevanagariWordBoundary = (word: string): RegExp => {
  const escapedWord = escapeRegex(word);
  // Use word boundaries that work better with Devanagari
  // Match at start of string, after whitespace, or after punctuation
  return new RegExp(`(^|[\\s\\u0964\\u0965।\\.,!?;:])${escapedWord}(?=[\\s\\u0964\\u0965।\\.,!?;:]|$)`, 'g');
};

export const applyDictionaryCorrections = async (text: string): Promise<{ correctedText: string; corrections: Correction[] }> => {
  let correctedText = text;
  const corrections: Correction[] = [];

  try {
    console.log('=== DICTIONARY CORRECTIONS START ===');
    console.log('Input text:', text);
    console.log('Text length:', text.length);

    // Get dictionary from service
    const wordReplacements = await dictionaryService.getDictionary();

    wordReplacements.forEach(({ original, replacement }) => {
      // Create a more robust regex pattern for Devanagari text
      const regex = createDevanagariWordBoundary(original);
      
      // First check if the word exists in the text
      const testMatches = text.match(new RegExp(escapeRegex(original), 'g'));
      console.log(`Testing word "${original}":`, testMatches ? `${testMatches.length} potential matches` : 'no matches');
      
      if (testMatches) {
        // Apply the correction with proper boundary matching
        let replacementCount = 0;
        const beforeReplacement = correctedText;
        
        correctedText = correctedText.replace(regex, (match, prefix) => {
          replacementCount++;
          console.log(`Replacing match "${match}" with "${prefix}${replacement}"`);
          return prefix + replacement;
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
        } else {
          console.log(`❌ No replacement made for: "${original}" (regex didn't match)`);
          console.log('Regex used:', regex);
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
  } catch (error) {
    console.error('Error in dictionary corrections:', error);
    return { correctedText: text, corrections: [] };
  }
};

export const trackDictionaryCorrections = async (originalText: string, correctedText: string): Promise<Correction[]> => {
  const corrections: Correction[] = [];
  
  try {
    console.log('=== TRACKING DICTIONARY CORRECTIONS ===');
    console.log('Original:', originalText);
    console.log('Corrected:', correctedText);
    
    // Get dictionary from service
    const wordReplacements = await dictionaryService.getDictionary();
    
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
  } catch (error) {
    console.error('Error tracking dictionary corrections:', error);
    return [];
  }
};
