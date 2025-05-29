
export interface Correction {
  id: string;
  incorrect: string;
  correct: string;
  reason: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'syntax' | 'vocabulary' | 'flow' | 'eloquence' | 'engagement';
  position?: {
    start: number;
    end: number;
  };
}

export interface WordReplacement {
  original: string;
  replacement: string;
}

export type ProcessingMode = 'grammar' | 'style';
