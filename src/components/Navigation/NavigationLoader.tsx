
import React from 'react';
import { Loader2 } from 'lucide-react';

interface NavigationLoaderProps {
  isLoading: boolean;
  message?: string;
}

const NavigationLoader = ({ isLoading, message = 'पृष्ठ लोड हो रहा है...' }: NavigationLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-blue-600 text-white">
      <div className="flex items-center justify-center py-2 px-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm">{message}</span>
      </div>
      {/* Progress bar animation */}
      <div className="h-1 bg-blue-700">
        <div className="h-full bg-white animate-pulse"></div>
      </div>
    </div>
  );
};

export default NavigationLoader;
