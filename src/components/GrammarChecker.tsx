
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, FileText, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const GrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const OPENAI_API_KEY = "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";

  const correctGrammar = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पहले कुछ टेक्स्ट लिखें");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

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
      
      setProgress(100);
      setCorrectedText(corrected);
      setIsLoading(false);
      clearInterval(progressInterval);
      toast.success("व्याकरण सुधार पूरा हो गया!");

    } catch (error) {
      console.error('Error correcting grammar:', error);
      setIsLoading(false);
      setProgress(0);
      clearInterval(progressInterval);
      toast.error("कुछ गलत हुआ है। कृपया फिर से कोशिश करें।");
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setProgress(0);
  };

  const copyToClipboard = async () => {
    if (correctedText) {
      await navigator.clipboard.writeText(correctedText);
      toast.success("टेक्स्ट कॉपी किया गया!");
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          हिंदी व्याकरण सुधारक
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI की शक्ति से अपने हिंदी टेक्स्ट को बेहतर बनाएं
        </p>
      </div>

      {/* Main Editor Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Original Text Panel */}
          <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">मूल टेक्स्ट</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <FileText className="h-4 w-4 mr-1" />
                  {wordCount} शब्द
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
                className="min-h-[400px] text-lg border-0 resize-none focus-visible:ring-0 p-4 bg-gray-50 rounded-2xl"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-500">{charCount} अक्षर</span>
                <div className="flex space-x-3">
                  <Button
                    onClick={resetText}
                    variant="outline"
                    disabled={isLoading}
                    className="rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    रीसेट
                  </Button>
                  <Button
                    onClick={correctGrammar}
                    disabled={isLoading || !inputText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isLoading ? 'सुधार रहे हैं...' : 'व्याकरण सुधारें'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corrected Text Panel */}
          <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">सुधारा गया टेक्स्ट</CardTitle>
                {correctedText && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    <FileText className="h-4 w-4 mr-1" />
                    {correctedText.trim().split(/\s+/).length} शब्द
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="min-h-[400px] p-4 bg-gray-50 rounded-2xl">
                {correctedText ? (
                  <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {correctedText}
                  </p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-lg text-center">
                      सुधारा गया टेक्स्ट यहाँ दिखेगा...
                      <br />
                      <span className="text-sm">पहले मूल टेक्स्ट में कुछ लिखें</span>
                    </p>
                  </div>
                )}
              </div>
              
              {/* Progress Bar */}
              {isLoading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">प्रगति</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {correctedText && !isLoading && (
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    कॉपी करें
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="bg-blue-50 border-blue-200 border-2 text-center p-8 rounded-3xl hover:shadow-lg transition-shadow">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">तत्काल सुधार</h3>
            <p className="text-gray-600">एक क्लिक में व्याकरण सुधारें</p>
          </Card>

          <Card className="bg-purple-50 border-purple-200 border-2 text-center p-8 rounded-3xl hover:shadow-lg transition-shadow">
            <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">AI संचालित</h3>
            <p className="text-gray-600">OpenAI की शक्ति से संचालित</p>
          </Card>

          <Card className="bg-green-50 border-green-200 border-2 text-center p-8 rounded-3xl hover:shadow-lg transition-shadow">
            <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">हिंदी विशेषज्ञता</h3>
            <p className="text-gray-600">हिंदी व्याकरण में विशेषज्ञ</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
