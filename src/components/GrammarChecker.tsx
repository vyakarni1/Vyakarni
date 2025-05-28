
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Zap, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const GrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasCorrection, setHasCorrection] = useState(false);

  const OPENAI_API_KEY = "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";

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    setIsLoading(true);
    const progressInterval = simulateProgress();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a Hindi grammar correction expert. Correct the grammatical errors in the given Hindi text while maintaining the original meaning and style. Only return the corrected text, no explanations or additional text.'
            },
            {
              role: 'user',
              content: `कृपया इस हिंदी टेक्स्ट में व्याकरण की त्रुटियों को सुधारें: "${inputText}"`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const corrected = data.choices[0].message.content.trim();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setCorrectedText(corrected);
        setHasCorrection(true);
        setIsLoading(false);
        setProgress(0);
        toast.success("व्याकरण सुधार पूरा हो गया!");
      }, 500);

    } catch (error) {
      console.error('Error correcting grammar:', error);
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
      toast.error("कुछ गलत हुआ है। कृपया फिर से कोशिश करें।");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedText);
    toast.success("टेक्स्ट कॉपी हो गया!");
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setHasCorrection(false);
  };

  const acceptCorrection = () => {
    setInputText(correctedText);
    setCorrectedText('');
    setHasCorrection(false);
    toast.success("सुधार स्वीकार कर लिया गया!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          हिंदी व्याकरण सुधारक
        </h1>
        <p className="text-gray-600 text-lg">
          AI की शक्ति से अपने हिंदी टेक्स्ट को बेहतर बनाएं
        </p>
      </div>

      {isLoading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  आपका टेक्स्ट सुधारा जा रहा है...
                </p>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>मूल टेक्स्ट</span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetText}
                className="ml-auto"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
              className="min-h-[200px] text-lg resize-none border-2 focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {inputText.length} अक्षर
              </span>
              <Button
                onClick={correctGrammar}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isLoading ? 'सुधार रहे हैं...' : 'व्याकरण सुधारें'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={`h-fit transition-all duration-300 ${hasCorrection ? 'border-green-200 bg-green-50' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>सुधारा गया टेक्स्ट</span>
              {hasCorrection && <CheckCircle className="h-5 w-5 text-green-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={correctedText}
              readOnly
              placeholder="सुधारा गया टेक्स्ट यहाँ दिखेगा..."
              className="min-h-[200px] text-lg resize-none bg-gray-50 border-2"
            />
            {hasCorrection && (
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={acceptCorrection}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  स्वीकार करें
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  कॉपी करें
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">⚡</div>
              <h3 className="font-semibold mb-1">तत्काल सुधार</h3>
              <p className="text-sm text-gray-600">एक क्लिक में व्याकरण सुधारें</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">🤖</div>
              <h3 className="font-semibold mb-1">AI संचालित</h3>
              <p className="text-sm text-gray-600">OpenAI की शक्ति से संचालित</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">📝</div>
              <h3 className="font-semibold mb-1">हिंदी विशेषज्ञता</h3>
              <p className="text-sm text-gray-600">हिंदी व्याकरण में विशेषज्ञ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrammarChecker;
