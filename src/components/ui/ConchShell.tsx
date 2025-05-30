
import React from 'react';

interface ConchShellProps {
  className?: string;
}

const ConchShell: React.FC<ConchShellProps> = ({ className = "h-16 w-16" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="conchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9933" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#138808" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="conchShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7700" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0F5F0F" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main conch shell body */}
      <path
        d="M50 15 C35 15, 25 25, 25 40 C25 50, 30 60, 35 65 L35 75 C35 80, 40 85, 45 85 L55 85 C60 85, 65 80, 65 75 L65 65 C70 60, 75 50, 75 40 C75 25, 65 15, 50 15 Z"
        fill="url(#conchGradient)"
        stroke="url(#conchShadow)"
        strokeWidth="1"
        filter="url(#glow)"
      />
      
      {/* Spiral pattern on shell */}
      <path
        d="M50 20 C45 20, 40 25, 40 30 C40 35, 45 40, 50 40 C55 40, 60 35, 60 30 C60 25, 55 20, 50 20"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />
      
      <path
        d="M50 25 C47 25, 45 27, 45 30 C45 33, 47 35, 50 35 C53 35, 55 33, 55 30 C55 27, 53 25, 50 25"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      
      {/* Conch shell opening/mouth */}
      <ellipse
        cx="50"
        cy="75"
        rx="8"
        ry="5"
        fill="#FF9933"
        stroke="#FF7700"
        strokeWidth="1"
        opacity="0.9"
      />
      
      {/* Decorative lines */}
      <path
        d="M35 45 Q50 50, 65 45"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      
      <path
        d="M35 55 Q50 60, 65 55"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </svg>
  );
};

export default ConchShell;
