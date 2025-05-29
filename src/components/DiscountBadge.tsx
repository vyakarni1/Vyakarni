
import React from 'react';

interface DiscountBadgeProps {
  percentage: number;
  className?: string;
}

const DiscountBadge = ({ percentage, className = '' }: DiscountBadgeProps) => {
  return (
    <div className={`absolute -top-3 -right-3 z-10 ${className}`}>
      <div className="relative">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-full transform rotate-12 shadow-lg border-2 border-red-600 animate-pulse">
          <div className="text-center">
            <div className="text-sm font-bold leading-tight">{percentage}% छूट</div>
            <div className="text-xs font-semibold">महाबचत</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full transform rotate-12 -z-10 blur-sm opacity-50"></div>
      </div>
    </div>
  );
};

export default DiscountBadge;
