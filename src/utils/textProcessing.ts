
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";
import { logger } from '@/utils/logger';
import { applyInitialDictionaryCorrections } from './dictionaryProcessor';

// Cache for tokenization results to improve performance
const tokenizationCache = new Map<string, string[]>();

export const applyWordReplacements = (text: string): {
  correctedText: string;
  appliedCorrections: Correction[];
} => {
  logger.debug('Applying word replacements', { textLength: text.length }, 'textProcessing');
  
  // Use the unified dictionary processor
  const { correctedText, corrections } = applyInitialDictionaryCorrections(text);
  
  const appliedCorrections = corrections.map(correction => ({
    ...correction,
    reason: `सही वर्तनी के लिए "${correction.incorrect}" को "${correction.correct}" से बदला गया`,
    type: 'spelling' as const
  }));
  
  logger.debug('Word replacements completed', { 
    correctionsCount: appliedCorrections.length 
  }, 'textProcessing');
  
  return { correctedText, appliedCorrections };
};

export const extractCorrectionsFromResponse = (original: string, corrected: string): Correction[] => {
  logger.debug('Extracting corrections from AI response', { 
    originalLength: original.length,
    correctedLength: corrected.length
  }, 'textProcessing');
  
  // First apply word replacements to get the preprocessed text
  const { correctedText: preprocessedText } = applyWordReplacements(original);
  
  // Now compare preprocessed text with AI output to get only AI-made corrections
  const aiCorrections = extractAICorrections(preprocessedText, corrected);
  
  logger.debug('AI corrections extracted', { count: aiCorrections.length }, 'textProcessing');
  return aiCorrections;
};

const extractAICorrections = (preprocessedText: string, aiCorrected: string): Correction[] => {
  const corrections: Correction[] = [];
  
  // Split into sentences for better comparison
  const originalSentences = preprocessedText.split(/[।\.\!\?]+/).filter(s => s.trim());
  const correctedSentences = aiCorrected.split(/[।\.\!\?]+/).filter(s => s.trim());
  
  // Compare sentence by sentence to find meaningful changes
  for (let i = 0; i < Math.max(originalSentences.length, correctedSentences.length); i++) {
    const originalSentence = originalSentences[i]?.trim() || '';
    const correctedSentence = correctedSentences[i]?.trim() || '';
    
    if (originalSentence && correctedSentence && originalSentence !== correctedSentence) {
      const sentenceCorrections = findSentenceLevelCorrections(originalSentence, correctedSentence);
      corrections.push(...sentenceCorrections);
    }
  }
  
  // Remove duplicate corrections and filter out trivial changes
  return filterMeaningfulCorrections(corrections);
};

const findSentenceLevelCorrections = (original: string, corrected: string): Correction[] => {
  const corrections: Correction[] = [];
  
  // Split into words while preserving punctuation context
  const originalWords = tokenizeWithContext(original);
  const correctedWords = tokenizeWithContext(corrected);
  
  // Use dynamic programming approach for better alignment
  const alignments = alignWords(originalWords, correctedWords);
  
  alignments.forEach(({ originalWord, correctedWord, changeType }) => {
    if (originalWord !== correctedWord && isSignificantChange(originalWord, correctedWord)) {
      corrections.push({
        incorrect: originalWord,
        correct: correctedWord,
        reason: generateCorrectionReason(originalWord, correctedWord, changeType),
        type: categorizeCorrectionType(originalWord, correctedWord, changeType)
      });
    }
  });
  
  return corrections;
};

const tokenizeWithContext = (text: string): string[] => {
  // Check cache first for performance
  if (tokenizationCache.has(text)) {
    return tokenizationCache.get(text)!;
  }
  
  // Split preserving punctuation and whitespace context
  const tokens = text.split(/(\s+)/).filter(token => token.trim().length > 0);
  
  // Cache result for future use
  if (tokenizationCache.size > 100) {
    tokenizationCache.clear(); // Prevent memory leaks
  }
  tokenizationCache.set(text, tokens);
  
  return tokens;
};

const alignWords = (original: string[], corrected: string[]): Array<{
  originalWord: string;
  correctedWord: string;
  changeType: 'substitution' | 'insertion' | 'deletion' | 'compound' | 'case';
}> => {
  const alignments: Array<{
    originalWord: string;
    correctedWord: string;
    changeType: 'substitution' | 'insertion' | 'deletion' | 'compound' | 'case';
  }> = [];
  
  let i = 0, j = 0;
  
  while (i < original.length || j < corrected.length) {
    const origWord = original[i]?.replace(/[।\.\!\?,;:]/g, '') || '';
    const corrWord = corrected[j]?.replace(/[।\.\!\?,;:]/g, '') || '';
    
    if (i >= original.length) {
      // Insertion
      alignments.push({
        originalWord: '[अनुपस्थित]',
        correctedWord: corrWord,
        changeType: 'insertion'
      });
      j++;
    } else if (j >= corrected.length) {
      // Deletion
      alignments.push({
        originalWord: origWord,
        correctedWord: '[हटाया गया]',
        changeType: 'deletion'
      });
      i++;
    } else if (origWord === corrWord) {
      // No change
      i++;
      j++;
    } else {
      // Check for compound word changes
      if (isCompoundWordChange(origWord, corrWord)) {
        alignments.push({
          originalWord: origWord,
          correctedWord: corrWord,
          changeType: 'compound'
        });
      } else if (isCaseChange(origWord, corrWord)) {
        alignments.push({
          originalWord: origWord,
          correctedWord: corrWord,
          changeType: 'case'
        });
      } else {
        // Substitution
        alignments.push({
          originalWord: origWord,
          correctedWord: corrWord,
          changeType: 'substitution'
        });
      }
      i++;
      j++;
    }
  }
  
  return alignments;
};

