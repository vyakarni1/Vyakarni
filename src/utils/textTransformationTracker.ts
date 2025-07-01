
import { Correction } from "@/types/grammarChecker";

export interface TextTransformation {
  step: number;
  stepName: string;
  inputText: string;
  outputText: string;
  corrections: Correction[];
}

export interface WordMapping {
  originalWord: string;
  finalWord: string;
  originalPosition: { start: number; end: number };
  finalPosition: { start: number; end: number };
  transformationStep: number;
  correctionType: 'dictionary' | 'gpt';
  correctionReason: string;
}

export class TextTransformationTracker {
  private transformations: TextTransformation[] = [];
  private wordMappings: WordMapping[] = [];

  constructor(private originalText: string) {}

  addTransformation(step: number, stepName: string, inputText: string, outputText: string, corrections: Correction[]) {
    this.transformations.push({
      step,
      stepName,
      inputText,
      outputText,
      corrections
    });

    // Create word mappings for this transformation
    this.createWordMappings(step, stepName, inputText, outputText, corrections);
  }

  private createWordMappings(step: number, stepName: string, inputText: string, outputText: string, corrections: Correction[]) {
    corrections.forEach(correction => {
      const originalPositions = this.findWordPositions(inputText, correction.incorrect);
      const finalPositions = this.findWordPositions(outputText, correction.correct);

      originalPositions.forEach((origPos, index) => {
        if (finalPositions[index]) {
          this.wordMappings.push({
            originalWord: correction.incorrect,
            finalWord: correction.correct,
            originalPosition: origPos,
            finalPosition: finalPositions[index],
            transformationStep: step,
            correctionType: (correction.source || 'dictionary') as 'dictionary' | 'gpt',
            correctionReason: correction.reason
          });
        }
      });
    });
  }

  private findWordPositions(text: string, word: string): Array<{ start: number; end: number }> {
    const positions: Array<{ start: number; end: number }> = [];
    let searchIndex = 0;
    
    while (searchIndex < text.length) {
      const index = text.indexOf(word, searchIndex);
      if (index === -1) break;
      
      positions.push({
        start: index,
        end: index + word.length
      });
      
      searchIndex = index + 1;
    }
    
    return positions;
  }

  getWordMappingsForOriginalText(): WordMapping[] {
    // Map back to original text positions
    return this.wordMappings.map(mapping => {
      const originalPosition = this.mapToOriginalPosition(mapping.originalPosition, mapping.transformationStep);
      return {
        ...mapping,
        originalPosition
      };
    });
  }

  private mapToOriginalPosition(position: { start: number; end: number }, step: number): { start: number; end: number } {
    // For now, return the position as-is
    // In a more complex implementation, we would track position changes through all steps
    return position;
  }

  getFinalText(): string {
    return this.transformations.length > 0 
      ? this.transformations[this.transformations.length - 1].outputText 
      : this.originalText;
  }

  getAllCorrections(): Correction[] {
    const allCorrections: Correction[] = [];
    this.transformations.forEach(transformation => {
      allCorrections.push(...transformation.corrections.map(correction => ({
        ...correction,
        source: correction.source || 'dictionary',
        step: transformation.stepName
      })));
    });
    return allCorrections;
  }

  getTransformations(): TextTransformation[] {
    return this.transformations;
  }

  reset() {
    this.transformations = [];
    this.wordMappings = [];
  }
}
