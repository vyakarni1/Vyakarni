
import { useState, useEffect, useMemo } from 'react';
import { ProcessingMode } from "@/types/grammarChecker";

interface LoadingPhrase {
  text: string;
  stage: string;
  duration: number;
}

const GRAMMAR_PHRASES: LoadingPhrase[] = [
  { text: "आपका पाठ सुधारा जा रहा है...", stage: "प्रारंभिक सेटअप", duration: 2000 },
  { text: "व्याकरण की जांच की जा रही है...", stage: "GPT विश्लेषण", duration: 3000 },
  { text: "AI से बात हो रही है...", stage: "GPT विश्लेषण", duration: 2500 },
  { text: "शब्दकोश लागू किया जा रहा है...", stage: "शब्दकोश सुधार", duration: 2000 },
  { text: "अंतिम सुधार किए जा रहे हैं...", stage: "परिणाम तैयार करना", duration: 1500 }
];

const STYLE_PHRASES: LoadingPhrase[] = [
  { text: "आपकी लेखन शैली सुधारी जा रही है...", stage: "प्रारंभिक सेटअप", duration: 2000 },
  { text: "वाक्य संरचना में सुधार...", stage: "GPT शैली सुधार", duration: 3000 },
  { text: "भाषा की सुंदरता बढ़ाई जा रही है...", stage: "GPT शैली सुधार", duration: 2500 },
  { text: "शब्दों का चुनाव बेहतर बनाया जा रहा है...", stage: "शब्दकोश सुधार", duration: 2000 },
  { text: "लेखन को और भी निखारा जा रहा है...", stage: "परिणाम तैयार करना", duration: 1500 }
];

export const useEnhancedLoading = (
  isLoading: boolean,
  currentStage: string,
  processingMode: ProcessingMode,
  progress: number
) => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const phrases = useMemo(() => 
    processingMode === 'grammar' ? GRAMMAR_PHRASES : STYLE_PHRASES,
    [processingMode]
  );

  // Enhanced loading phrase rotation
  useEffect(() => {
    if (!isLoading) {
      setCurrentPhrase('');
      setPhraseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setPhraseIndex(prev => {
          const nextIndex = (prev + 1) % phrases.length;
          setCurrentPhrase(phrases[nextIndex].text);
          return nextIndex;
        });
        setIsAnimating(false);
      }, 200);
    }, 2500);

    // Set initial phrase
    if (phrases.length > 0) {
      setCurrentPhrase(phrases[0].text);
    }

    return () => clearInterval(interval);
  }, [isLoading, phrases]);

  // Stage-based phrase selection
  useEffect(() => {
    if (currentStage && phrases.length > 0) {
      const stagePhrase = phrases.find(p => p.stage === currentStage);
      if (stagePhrase && stagePhrase.text !== currentPhrase) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentPhrase(stagePhrase.text);
          setIsAnimating(false);
        }, 200);
      }
    }
  }, [currentStage, phrases, currentPhrase]);

  const getProgressBarClass = () => {
    const baseClass = "h-full transition-all duration-500 ease-out rounded-full";
    const gradientClass = processingMode === 'grammar' 
      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400' 
      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400';
    
    return `${baseClass} ${gradientClass} ${isLoading ? 'animate-pulse' : ''}`;
  };

  const getCardAnimationClass = () => {
    return isLoading 
      ? 'animate-pulse shadow-2xl transform scale-[1.02]' 
      : 'shadow-xl transform scale-100';
  };

  return {
    currentPhrase,
    isAnimating,
    getProgressBarClass,
    getCardAnimationClass,
    phraseTransitionClass: isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
  };
};
