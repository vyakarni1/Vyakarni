
import React from 'react';
import { cn } from "@/lib/utils";

interface EnhancedProgressProps {
  value: number;
  className?: string;
  showShimmer?: boolean;
  gradient?: 'blue' | 'green' | 'purple' | 'pink';
}

const EnhancedProgress = React.forwardRef<
  HTMLDivElement,
  EnhancedProgressProps
>(({ className, value = 0, showShimmer = false, gradient = 'blue', ...props }, ref) => {
  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400',
    green: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400',
    purple: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400',
    pink: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400'
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-slate-200/60 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {/* Progress bar */}
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full will-change-transform",
          gradientClasses[gradient]
        )}
        style={{ 
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          transform: `translateX(0%)`,
        }}
      />
      
      {/* Shimmer effect */}
      {showShimmer && value > 0 && value < 100 && (
        <div 
          className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"
          style={{
            left: `${Math.min(Math.max(value - 8, 0), 92)}%`
          }}
        />
      )}
    </div>
  );
});

EnhancedProgress.displayName = "EnhancedProgress";

export { EnhancedProgress };
