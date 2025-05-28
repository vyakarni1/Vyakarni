
export interface Correction {
  incorrect: string;
  correct: string;
  reason: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'syntax';
}

export interface WordReplacement {
  original: string;
  replacement: string;
}
