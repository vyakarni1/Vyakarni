
import { dictionaryService } from "@/services/dictionaryService";
import { Correction } from "@/types/grammarChecker";

export async function applySimpleDictionaryCorrections(text: string): Promise<{ correctedText: string; corrections: Correction[] }> {
  let correctedText = text;
  const corrections: Correction[] = [];

  try {
    console.log('=== SIMPLE DICTIONARY CORRECTIONS START ===');
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
      // Simple global replacement using split and join for maximum reliability
      if (correctedText.includes(original)) {
        console.log(`Found word "${original}" in text, replacing with "${replacement}"`);
        
        // Count occurrences before replacement
        const beforeMatches = correctedText.split(original).length - 1;
        
        // Replace all occurrences globally
        const beforeReplacement = correctedText;
        correctedText = correctedText.split(original).join(replacement);
        
        // Verify the replacement happened
        if (correctedText !== beforeReplacement && beforeMatches > 0) {
          console.log(`✅ Successfully replaced "${original}" with "${replacement}" (${beforeMatches} times)`);
          console.log('Before:', beforeReplacement);
          console.log('After:', correctedText);
          
          // Track the correction
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

    console.log(`Simple dictionary corrections completed: ${corrections.length} corrections found`);
    console.log('Final corrected text:', correctedText);
    console.log('Original vs Final comparison:');
    console.log('Original:', text);
    console.log('Final:   ', correctedText);
    console.log('=== SIMPLE DICTIONARY CORRECTIONS END ===');
    
    return { correctedText, corrections };
  } catch (error) {
    console.error('Error in simple dictionary corrections:', error);
    return { correctedText: text, corrections: [] };
  }
}
