
export const createProgressSimulator = (
  setProgress: (value: number) => void,
  targetProgress: number = 90,
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
  setProgress: (value: number) => void,
  progressInterval: NodeJS.Timeout
) => {
  setProgress(100);
  clearInterval(progressInterval);
};

export const resetProgress = (
  setProgress: (value: number) => void,
  progressInterval: NodeJS.Timeout
) => {
  setProgress(0);
  clearInterval(progressInterval);
};