const isSignificantChange = (original: string, corrected: string): boolean => {
  // Filter out trivial changes
  if (!original || !corrected || original === corrected) return false;
  if (original === '[अनुपस्थित]' || corrected === '[हटाया गया]') return true;
  
  // Ignore very minor punctuation-only changes
  const origClean = original.replace(/[।\.\!\?,;:\s]/g, '');
  const corrClean = corrected.replace(/[।\.\!\?,;:\s]/g, '');
  
  if (origClean === corrClean) return false;
  
  // Consider it significant if there's a meaningful difference
  return origClean.length > 1 || corrClean.length > 1;
};

const isCompoundWordChange = (original: string, corrected: string): boolean => {
  // Check if it's a compound word correction (space removal/addition)
  const origNoSpace = original.replace(/\s+/g, '');
  const corrNoSpace = corrected.replace(/\s+/g, '');
  return origNoSpace === corrNoSpace && original !== corrected;
};

const isCaseChange = (original: string, corrected: string): boolean => {
  // Check for case/form changes in Hindi
  return original.toLowerCase() === corrected.toLowerCase() && original !== corrected;
};

const categorizeCorrectionType = (
  original: string, 
  corrected: string, 
  changeType: string
): 'grammar' | 'spelling' | 'punctuation' | 'syntax' => {
  if (changeType === 'compound') return 'spelling';
  if (changeType === 'case') return 'grammar';
  if (changeType === 'insertion' || changeType === 'deletion') return 'syntax';
  
  // Check for common grammatical patterns
  if (isGrammaticalChange(original, corrected)) return 'grammar';
  if (isPunctuationChange(original, corrected)) return 'punctuation';
  
  return 'syntax';
};

const isGrammaticalChange = (original: string, corrected: string): boolean => {
  // Check for common Hindi grammatical changes
  const grammarPatterns = [
    /का$/,  // possessive changes
    /के$/,  // possessive changes
    /की$/,  // possessive changes
    /ने$/,  // ergative case
    /को$/,  // accusative/dative
    /में$/,  // locative
    /से$/,  // ablative/instrumental
  ];
  
  return grammarPatterns.some(pattern => 
    pattern.test(original) || pattern.test(corrected)
  );
};

const isPunctuationChange = (original: string, corrected: string): boolean => {
  const origLetters = original.replace(/[।\.\!\?,;:\s]/g, '');
  const corrLetters = corrected.replace(/[।\.\!\?,;:\s]/g, '');
  return origLetters === corrLetters && original !== corrected;
};

const generateCorrectionReason = (
  original: string, 
  corrected: string, 
  changeType: string
): string => {
  switch (changeType) {
    case 'compound':
      return `समास सुधार: "${original}" को "${corrected}" के रूप में लिखा जाना चाहिए`;
    case 'case':
      return `कारक सुधार: "${original}" के स्थान पर "${corrected}" का प्रयोग उचित है`;
    case 'insertion':
      return `वाक्य पूर्णता के लिए "${corrected}" जोड़ा गया`;
    case 'deletion':
      return `अनावश्यक शब्द "${original}" हटाया गया`;
    default:
      if (isGrammaticalChange(original, corrected)) {
        return `व्याकरण सुधार: "${original}" के स्थान पर "${corrected}" उचित है`;
      }
      return `भाषा सुधार: "${original}" को "${corrected}" से बदला गया`;
  }
};

const filterMeaningfulCorrections = (corrections: Correction[]): Correction[] => {
  // Remove duplicates and filter out very minor changes
  const seen = new Set<string>();
  
  return corrections.filter(correction => {
    const key = `${correction.incorrect}-${correction.correct}`;
    if (seen.has(key)) return false;
    seen.add(key);
    
    // Filter out single character changes unless they're significant
    if (correction.incorrect.length === 1 && correction.correct.length === 1) {
      return false;
    }
    
    // Keep meaningful corrections
    return true;
  });
};

export const extractStyleEnhancements = (original: string, enhanced: string): Correction[] => {
  logger.debug('Extracting style enhancements', { 
    originalLength: original.length,
    enhancedLength: enhanced.length
  }, 'textProcessing');
  
  // Similar logic for style enhancements, but focusing on vocabulary and flow improvements
  const enhancements: Correction[] = [];
  
  // Simple word-level comparison for style enhancements
  const originalWords = original.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const enhancedWords = enhanced.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  let originalIndex = 0;
  let enhancedIndex = 0;

  while (originalIndex < originalWords.length && enhancedIndex < enhancedWords.length) {
    const originalWord = originalWords[originalIndex].replace(/[।\.\!\?,;:]/g, '');
    const enhancedWord = enhancedWords[enhancedIndex].replace(/[।\.\!\?,;:]/g, '');

    if (originalWord !== enhancedWord && originalWord.length > 0 && enhancedWord.length > 0) {
      enhancements.push({
        incorrect: originalWord,
        correct: enhancedWord,
        reason: `शैली सुधार: "${originalWord}" को अधिक प्रभावी "${enhancedWord}" से बदला गया`,
        type: 'vocabulary'
      });
    }
    originalIndex++;
    enhancedIndex++;
  }

  logger.debug('Style enhancements extracted', { count: enhancements.length }, 'textProcessing');
  return enhancements;
};
