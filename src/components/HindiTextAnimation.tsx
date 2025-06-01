
import React, { useState, useEffect, useCallback } from 'react';

const HindiTextAnimation = () => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCorrectButton, setShowCorrectButton] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const incorrectText = "मै कल दिल्ली जाउंगा और अपने मित्र से मिलुंगा।";
  const correctedText = "मैं कल दिल्ली जाऊँगा और अपने मित्र से मिलूँगा।";

  const resetAnimation = useCallback(() => {
    setCurrentIndex(0);
    setTypedText('');
    setShowCorrectButton(false);
    setShowCorrection(false);
    setShowResetButton(false);
    setIsTyping(false);
    setShowCursor(true);
  }, []);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    setShowCursor(true);
  }, []);

  const showCorrectionPanel = useCallback(() => {
    setShowCorrectButton(false);
    setTimeout(() => {
      setShowCorrection(true);
      setTimeout(() => {
        setShowResetButton(true);
        setTimeout(() => {
          resetAnimation();
          setTimeout(startTyping, 500);
        }, 3000);
      }, 300);
    }, 200);
  }, [resetAnimation, startTyping]);

  const autoClickButton = useCallback(() => {
    setTimeout(() => {
      showCorrectionPanel();
    }, 1500);
  }, [showCorrectionPanel]);

  useEffect(() => {
    if (isTyping && currentIndex < incorrectText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + incorrectText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else if (isTyping && currentIndex === incorrectText.length) {
      setTimeout(() => {
        setShowCursor(false);
        setIsTyping(false);
        setTimeout(() => {
          setShowCorrectButton(true);
          autoClickButton();
        }, 500);
      }, 1000);
    }
  }, [isTyping, currentIndex, incorrectText.length, autoClickButton]);

  useEffect(() => {
    const initialTimeout = setTimeout(startTyping, 1000);
    return () => clearTimeout(initialTimeout);
  }, [startTyping]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title - Centered and consistent */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          हिंदी पाठ सुधार डेमो
        </h3>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
      </div>
      
      {/* Main container with fixed dimensions for consistent layout */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Text display area - Fixed height for consistency */}
        <div className="relative h-40 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className={`
            w-full text-center transition-all duration-500 ease-out
            ${isTyping ? 'transform scale-105' : ''}
          `}>
            <div className="text-xl text-gray-800 font-medium leading-relaxed min-h-[3rem] flex items-center justify-center">
              <span className="inline-block">
                {typedText}
                {showCursor && (
                  <span className="inline-block w-0.5 h-7 bg-blue-500 ml-1 animate-pulse"></span>
                )}
              </span>
            </div>
          </div>
          
          {/* Subtle border animation */}
          <div className={`
            absolute inset-0 border-2 rounded-2xl transition-all duration-700 ease-out
            ${isTyping 
              ? 'border-blue-400 shadow-lg shadow-blue-100/50' 
              : 'border-transparent'
            }
          `}></div>
        </div>
        
        {/* Action button area - Fixed height for no layout shift */}
        <div className="h-20 flex items-center justify-center bg-gray-50/50 border-t border-gray-100">
          <button 
            onClick={showCorrectionPanel}
            className={`
              relative bg-gradient-to-r from-green-500 to-green-600 text-white
              px-8 py-3 rounded-full text-lg font-semibold shadow-lg
              transform transition-all duration-500 ease-out
              hover:scale-105 hover:shadow-xl active:scale-95
              ${showCorrectButton 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-4 pointer-events-none'
              }
            `}
          >
            <span className="relative z-10">सुधार करें</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
        
        {/* Correction panel - Slides up from bottom */}
        <div className={`
          absolute inset-x-0 bottom-0 h-32
          bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
          transform transition-all duration-700 ease-out
          ${showCorrection 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-full opacity-0'
          }
        `}>
          <div className="h-full flex flex-col justify-center px-8 text-white">
            <div className="text-sm font-medium opacity-90 mb-3 text-center">
              सुधारा गया वाक्य:
            </div>
            <div className="text-lg font-semibold text-center leading-relaxed">
              {correctedText}
            </div>
          </div>
          
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
      
      {/* Reset button - Centered below the main container */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => {
            resetAnimation();
            setTimeout(startTyping, 500);
          }}
          className={`
            bg-gradient-to-r from-purple-500 to-purple-600 text-white
            px-8 py-3 rounded-full text-sm font-semibold shadow-lg
            transform transition-all duration-500 ease-out
            hover:scale-105 hover:shadow-xl active:scale-95
            ${showResetButton 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-4 pointer-events-none'
            }
          `}
        >
          पुनः प्रारंभ करें
        </button>
      </div>
    </div>
  );
};

export default HindiTextAnimation;
