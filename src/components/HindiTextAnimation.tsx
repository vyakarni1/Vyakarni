
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
    <div className="w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        हिंदी पाठ सुधार डेमो
      </h3>
      
      <div className={`
        bg-gray-50 border-2 rounded-xl p-5 mb-5 min-h-[80px] 
        flex items-center justify-center transition-all duration-300
        ${isTyping ? 'border-blue-400 shadow-lg shadow-blue-100' : 'border-gray-200'}
      `}>
        <div className="text-lg text-gray-800 font-medium text-center leading-relaxed">
          {typedText}
          {showCursor && (
            <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse"></span>
          )}
        </div>
      </div>
      
      {showCorrectButton && (
        <div className="text-center mb-5">
          <button 
            onClick={showCorrectionPanel}
            className={`
              bg-gradient-to-r from-green-500 to-green-600 text-white
              px-8 py-3 rounded-full text-lg font-semibold
              transition-all duration-500 shadow-lg hover:shadow-xl
              hover:scale-105 active:scale-95
              ${showCorrectButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
            `}
          >
            सुधार करें
          </button>
        </div>
      )}
      
      {showCorrection && (
        <div className={`
          bg-gradient-to-r from-blue-500 to-blue-600 text-white
          rounded-xl p-5 transition-all duration-500
          ${showCorrection ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <div className="text-sm opacity-90 mb-2">सुधारा गया वाक्य:</div>
          <div className="text-lg font-semibold">{correctedText}</div>
        </div>
      )}
      
      {showResetButton && (
        <div className="text-center mt-5">
          <button 
            onClick={() => {
              resetAnimation();
              setTimeout(startTyping, 500);
            }}
            className={`
              bg-gradient-to-r from-purple-500 to-purple-600 text-white
              px-6 py-2 rounded-full text-sm font-medium
              transition-all duration-300 hover:scale-105
              ${showResetButton ? 'opacity-100' : 'opacity-0'}
            `}
          >
            फिर से शुरू करें
          </button>
        </div>
      )}
    </div>
  );
};

export default HindiTextAnimation;
