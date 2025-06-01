
import { useEffect, useState } from "react";

const MarqueeBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const message = "श्रेष्ठतम परिणामों के लिये गूगल क्रोम के Version 137.0.7151.56 (Official Build) (64-bit) का प्रयोग करें";

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-black text-white py-2 overflow-hidden">
      <div className="relative whitespace-nowrap">
        <div className="inline-block animate-marquee text-sm font-medium">
          {message} • {message} • {message} • {message}
        </div>
      </div>
    </div>
  );
};

export default MarqueeBar;
