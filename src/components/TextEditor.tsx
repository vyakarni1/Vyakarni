
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X, ExternalLink, Eye, FileText, Star } from "lucide-react";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  type: 'correctness' | 'clarity' | 'engagement' | 'delivery';
  category: string;
  text: string;
  replacement?: string;
  position: { start: number; end: number };
  description: string;
}

const TextEditor = () => {
  const [content, setContent] = useState(`व्याकरण की गलतियाँ और वर्तनी की त्रुटियाँ आपकी विश्वसनीयता को प्रभावित कर सकती हैं। यही बात गलत अल्पविराम और अन्य प्रकार के विराम चिह्नों के लिए भी जाती है। न केवल व्याकरण इन मुद्दों को लाल रंग में रेखांकित करेगा, बल्कि यह आपको वाक्य को सही तरीके से लिखने का तरीका भी दिखाएगा।

नीली रेखाएं दिखाती हैं कि व्याकरण ने एक वाक्य देखा है जो अनावश्यक रूप से शब्दों से भरा है। आपको सुझाव मिलेंगे जो संभावित रूप से आपको एक शब्दी वाक्य को सहज तरीके से संशोधित करने में मदद कर सकते हैं।`);
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'correctness',
      category: 'वर्तनी सुधार',
      text: 'गलतियाँ',
      replacement: 'गलतियों',
      position: { start: 12, end: 20 },
      description: 'अपनी वर्तनी सुधारें'
    },
    {
      id: '2',
      type: 'correctness',
      category: 'अल्पविराम हटाएं',
      text: 'अल्पविराम,',
      replacement: 'अल्पविराम',
      position: { start: 145, end: 154 },
      description: 'अल्पविराम हटाएं'
    },
    {
      id: '3',
      type: 'clarity',
      category: 'टेक्स्ट सुधारें',
      text: 'गलत अल्पविराम और अन्य प्रकार के, और अन्य...',
      position: { start: 130, end: 180 },
      description: 'गलत अल्पविराम के लिए समान बात'
    },
    {
      id: '4',
      type: 'engagement',
      category: 'स्थान जोड़ें',
      text: 'विराम चिह्न',
      position: { start: 200, end: 212 },
      description: 'शब्द जोड़ें'
    },
    {
      id: '5',
      type: 'clarity',
      category: 'क्रिया रूप बदलें',
      text: 'दिखाया',
      replacement: 'दिखाएगा',
      position: { start: 350, end: 356 },
      description: 'वाक्य को सही तरीके से लिखने के लिए'
    }
  ]);

  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(85);
  const editorRef = useRef<HTMLDivElement>(null);

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'correctness': return 'text-red-600 bg-red-50 border-red-200';
      case 'clarity': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'engagement': return 'text-green-600 bg-green-50 border-green-200';
      case 'delivery': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const acceptSuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion && suggestion.replacement) {
      // Replace text in content
      const newContent = content.substring(0, suggestion.position.start) + 
                        suggestion.replacement + 
                        content.substring(suggestion.position.end);
      setContent(newContent);
      
      // Remove the suggestion
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Editor Area */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h1 className="text-xl font-semibold">डेमो दस्तावेज़</h1>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>लक्ष्य</span>
              </Badge>
              <span className={`font-semibold ${getScoreColor(overallScore)}`}>
                {overallScore} समग्र स्कोर
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                साझा करें
              </Button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">मूल बातें</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="min-h-[500px] p-4 text-lg leading-relaxed focus:outline-none"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              onInput={(e) => setContent(e.currentTarget.textContent || '')}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>

        {/* Word Count */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          {content.split(' ').length} शब्द
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        {/* Score Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">समीक्षा सुझाव</span>
            <Badge variant="secondary">{suggestions.length}</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-gray-600">शुद्धता</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-gray-600">स्पष्टता</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-gray-600">जुड़ाव</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-gray-600">प्रस्तुति</div>
            </div>
          </div>
        </div>

        {/* Pro Suggestions */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">प्रो सुझाव</span>
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">14</Badge>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Suggestions List */}
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className={`${getSuggestionColor(suggestion.type)} border cursor-pointer hover:shadow-sm transition-shadow`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      suggestion.type === 'correctness' ? 'bg-red-500' :
                      suggestion.type === 'clarity' ? 'bg-blue-500' :
                      suggestion.type === 'engagement' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}></div>
                    <span className="text-xs font-medium">{suggestion.category}</span>
                  </div>
                </div>
                
                <p className="text-sm mb-2">{suggestion.description}</p>
                
                {suggestion.replacement && (
                  <div className="text-xs mb-3">
                    <span className="line-through text-gray-500">{suggestion.text}</span>
                    <span className="ml-2 font-medium">{suggestion.replacement}</span>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => acceptSuggestion(suggestion.id)}
                  >
                    स्वीकार करें
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => dismissSuggestion(suggestion.id)}
                  >
                    खारिज
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600">सभी सुझाव पूरे हो गए!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
