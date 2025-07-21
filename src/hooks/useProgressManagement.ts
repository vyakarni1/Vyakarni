
import { useState } from 'react';

export const useProgressManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('');

  const updateProgress = (newProgress: number, stage: string) => {
    setProgress(newProgress);
    setCurrentStage(stage);
    setIsLoading(newProgress < 100);
    
    console.log(`Progress: ${newProgress}% - ${stage}`);
  };

  const resetProgressState = () => {
    setIsLoading(false);
    setProgress(0);
    setCurrentStage('');
  };

  const startLoading = (initialStage: string = 'शुरुआत') => {
    setIsLoading(true);
    setProgress(0);
    setCurrentStage(initialStage);
  };

  const completeLoading = () => {
    setProgress(100);
    setCurrentStage('पूर्ण!');
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    isLoading,
    progress,
    currentStage,
    updateProgress,
    resetProgressState,
    startLoading,
    completeLoading
  };
};
