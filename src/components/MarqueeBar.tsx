import { useEffect, useState } from "react";

interface MarqueeBarProps {
  content?: string; // Made optional since we're using predefined texts
}

const MarqueeBar = ({ content }: MarqueeBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const texts = [
    "मात्र सीमित समय के लिये – सुनहरा एवं आकर्षक आरंभिक ऑफ़र उपलब्ध! शीघ्रता करें! | For a limited time only Early Bird offer is available! Hurry up!",
    "श्रेष्ठतम परिणामों के लिये गूगल क्रोम के Version 137.0.7151.56 (Latest Build) (64-bit) का प्रयोग करें ☆ Beta Version V-1.0"
  ];

  return (
    <div className={`w-full bg-sky-500 text-white py-3 px-4 shadow-lg transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto text-center">
        {/* First line */}
        <div className="text-sm font-semibold mb-1">
          {content || texts[0]}
        </div>
        
        {/* Second line */}
        <div className="text-sm font-semibold">
          {texts[1]}
        </div>
      </div>
    </div>
  );
};

export default MarqueeBar;