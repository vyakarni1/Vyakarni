
export interface Correction {
  incorrect: string;
  correct: string;
  reason: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'syntax' | 'vocabulary' | 'flow' | 'eloquence' | 'engagement' | 'style' | 'dictionary';
  source?: 'dictionary' | 'gpt' | 'grok';
}

export interface WordReplacement {
  original: string;
  replacement: string;
}

export type ProcessingMode = 'grammar' | 'style';
