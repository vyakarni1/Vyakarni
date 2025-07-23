import { useEffect, useState } from "react";

interface MarqueeBarProps {
  content?: string; // Made optional since we're using predefined texts
}

const MarqueeBar = ({ content }: MarqueeBarProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  
  const texts = [
    "मात्र सीमित समय के लिये – सुनहरा एवं आकर्षक आरंभिक ऑफ़र उपलब्ध! शीघ्रता करें!",
    "श्रेष्ठतम परिणामों के लिये गूगल क्रोम के Version 137.0.7151.56 (Latest Build) (64-bit) का प्रयोग करें ☆ Beta Version V-1.0"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeClass('opacity-0');
      
      // After fade out completes, change text and fade in
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setFadeClass('opacity-100');
      }, 300); // Half of the transition duration
      
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-blue-600 text-white py-2 px-2 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
      <div className="flex items-center justify-center min-h-[2rem]">
        <div className={`text-sm md:text-base font-medium hover:scale-105 transition-all duration-500 cursor-default text-center leading-relaxed max-w-full break-words ${fadeClass}`}>
          {content || texts[currentTextIndex]}
        </div>
      </div>
    </div>
  );
};

export default MarqueeBar;