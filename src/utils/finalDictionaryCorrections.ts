
import { dictionaryService } from "@/services/dictionaryService";
import { Correction } from "@/types/grammarChecker";

export async function applyFinalDictionaryCorrections(text: string): Promise<{ correctedText: string; corrections: Correction[] }> {
  let correctedText = text;
  const corrections: Correction[] = [];

  try {
    console.log('=== FINAL DICTIONARY CORRECTIONS START ===');
    console.log('Input text:', text);
    console.log('Text length:', text.length);

    // Get dictionary from service (database only)
    const wordReplacements = await dictionaryService.getDictionary();
    
    if (wordReplacements.length === 0) {
      console.warn('No dictionary entries available. Skipping dictionary corrections.');
      return { correctedText: text, corrections: [] };
    }

    console.log(`Loaded ${wordReplacements.length} dictionary entries from database`);

    wordReplacements.forEach(({ original, replacement }) => {
      // Check if the original word exists in the text (simple contains check)
      if (correctedText.includes(original)) {
        console.log(`Found word "${original}" in text, replacing with "${replacement}"`);
        
        // Count how many times it appears before replacement
        const beforeMatches = correctedText.split(original).length - 1;
        
        // Replace all occurrences globally using split and join method
        const beforeReplacement = correctedText;
        correctedText = correctedText.split(original).join(replacement);
        
        // Verify the replacement actually happened
        if (correctedText !== beforeReplacement && beforeMatches > 0) {
          console.log(`✅ Successfully replaced "${original}" with "${replacement}" (${beforeMatches} times)`);
          console.log('Before:', beforeReplacement);
          console.log('After:', correctedText);
          
          corrections.push({
            incorrect: original,
            correct: replacement,
            reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
            type: 'vocabulary',
            source: 'dictionary'
          });
        } else {
          console.log(`❌ Failed to replace "${original}" with "${replacement}"`);
        }
      } else {
        console.log(`ℹ️ Word "${original}" not found in text`);
      }
    });

    console.log(`Final dictionary corrections completed: ${corrections.length} corrections applied`);
    console.log('Final corrected text:', correctedText);
    console.log('Original vs Final:');
    console.log('Original:', text);
    console.log('Final:   ', correctedText);
    console.log('=== FINAL DICTIONARY CORRECTIONS END ===');
    
    return { correctedText, corrections };
  } catch (error) {
    console.error('Error in final dictionary corrections:', error);
    return { correctedText: text, corrections: [] };
  }
}

// Verification function to test specific words
export const verifyCorrections = (text: string): void => {
  console.log('=== VERIFICATION OF SPECIFIC CORRECTIONS ===');
  const testWords = ['शुभकामनाएं', 'खाएं', 'जाएं', 'गए', 'आए', 'हुए'];
  const expectedWords = ['शुभकामनायें', 'खाये', 'जाये', 'गये', 'आये', 'हुये'];
  
  testWords.forEach((word, index) => {
    const hasOriginal = text.includes(word);
    const hasExpected = text.includes(expectedWords[index]);
    console.log(`Word "${word}": original=${hasOriginal}, expected="${expectedWords[index]}"=${hasExpected}`);
  });
  console.log('=== VERIFICATION END ===');
};
