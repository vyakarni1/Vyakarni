
import React from 'react';
import { cn } from "@/lib/utils";

interface FloatingDotsProps {
  isActive?: boolean;
  color?: 'blue' | 'green' | 'purple';
  className?: string;
}

const FloatingDots: React.FC<FloatingDotsProps> = ({ 
  isActive = false, 
  color = 'blue',
  className 
}) => {
  const colorClasses = {
    blue: 'bg-blue-400',
    green: 'bg-emerald-400', 
    purple: 'bg-purple-400'
  };

  if (!isActive) return null;

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-2 h-2 rounded-full opacity-60",
            colorClasses[color]
          )}
          style={{
            left: `${20 + (i * 12)}%`,
            top: `${30 + (i % 3) * 20}%`,
            animation: `float ${2 + (i * 0.3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

export { FloatingDots };
