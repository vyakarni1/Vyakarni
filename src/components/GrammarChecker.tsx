
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Crown, FileText } from "lucide-react";
import { toast } from "sonner";

const GrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const OPENAI_API_KEY = "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";

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    setIsLoading(true);

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
      
      setCorrectedText(corrected);
      setIsLoading(false);
      toast.success("व्याकरण सुधार पूरा हो गया!");

    } catch (error) {
      console.error('Error correcting grammar:', error);
      setIsLoading(false);
      toast.error("कुछ गलत हुआ है। कृपया फिर से कोशिश करें।");
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            हिंदी व्याकरण सुधारक
          </h1>
          <p className="text-xl text-gray-600">
            AI की शक्ति से अपने हिंदी टेक्स्ट को बेहतर बनाएं
          </p>
        </div>

        {/* Main Editor Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Original Text */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">मूल टेक्स्ट</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-1" />
                  {inputText.length} अक्षर
                </div>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
                className="min-h-[300px] text-lg border-0 resize-none focus-visible:ring-0 p-0"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">0 अक्षर</span>
                <Button
                  onClick={correctGrammar}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isLoading ? 'व्याकरण सुधारें...' : 'व्याकरण सुधारें'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Corrected Text */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">सुधारा गया टेक्स्ट</h2>
              </div>
              <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg">
                {correctedText ? (
                  <p className="text-lg text-gray-800 leading-relaxed">{correctedText}</p>
                ) : (
                  <p className="text-gray-400 text-lg">सुधारा गया टेक्स्ट यहाँ दिखेगा...</p>
                )}
              </div>
              {correctedText && (
                <div className="flex space-x-3 mt-4">
                  <Button
                    onClick={() => navigator.clipboard.writeText(correctedText)}
                    variant="outline"
                    className="flex-1"
                  >
                    कॉपी करें
                  </Button>
                  <Button
                    onClick={resetText}
                    variant="outline"
                    className="flex-1"
                  >
                    रीसेट करें
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-0 text-center p-6">
            <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">तत्काल सुधार</h3>
            <p className="text-gray-600">एक क्लिक में व्याकरण सुधारें</p>
          </Card>

          <Card className="bg-purple-50 border-0 text-center p-6">
            <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI संचालित</h3>
            <p className="text-gray-600">OpenAI की शक्ति से संचालित</p>
          </Card>

          <Card className="bg-green-50 border-0 text-center p-6">
            <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">हिंदी विशेषज्ञता</h3>
            <p className="text-gray-600">हिंदी व्याकरण में विशेषज्ञ</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
