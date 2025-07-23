import { dictionaryService } from "@/services/dictionaryService";

export async function applyStyleEnhancementDictionaryCorrections(text: string): Promise<string> {
  let correctedText = text;

  try {
    console.log('=== STYLE ENHANCEMENT DICTIONARY CORRECTIONS START ===');
    console.log('Input text:', text);

    // Get style dictionary from service (database only)
    const wordReplacements = await dictionaryService.getStyleDictionary();
    
    if (wordReplacements.length === 0) {
      console.warn('No style dictionary entries available. Skipping style dictionary corrections.');
      return text;
    }

    console.log(`Loaded ${wordReplacements.length} style dictionary entries from database`);

    wordReplacements.forEach(({ original, replacement }) => {
      // Check if the original word exists in the text
      if (correctedText.includes(original)) {
        console.log(`Found word "${original}" in text, replacing with "${replacement}"`);
        
        // Replace all occurrences globally using split and join method
        correctedText = correctedText.split(original).join(replacement);
        
        console.log(`✅ Successfully replaced "${original}" with "${replacement}"`);
      }
    });

    console.log(`Style dictionary corrections completed`);
    console.log('Final corrected text:', correctedText);
    console.log('=== STYLE ENHANCEMENT DICTIONARY CORRECTIONS END ===');
    
    return correctedText;
  } catch (error) {
    console.error('Error in style enhancement dictionary corrections:', error);
    return text;
  }
}