
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, AlertCircle, FileText, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";

interface Suggestion {
  id: string;
  type: 'correctness' | 'clarity' | 'engagement' | 'delivery';
  category: string;
  incorrect: string;
  correct: string;
  position: { start: number; end: number };
  description: string;
  confidence: number;
}

const GrammarChecker = () => {
  const { incrementStats } = useUsageStats();
  const [content, setContent] = useState(`व्याकरण की गलतियाँ और वर्तनी की त्रुटियाँ आपकी विश्वसनीयता को प्रभावित कर सकती हैं। यही बात गलत अल्पविराम और अन्य प्रकार के विराम चिह्नों के लिए भी जाती है। न केवल व्याकरण इन मुद्दों को लाल रंग में रेखांकित करेगा, बल्कि यह आपको वाक्य को सही तरीके से लिखने का तरीका भी दिखाएगा।

नीली रेखाएं दिखाती हैं कि व्याकरण ने एक वाक्य देखा है जो अनावश्यक रूप से शब्दों से भरा है। आपको सुझाव मिलेंगे जो संभावित रूप से आपको एक शब्दी वाक्य को सहज तरीके से संशोधित करने में मदद कर सकते हैं।`);
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'correctness',
      category: 'वर्तनी सुधार',
      incorrect: 'गलतियाँ',
      correct: 'गलतियों',
      position: { start: 12, end: 20 },
      description: 'संज्ञा का सही रूप उपयोग करें',
      confidence: 95
    },
    {
      id: '2',
      type: 'correctness', 
      category: 'विराम चिह्न',
      incorrect: 'अल्पविराम,',
      correct: 'अल्पविराम',
      position: { start: 145, end: 154 },
      description: 'अनावश्यक अल्पविराम हटाएं',
      confidence: 88
    },
    {
      id: '3',
      type: 'clarity',
      category: 'वाक्य संरचना',
      incorrect: 'गलत अल्पविराम और अन्य प्रकार के',
      correct: 'गलत अल्पविराम तथा विराम चिह्नों',
      position: { start: 130, end: 180 },
      description: 'वाक्य को अधिक स्पष्ट बनाएं',
      confidence: 75
    }
  ]);

  const [overallScore, setOverallScore] = useState(72);

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case 'correctness': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' };
      case 'clarity': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' };
      case 'engagement': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' };
      case 'delivery': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' };
    }
  };

  const acceptSuggestion = async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const newContent = content.substring(0, suggestion.position.start) + 
                        suggestion.correct + 
                        content.substring(suggestion.position.end);
      setContent(newContent);
      
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      setOverallScore(prev => Math.min(prev + 3, 100));
      
      // Track usage when suggestion is accepted
      await incrementStats();
      
      toast.success("सुझाव स्वीकार किया गया!");
    }
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    toast.info("सुझाव को खारिज किया गया");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            हिंदी व्याकरण सुधारक
          </h1>
          <p className="text-lg text-gray-600">
            AI की शक्ति से अपने हिंदी लेखन को बेहतर बनाएं
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-2">
            {/* Score Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">आपका टेक्स्ट</h2>
                <div className={`px-4 py-2 rounded-xl ${getScoreBackground(overallScore)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">स्कोर</span>
                </div>
              </div>
            </div>

            {/* Text Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  संपादक
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] text-lg leading-relaxed"
                  placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
                />
                <div className="mt-4 text-sm text-gray-500">
                  {content.split(' ').length} शब्द • {content.length} अक्षर
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  सुझाव ({suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">बधाई हो!</h3>
                    <p className="text-sm text-gray-600">कोई सुझाव नहीं मिला। आपका टेक्स्ट अच्छा लग रहा है!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => {
                      const colors = getSuggestionTypeColor(suggestion.type);
                      
                      return (
                        <div key={suggestion.id} className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className={`h-4 w-4 ${colors.icon}`} />
                              <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                                {suggestion.category}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.confidence}%
                            </Badge>
                          </div>
                          
                          <p className={`text-sm mb-4 ${colors.text}`}>{suggestion.description}</p>
                          
                          {/* Incorrect/Correct Comparison */}
                          <div className="space-y-3 mb-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <X className="h-3 w-3 text-red-500" />
                                <span className="text-xs font-medium text-red-700">गलत</span>
                              </div>
                              <p className="text-sm text-red-800 font-medium line-through">
                                {suggestion.incorrect}
                              </p>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-xs font-medium text-green-700">सही</span>
                              </div>
                              <p className="text-sm text-green-800 font-semibold">
                                {suggestion.correct}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => acceptSuggestion(suggestion.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              स्वीकार करें
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => dismissSuggestion(suggestion.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              खारिज
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
