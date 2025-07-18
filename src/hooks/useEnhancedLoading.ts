
import { useState, useEffect, useMemo } from 'react';
import { ProcessingMode } from "@/types/grammarChecker";

interface LoadingPhrase {
  text: string;
  stage: string;
}

const GRAMMAR_PHRASES: LoadingPhrase[] = [
  { text: "आपका पाठ सुधारा जा रहा है...", stage: "प्रारंभिक सेटअप" },
  { text: "व्याकरण की जांच की जा रही है...", stage: "AI विश्लेषण" },
  { text: "AI सुधार पूर्ण...", stage: "AI सुधार पूर्ण" },
  { text: "शब्दकोश लागू किया जा रहा है...", stage: "शब्दकोश लागू कर रहे हैं" },
  { text: "अंतिम सुधार किए जा रहे हैं...", stage: "अंतिम सुधार" },
  { text: "पूर्ण!", stage: "पूर्ण!" }
];

const STYLE_PHRASES: LoadingPhrase[] = [
  { text: "आपकी लेखन शैली सुधारी जा रही है...", stage: "प्रारंभिक सेटअप" },
  { text: "वाक्य संरचना में सुधार...", stage: "शैली सुधार" },
  { text: "भाषा की सुंदरता बढ़ाई जा रही है...", stage: "भाषा सुधार" },
  { text: "लेखन को और भी निखारा जा रहा है...", stage: "परिणाम तैयार करना" },
  { text: "पूर्ण!", stage: "पूर्ण!" }
];

export const useEnhancedLoading = (
  isLoading: boolean,
  currentStage: string,
  processingMode: ProcessingMode,
  progress: number
) => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const phrases = useMemo(() => 
    processingMode === 'grammar' ? GRAMMAR_PHRASES : STYLE_PHRASES,
    [processingMode]
  );

  // Stage-based phrase selection (simplified)
  useEffect(() => {
    if (!isLoading) {
      setCurrentPhrase('');
      return;
    }

    if (currentStage) {
      const stagePhrase = phrases.find(p => p.stage === currentStage);
      if (stagePhrase && stagePhrase.text !== currentPhrase) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentPhrase(stagePhrase.text);
          setIsAnimating(false);
        }, 150);
      }
    }
  }, [currentStage, phrases, currentPhrase, isLoading]);

  const getProgressBarClass = () => {
    const baseClass = "h-full transition-all duration-300 ease-out rounded-full";
    const gradientClass = processingMode === 'grammar' 
      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400' 
      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400';
    
    return `${baseClass} ${gradientClass}`;
  };

  const getCardAnimationClass = () => {
    return isLoading 
      ? 'shadow-xl transform scale-[1.01] transition-all duration-300' 
      : 'shadow-xl transform scale-100 transition-all duration-300';
  };

  return {
    currentPhrase,
    isAnimating,
    getProgressBarClass,
    getCardAnimationClass,
    phraseTransitionClass: isAnimating ? 'opacity-50 transition-opacity duration-150' : 'opacity-100 transition-opacity duration-150'
  };
};
