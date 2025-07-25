
export interface ProgressStage {
  name: string;
  startPercent: number;
  endPercent: number;
  estimatedDuration: number; // in milliseconds
}

export interface ProgressManager {
  currentStage: number;
  stages: ProgressStage[];
  startTime: number;
  setProgress: (value: number | ((prev: number) => number)) => void;
  setCurrentStage?: (stage: string) => void;
}

// Grammar correction stages - NEW 3-STEP PROCESS
export const GRAMMAR_STAGES: ProgressStage[] = [
  { name: "प्रारंभिक सेटअप", startPercent: 0, endPercent: 15, estimatedDuration: 500 },
  { name: "GPT विश्लेषण", startPercent: 15, endPercent: 65, estimatedDuration: 3000 },
  { name: "शब्दकोश सुधार", startPercent: 65, endPercent: 90, estimatedDuration: 800 },
  { name: "परिणाम तैयार करना", startPercent: 90, endPercent: 100, estimatedDuration: 400 }
];

// Style enhancement stages - NEW 3-STEP PROCESS
export const STYLE_STAGES: ProgressStage[] = [
  { name: "प्रारंभिक सेटअप", startPercent: 0, endPercent: 15, estimatedDuration: 500 },
  { name: "GPT शैली सुधार", startPercent: 15, endPercent: 50, estimatedDuration: 2500 },
  { name: "शब्दकोश सुधार", startPercent: 50, endPercent: 80, estimatedDuration: 800 },
  { name: "परिणाम तैयार करना", startPercent: 80, endPercent: 100, estimatedDuration: 400 }
];

export const createRealTimeProgressManager = (
  stages: ProgressStage[],
  setProgress: (value: number | ((prev: number) => number)) => void,
  setCurrentStage?: (stage: string) => void
): ProgressManager => {
  return {
    currentStage: 0,
    stages,
    startTime: Date.now(),
    setProgress,
    setCurrentStage
  };
};

export const updateStageProgress = (
  manager: ProgressManager,
  stageIndex: number,
  stageProgress: number = 0
) => {
  if (stageIndex >= manager.stages.length) return;
  
  const stage = manager.stages[stageIndex];
  const progressWithinStage = Math.min(Math.max(stageProgress, 0), 100);
  const totalProgress = stage.startPercent + 
    ((stage.endPercent - stage.startPercent) * progressWithinStage / 100);
  
  manager.setProgress(Math.round(totalProgress));
  
  if (manager.setCurrentStage && manager.currentStage !== stageIndex) {
    manager.currentStage = stageIndex;
    manager.setCurrentStage(stage.name);
  }
};

export const simulateStageProgress = (
  manager: ProgressManager,
  stageIndex: number,
  onComplete?: () => void
): NodeJS.Timeout => {
  if (stageIndex >= manager.stages.length) {
    onComplete?.();
    return null as any;
  }

  const stage = manager.stages[stageIndex];
  const duration = stage.estimatedDuration;
  const steps = 20; // Number of progress updates
  const stepDuration = duration / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const stageProgress = (currentStep / steps) * 100;
    
    updateStageProgress(manager, stageIndex, stageProgress);
    
    if (currentStep >= steps) {
      clearInterval(interval);
      onComplete?.();
    }
  }, stepDuration);

  return interval;
};

export const runStagesSequentially = (
  manager: ProgressManager,
  stageCallbacks: (() => Promise<void>)[],
  onComplete?: () => void
) => {
  let currentStageIndex = 0;
  
  const runNextStage = async () => {
    if (currentStageIndex >= manager.stages.length) {
      onComplete?.();
      return;
    }

    // Update to current stage
    updateStageProgress(manager, currentStageIndex, 0);
    
    // Execute the stage callback
    if (stageCallbacks[currentStageIndex]) {
      await stageCallbacks[currentStageIndex]();
    }
    
    // Complete the stage
    updateStageProgress(manager, currentStageIndex, 100);
    
    currentStageIndex++;
    
    // Small delay between stages for visual feedback
    setTimeout(runNextStage, 100);
  };
  
  runNextStage();
};

// Legacy function compatibility - now properly completes to 100%
export const createProgressSimulator = (
  setProgress: (value: number | ((prev: number) => number)) => void,
  targetProgress: number = 100,
  interval: number = 200,
  increment: number = 10
) => {
  const progressInterval = setInterval(() => {
    setProgress(prev => {
      if (prev >= targetProgress) {
        clearInterval(progressInterval);
        return targetProgress;
      }
      return prev + increment;
    });
  }, interval);

  return progressInterval;
};

export const completeProgress = (
  setProgress: (value: number | ((prev: number) => number)) => void,
  progressInterval?: NodeJS.Timeout
) => {
  setProgress(100);
  if (progressInterval) {
    clearInterval(progressInterval);
  }
};

export const resetProgress = (
  setProgress: (value: number | ((prev: number) => number)) => void,
  progressInterval?: NodeJS.Timeout
) => {
  setProgress(0);
  if (progressInterval) {
    clearInterval(progressInterval);
  }
};
