
import { wordReplacements } from "@/data/wordReplacements";
import { Correction } from "@/types/grammarChecker";

// Simple utility to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to normalize text for comparison
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[।\.\!\?,;:""'']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper function to calculate similarity between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance algorithm
const getEditDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Improved word tokenization for Hindi text
const tokenizeText = (text: string): string[] => {
  return text
    .split(/\s+/)
    .map(word => word.replace(/[।\.\!\?,;:""'']/g, ''))
    .filter(word => word.length > 0);
};

export const applyWordReplacements = (text: string): {
  correctedText: string;
  appliedCorrections: Correction[];
} => {
  let correctedText = text;
  const appliedCorrections: Correction[] = [];
  
  wordReplacements.forEach(({ original, replacement }) => {
    const regex = new RegExp(original, 'g');
    if (regex.test(correctedText)) {
      correctedText = correctedText.replace(regex, replacement);
      appliedCorrections.push({
        id: generateId(),
        incorrect: original,
        correct: replacement,
        reason: `सही वर्तनी के लिए "${original}" को "${replacement}" से बदला गया`,
        type: 'spelling'
      });
    }
  });
  
  return { correctedText, appliedCorrections };
};

export const extractCorrectionsFromResponse = (original: string, corrected: string): Correction[] => {
  const foundCorrections: Correction[] = [];

  // First, add word replacement corrections
  const { appliedCorrections } = applyWordReplacements(original);
  foundCorrections.push(...appliedCorrections);

  // Tokenize both texts
  const originalWords = tokenizeText(original);
  const correctedWords = tokenizeText(corrected);

  // Use a simple diff algorithm to find actual changes
  const corrections = findWordDifferences(originalWords, correctedWords);
  
  // Filter out corrections that are already covered by word replacements
  // and add meaningful corrections only
  corrections.forEach(correction => {
    const alreadyCovered = foundCorrections.some(existing => 
      normalizeText(existing.incorrect) === normalizeText(correction.incorrect) ||
      normalizeText(existing.correct) === normalizeText(correction.correct)
    );
    
    // Only add if not already covered and if there's a meaningful difference
    const similarity = calculateSimilarity(
      normalizeText(correction.incorrect), 
      normalizeText(correction.correct)
    );
    
    // Skip if words are too similar (likely false positive) or already covered
    if (!alreadyCovered && similarity < 0.85 && correction.incorrect !== correction.correct) {
      foundCorrections.push(correction);
    }
  });

  return foundCorrections;
};

// Improved word difference detection using dynamic programming approach
const findWordDifferences = (originalWords: string[], correctedWords: string[]): Correction[] => {
  const corrections: Correction[] = [];
  const dp: number[][] = [];
  
  // Initialize DP table
  for (let i = 0; i <= originalWords.length; i++) {
    dp[i] = [];
    for (let j = 0; j <= correctedWords.length; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else {
        const cost = normalizeText(originalWords[i - 1]) === normalizeText(correctedWords[j - 1]) ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
  }
  
  // Backtrack to find actual changes
  let i = originalWords.length;
  let j = correctedWords.length;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const originalWord = originalWords[i - 1];
      const correctedWord = correctedWords[j - 1];
      
      if (normalizeText(originalWord) !== normalizeText(correctedWord)) {
        // This is a substitution
        corrections.unshift({
          id: generateId(),
          incorrect: originalWord,
          correct: correctedWord,
          reason: `व्याकरण सुधार: "${originalWord}" को "${correctedWord}" से बदला गया`,
          type: 'grammar'
        });
      }
      i--;
      j--;
    } else if (i > 0) {
      // This is a deletion
      const deletedWord = originalWords[i - 1];
      corrections.unshift({
        id: generateId(),
        incorrect: deletedWord,
        correct: '[हटाया गया]',
        reason: 'अनावश्यक शब्द हटाया गया',
        type: 'syntax'
      });
      i--;
    } else {
      // This is an insertion
      const insertedWord = correctedWords[j - 1];
      corrections.unshift({
        id: generateId(),
        incorrect: '[अनुपस्थित]',
        correct: insertedWord,
        reason: 'वाक्य पूर्णता के लिए शब्द जोड़ा गया',
        type: 'syntax'
      });
      j--;
    }
  }
  
  return corrections;
};

export const extractStyleEnhancements = (original: string, enhanced: string): Correction[] => {
  const enhancements: Correction[] = [];
  
  // Tokenize both texts
  const originalWords = tokenizeText(original);
  const enhancedWords = tokenizeText(enhanced);
  
  // Use the same improved algorithm for style enhancements
  const styleChanges = findWordDifferences(originalWords, enhancedWords);
  
  // Convert to style enhancement corrections
  styleChanges.forEach(change => {
    // Skip special markers
    if (!change.incorrect.startsWith('[') && !change.correct.startsWith('[')) {
      const similarity = calculateSimilarity(
        normalizeText(change.incorrect), 
        normalizeText(change.correct)
      );
      
      // Only add meaningful style changes
      if (similarity < 0.9 && change.incorrect !== change.correct) {
        enhancements.push({
          id: generateId(),
          incorrect: change.incorrect,
          correct: change.correct,
          reason: `शैली सुधार: "${change.incorrect}" को अधिक प्रभावी "${change.correct}" से बदला गया`,
          type: 'vocabulary'
        });
      }
    }
  });

  return enhancements;
};
