
import { useState } from 'react';
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

  const startProgress = (mode: ProcessingMode) => {
    setIsLoading(true);
    setProgress(0);
    setCurrentStage('');
    setCurrentMode(mode);
  };

  const completeProgress = () => {
    setIsLoading(false);
    setCurrentStage('');
  };

  const resetProgressState = () => {
    resetProgress(setProgress);
    setCurrentStage('');
    setIsLoading(false);
  };

  const runStagesWithProgress = (
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
  };

  const updateStageProgress = (stageIndex: number, progress: number) => {
    const stages = currentMode === 'grammar' ? GRAMMAR_STAGES : STYLE_STAGES;
    const stage = stages[stageIndex];
    if (stage) {
      const progressWithinStage = Math.min(Math.max(progress, 0), 100);
      const totalProgress = stage.startPercent + 
        ((stage.endPercent - stage.startPercent) * progressWithinStage / 100);
      setProgress(Math.round(totalProgress));
      setCurrentStage(stage.name);
    }
  };

  return {
    progress,
    currentStage,
    isLoading,
    startProgress,
    completeProgress,
    resetProgressState,
    runStagesWithProgress,
    updateStageProgress
  };
};
