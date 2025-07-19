
import { dictionaryService } from "@/services/dictionaryService";

export async function applySimplifiedDictionaryCorrections(text: string): Promise<string> {
  let correctedText = text;

  try {
    console.log('=== SIMPLIFIED DICTIONARY CORRECTIONS START ===');
    console.log('Input text:', text);

    // Get dictionary from service (database only)
    const wordReplacements = await dictionaryService.getDictionary();
    
    if (wordReplacements.length === 0) {
      console.warn('No dictionary entries available. Skipping dictionary corrections.');
      return text;
    }

    console.log(`Loaded ${wordReplacements.length} dictionary entries from database`);

    wordReplacements.forEach(({ original, replacement }) => {
      // Check if the original word exists in the text
      if (correctedText.includes(original)) {
        console.log(`Found word "${original}" in text, replacing with "${replacement}"`);
        
        // Replace all occurrences globally using split and join method
        correctedText = correctedText.split(original).join(replacement);
        
        console.log(`✅ Successfully replaced "${original}" with "${replacement}"`);
      }
    });

    console.log(`Dictionary corrections completed`);
    console.log('Final corrected text:', correctedText);
    console.log('=== SIMPLIFIED DICTIONARY CORRECTIONS END ===');
    
    return correctedText;
  } catch (error) {
    console.error('Error in simplified dictionary corrections:', error);
    return text;
  }
}
