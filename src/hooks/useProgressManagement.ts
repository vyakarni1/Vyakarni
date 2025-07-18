
import { useState, useCallback, useMemo } from 'react';
import { ProcessingMode } from "@/types/grammarChecker";

export const useProgressManagement = () => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('grammar');

  // Simplified callbacks for better performance
  const startProgress = useCallback((mode: ProcessingMode) => {
    setIsLoading(true);
    setProgress(0);
    setCurrentStage('');
    setCurrentMode(mode);
  }, []);

  const completeProgress = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStage('');
    }, 300);
  }, []);

  const resetProgressState = useCallback(() => {
    setProgress(0);
    setCurrentStage('');
    setIsLoading(false);
  }, []);

  // Direct progress update without animations
  const updateProgress = useCallback((newProgress: number, stage: string) => {
    setProgress(newProgress);
    setCurrentStage(stage);
    setIsLoading(newProgress < 100);
  }, []);

  const updateStageProgress = useCallback((stageIndex: number, stageProgress: number) => {
    const stages = currentMode === 'grammar' 
      ? [
          { name: "प्रारंभिक सेटअप", startPercent: 0, endPercent: 15 },
          { name: "AI विश्लेषण", startPercent: 15, endPercent: 60 },
          { name: "शब्दकोश सुधार", startPercent: 60, endPercent: 85 },
          { name: "परिणाम तैयार करना", startPercent: 85, endPercent: 100 }
        ] 
      : [
          { name: "प्रारंभिक सेटअप", startPercent: 0, endPercent: 15 },
          { name: "शैली सुधार", startPercent: 15, endPercent: 50 },
          { name: "भाषा सुधार", startPercent: 50, endPercent: 80 },
          { name: "परिणाम तैयार करना", startPercent: 80, endPercent: 100 }
        ];

    const stage = stages[stageIndex];
    if (stage) {
      const progressWithinStage = Math.min(Math.max(stageProgress, 0), 100);
      const totalProgress = stage.startPercent + 
        ((stage.endPercent - stage.startPercent) * progressWithinStage / 100);
      
      setProgress(Math.round(totalProgress));
      setCurrentStage(stage.name);
    }
  }, [currentMode]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    progress,
    currentStage,
    isLoading,
    startProgress,
    completeProgress,
    resetProgressState,
    updateStageProgress,
    updateProgress
  }), [
    progress,
    currentStage,
    isLoading,
    startProgress,
    completeProgress,
    resetProgressState,
    updateStageProgress,
    updateProgress
  ]);
};
