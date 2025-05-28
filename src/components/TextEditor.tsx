
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X, ExternalLink, Eye, FileText, Star, AlertCircle, Zap } from "lucide-react";
import { toast } from "sonner";

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

const TextEditor = () => {
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
    },
    {
      id: '4',
      type: 'engagement',
      category: 'शब्द चयन',
      incorrect: 'विराम चिह्न',
      correct: 'विराम चिह्नों',
      position: { start: 200, end: 212 },
      description: 'उचित बहुवचन रूप का प्रयोग करें',
      confidence: 90
    },
    {
      id: '5',
      type: 'clarity',
      category: 'क्रिया रूप',
      incorrect: 'दिखाया',
      correct: 'दिखाएगा',
      position: { start: 350, end: 356 },
      description: 'काल की सुसंगति बनाए रखें',
      confidence: 82
    }
  ]);

  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(72);
  const [processedSuggestions, setProcessedSuggestions] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const totalSuggestions = suggestions.length + processedSuggestions;
  const progressPercentage = totalSuggestions > 0 ? (processedSuggestions / totalSuggestions) * 100 : 0;

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case 'correctness': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' };
      case 'clarity': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' };
      case 'engagement': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' };
      case 'delivery': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' };
    }
  };

  const acceptSuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const newContent = content.substring(0, suggestion.position.start) + 
                        suggestion.correct + 
                        content.substring(suggestion.position.end);
      setContent(newContent);
      
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      setProcessedSuggestions(prev => prev + 1);
      setOverallScore(prev => Math.min(prev + 3, 100));
      toast.success("सुझाव स्वीकार किया गया!");
    }
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    setProcessedSuggestions(prev => prev + 1);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Main Editor Area */}
      <div className="flex-1 p-8">
        {/* Modern Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">मेरा दस्तावेज़</h1>
                  <p className="text-sm text-gray-500">हिंदी व्याकरण जांच</p>
                </div>
              </div>
              <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1">
                <Eye className="h-3 w-3" />
                <span>लक्ष्य: सुधार</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-xl ${getScoreBackground(overallScore)}`}>
                <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </span>
                <span className="text-sm text-gray-600 ml-1">स्कोर</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <ExternalLink className="h-4 w-4 mr-2" />
                साझा करें
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">प्रगति</span>
              <span className="text-sm text-gray-500">
                {processedSuggestions}/{totalSuggestions} सुझाव पूर्ण
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Modern Editor */}
        <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-3xl font-bold">व्याकरण संपादक</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="min-h-[500px] p-6 text-lg leading-relaxed focus:outline-none bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-blue-400 transition-colors"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              onInput={(e) => setContent(e.currentTarget.textContent || '')}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>

        {/* Word Count */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-md">
            <span className="text-sm text-gray-600">{content.split(' ').length} शब्द</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-gray-600">{content.length} अक्षर</span>
          </div>
        </div>
      </div>

      {/* Modern Suggestions Sidebar */}
      <div className="w-96 bg-white border-l border-gray-100 p-6 overflow-y-auto shadow-xl">
        {/* Score Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">सुझाव</h2>
            <Badge className="bg-blue-100 text-blue-800">{suggestions.length}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-medium text-red-700">शुद्धता</div>
              <div className="text-sm font-bold text-red-600">
                {suggestions.filter(s => s.type === 'correctness').length}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-medium text-blue-700">स्पष्टता</div>
              <div className="text-sm font-bold text-blue-600">
                {suggestions.filter(s => s.type === 'clarity').length}
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const colors = getSuggestionTypeColor(suggestion.type);
            
            return (
              <Card key={suggestion.id} className={`${colors.bg} ${colors.border} border-2 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className={`h-4 w-4 ${colors.icon}`} />
                      <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                        {suggestion.category}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.confidence}% विश्वास
                    </Badge>
                  </div>
                  
                  <p className={`text-sm mb-4 ${colors.text}`}>{suggestion.description}</p>
                  
                  {/* Incorrect/Correct Comparison */}
                  <div className="space-y-3 mb-4">
                    {/* Incorrect Text */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <X className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-medium text-red-700">गलत</span>
                      </div>
                      <p className="text-sm text-red-800 font-medium line-through">
                        {suggestion.incorrect}
                      </p>
                    </div>
                    
                    {/* Correct Text */}
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
                      className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 rounded-lg"
                      onClick={() => acceptSuggestion(suggestion.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      स्वीकार करें
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-lg"
                      onClick={() => dismissSuggestion(suggestion.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      खारिज
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">बधाई हो!</h3>
            <p className="text-sm text-gray-600">सभी सुझाव पूरे हो गए हैं।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
