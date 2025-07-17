import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useSimpleGrammarChecker } from "@/hooks/useSimpleGrammarChecker";
import { SimpleTextPanel } from "./GrammarChecker/SimpleTextPanel";
import { SimpleProgressDisplay } from "./GrammarChecker/SimpleProgressDisplay";
import { toast } from "sonner";
import { useWordLimits } from "@/hooks/useWordLimits";
import { useUsageStats } from "@/hooks/useUsageStats";

const SimpleGrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  
  const { checkAndEnforceWordLimit, trackWordUsage } = useWordLimits();
  const { trackUsage } = useUsageStats();

  const {
    processText,
    isProcessing,
    originalText,
    finalCorrectedText,
    resetText
  } = useSimpleGrammarChecker({
    onProgressUpdate: (progress, stage) => {
      setProgress(progress);
      setCurrentStage(stage);
    }
  });

  const handleCorrectGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया सुधार के लिए कुछ पाठ लिखें");
      return;
    }

    // Check word limits
    if (!checkAndEnforceWordLimit(inputText)) {
      return;
    }

    try {
      await processText(inputText);
      
      // Track usage after successful processing
      trackUsage('correction');
      trackWordUsage(inputText, 'grammar_correction');
      
      toast.success("व्याकरण सुधार पूर्ण हुआ!");
    } catch (error) {
      console.error('Grammar correction error:', error);
      toast.error(`त्रुटि: ${error.message || "कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"}`);
    }
  };

  const handleReset = () => {
    setInputText('');
    resetText();
    setProgress(0);
    setCurrentStage('');
    toast.success("पाठ रीसेट किया गया");
  };

  const handleCopy = async () => {
    if (finalCorrectedText) {
      try {
        await navigator.clipboard.writeText(finalCorrectedText);
        toast.success("सुधारा गया पाठ कॉपी किया गया!");
      } catch (error) {
        toast.error("कॉपी करने में त्रुटि");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            व्याकरणी - हिंदी व्याकरण जांचकर्ता
          </h1>
          <p className="text-gray-600 text-center mt-2">
            2-Step Grammar Correction: Grok + Dictionary
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Display */}
        {isProcessing && (
          <div className="mb-6">
            <SimpleProgressDisplay 
              isProcessing={isProcessing}
              progress={progress}
              currentStage={currentStage}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Input Panel */}
          <SimpleTextPanel
            title="मूल पाठ (Original Text)"
            text={inputText}
            placeholder="यहाँ अपना हिंदी पाठ लिखें जिसका व्याकरण सुधारना है..."
            onTextChange={setInputText}
          />

          {/* Output Panel */}
          <SimpleTextPanel
            title="सुधारा गया पाठ (Corrected Text)"
            text={finalCorrectedText}
            placeholder="सुधारा गया पाठ यहाँ दिखाई देगा..."
            readOnly={true}
            className={finalCorrectedText ? "border-green-200 bg-green-50" : ""}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button
            onClick={handleCorrectGrammar}
            disabled={!inputText.trim() || isProcessing}
            className="px-8 py-3 text-lg"
            size="lg"
          >
            {isProcessing ? 'सुधार हो रहा है...' : 'व्याकरण सुधारें'}
          </Button>

          {finalCorrectedText && (
            <Button
              onClick={handleCopy}
              variant="outline"
              className="px-8 py-3 text-lg"
              size="lg"
            >
              कॉपी करें
            </Button>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            className="px-8 py-3 text-lg"
            size="lg"
          >
            रीसेट करें
          </Button>
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center text-gray-600">
          <h3 className="text-lg font-semibold mb-4">कैसे काम करता है:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Step 1: Grok Grammar Correction</h4>
              <p className="text-sm">AI व्याकरण, वाक्य संरचना, और वर्तनी की त्रुटियों को ठीक करता है</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Step 2: Dictionary Application</h4>
              <p className="text-sm">स्थानीय शब्दकोश से शब्दों को मानक वर्तनी में बदलता है</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGrammarChecker;