
import { useState, useCallback, useMemo } from 'react';
import { ProcessingMode } from "@/types/grammarChecker";
import { 
  createRealTimeProgressManager, 
  runStagesSequentially, 
  GRAMMAR_STAGES, 
  STYLE_STAGES,
  resetProgress 
} from "@/utils/progressUtils";

export const useProgressManagement = () => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('grammar');

  // Memoized callbacks for better performance
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
    }, 500); // Small delay for smooth completion animation
  }, []);

  const resetProgressState = useCallback(() => {
    resetProgress(setProgress);
    setCurrentStage('');
    setIsLoading(false);
  }, []);

  // Optimized progress update with smoother transitions
  const updateProgress = useCallback((newProgress: number, stage: string) => {
    // Smooth progress updates to prevent jumps
    setProgress(prev => {
      const diff = newProgress - prev;
      if (Math.abs(diff) > 20) {
        // Large jumps - animate in steps
        const steps = Math.ceil(Math.abs(diff) / 5);
        const stepSize = diff / steps;
        
        for (let i = 1; i <= steps; i++) {
          setTimeout(() => {
            setProgress(prev + (stepSize * i));
          }, i * 50);
        }
        return prev;
      }
      return newProgress;
    });
    
    setCurrentStage(stage);
    setIsLoading(newProgress < 100);
  }, []);

  const runStagesWithProgress = useCallback((
    mode: ProcessingMode,
    stageCallbacks: (() => Promise<void>)[],
    onComplete?: () => void
  ) => {
    const stages = mode === 'grammar' ? GRAMMAR_STAGES : STYLE_STAGES;
    const progressManager = createRealTimeProgressManager(
      stages,
      setProgress,
      setCurrentStage
    );

    runStagesSequentially(progressManager, stageCallbacks, () => {
      completeProgress();
      onComplete?.();
    });
  }, [completeProgress]);

  const updateStageProgress = useCallback((stageIndex: number, stageProgress: number) => {
    const stages = currentMode === 'grammar' ? GRAMMAR_STAGES : STYLE_STAGES;
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
    runStagesWithProgress,
    updateStageProgress,
    updateProgress
  }), [
    progress,
    currentStage,
    isLoading,
    startProgress,
    completeProgress,
    resetProgressState,
    runStagesWithProgress,
    updateStageProgress,
    updateProgress
  ]);
};
