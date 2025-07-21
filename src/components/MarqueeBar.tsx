
import { useEffect, useState } from "react";

interface MarqueeBarProps {
  content: string;
}

const MarqueeBar = ({ content }: MarqueeBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-blue-600 text-white py-2 px-2 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
      <div className="flex items-center justify-center min-h-[2rem]">
        <div className="text-sm md:text-base font-medium animate-blink hover:scale-105 transition-transform duration-300 cursor-default text-center leading-relaxed max-w-full break-words">
          {content}
        </div>
      </div>
    </div>
  );
};

export default MarqueeBar;
