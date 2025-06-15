
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";
import { logger } from '@/utils/logger';

// Helper function to escape special regex characters in Devanagari text
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Create a robust word boundary pattern for Devanagari text
const createDevanagariWordBoundary = (word: string): RegExp => {
  const escapedWord = escapeRegex(word);
  // Match at start of string, after whitespace, or after punctuation
  return new RegExp(`(^|[\\s\\u0964\\u0965।\\.,!?;:])${escapedWord}(?=[\\s\\u0964\\u0965।\\.,!?;:]|$)`, 'g');
};

// Simple replacement method for final pass corrections
const createSimpleReplacement = (original: string, replacement: string): ((text: string) => string) => {
  return (text: string) => text.split(original).join(replacement);
};

export const applyDictionaryCorrections = (
  text: string, 
  useAdvancedBoundaries: boolean = true
): { correctedText: string; corrections: Correction[] } => {
  let correctedText = text;
  const corrections: Correction[] = [];

  logger.debug('Dictionary corrections started', { 
    textLength: text.length, 
    useAdvancedBoundaries 
  }, 'dictionaryProcessor');

  wordReplacements.forEach(({ original, replacement }) => {
    let replacementCount = 0;
    const beforeReplacement = correctedText;

    if (useAdvancedBoundaries) {
      // Use advanced regex with word boundaries
      const regex = createDevanagariWordBoundary(original);
      const testMatches = correctedText.match(new RegExp(escapeRegex(original), 'g'));
      
      if (testMatches) {
        correctedText = correctedText.replace(regex, (match, prefix) => {
          replacementCount++;
          return prefix + replacement;
        });
      }
    } else {
      // Use simple split-join method for final pass
      if (correctedText.includes(original)) {
        const beforeMatches = correctedText.split(original).length - 1;
        const replacer = createSimpleReplacement(original, replacement);
        correctedText = replacer(correctedText);
        
        if (correctedText !== beforeReplacement && beforeMatches > 0) {
          replacementCount = beforeMatches;
        }
      }
    }

    if (replacementCount > 0) {
      logger.debug(`Dictionary correction applied`, { 
        original, 
        replacement, 
        count: replacementCount 
      }, 'dictionaryProcessor');
      
      corrections.push({
        incorrect: original,
        correct: replacement,
        reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
        type: 'vocabulary',
        source: 'dictionary'
      });
    }
  });

  logger.info('Dictionary corrections completed', { 
    totalCorrections: corrections.length,
    textChanged: correctedText !== text
  }, 'dictionaryProcessor');
  
  return { correctedText, corrections };
};

// Apply initial dictionary corrections with advanced word boundaries
export const applyInitialDictionaryCorrections = (text: string) => {
  return applyDictionaryCorrections(text, true);
};

// Apply final dictionary corrections with simple replacement
export const applyFinalDictionaryCorrections = (text: string) => {
  return applyDictionaryCorrections(text, false);
};

// Verification function for specific test words
export const verifyCorrections = (text: string): void => {
  logger.debug('Verifying specific corrections', undefined, 'dictionaryProcessor');
  
  const testWords = ['शुभकामनाएं', 'खाएं', 'जाएं', 'गए', 'आए', 'हुए'];
  const expectedWords = ['शुभकामनायें', 'खाये', 'जाये', 'गये', 'आये', 'हुये'];
  
  const verificationResults = testWords.map((word, index) => {
    const hasOriginal = text.includes(word);
    const hasExpected = text.includes(expectedWords[index]);
    return {
      original: word,
      expected: expectedWords[index],
      hasOriginal,
      hasExpected
    };
  });
  
  logger.debug('Verification results', { results: verificationResults }, 'dictionaryProcessor');
};

// Track dictionary corrections between two text versions
export const trackDictionaryCorrections = (originalText: string, correctedText: string): Correction[] => {
  const corrections: Correction[] = [];
  
  logger.debug('Tracking dictionary corrections', { 
    originalLength: originalText.length,
    correctedLength: correctedText.length
  }, 'dictionaryProcessor');
  
  wordReplacements.forEach(({ original, replacement }) => {
    const originalExists = originalText.includes(original);
    const replacementExists = correctedText.includes(replacement);
    
    if (originalExists && replacementExists) {
      corrections.push({
        incorrect: original,
        correct: replacement,
        reason: `शब्दावली सुधार - "${original}" को मानक वर्तनी "${replacement}" के अनुसार सुधार किया गया`,
        type: 'vocabulary',
        source: 'dictionary'
      });
    }
  });

  logger.debug('Dictionary corrections tracked', { count: corrections.length }, 'dictionaryProcessor');
  return corrections;
};
