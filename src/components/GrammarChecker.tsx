
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";

interface Suggestion {
  id: string;
  type: 'grammar' | 'spelling' | 'style';
  original: string;
  suggestion: string;
  description: string;
  position: { start: number; end: number };
}

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const { trackUsage } = useUsageStats();

  const mockSuggestions: Suggestion[] = [
    {
      id: '1',
      type: 'grammar',
      original: 'मैं स्कूल जाता हूँ।',
      suggestion: 'मैं स्कूल जाता हूं।',
      description: 'हिंदी में "हूं" का प्रयोग करें, "हूँ" के बजाय।',
      position: { start: 14, end: 18 }
    },
    {
      id: '2',
      type: 'spelling',
      original: 'सिखना',
      suggestion: 'सीखना',
      description: 'वर्तनी की त्रुटि - "सीखना" सही है।',
      position: { start: 25, end: 30 }
    }
  ];

  const checkGrammar = async () => {
    if (!text.trim()) {
      toast.error("कृपया कुछ टेक्स्ट लिखें");
      return;
    }

    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setHasChecked(true);
      setIsChecking(false);
      toast.success("व्याकरण जांच पूर्ण!");
    }, 2000);
  };

  const applySuggestion = async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    const newText = text.replace(suggestion.original, suggestion.suggestion);
    setText(newText);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    
    // Track usage when a correction is applied
    await trackUsage('grammar_correction');
    
    toast.success("सुधार लागू किया गया!");
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-red-100 text-red-800';
      case 'spelling': return 'bg-yellow-100 text-yellow-800';
      case 'style': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span>हिंदी व्याकरण जांचकर्ता</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] text-lg"
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {text.length} अक्षर, {text.split(' ').filter(word => word.length > 0).length} शब्द
            </div>
            <Button 
              onClick={checkGrammar} 
              disabled={isChecking || !text.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isChecking ? "जांच रहे हैं..." : "व्याकरण जांचें"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasChecked && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>सुझाव ({suggestions.length})</span>
              {suggestions.length === 0 && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  कोई त्रुटि नहीं मिली
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <Badge className={getSuggestionColor(suggestion.type)}>
                          {suggestion.type === 'grammar' && 'व्याकरण'}
                          {suggestion.type === 'spelling' && 'वर्तनी'}
                          {suggestion.type === 'style' && 'शैली'}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => applySuggestion(suggestion.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        सुधार लागू करें
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-red-600">गलत: </span>
                        <span className="line-through">{suggestion.original}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-600">सही: </span>
                        <span className="font-medium">{suggestion.suggestion}</span>
                      </div>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">बधाई हो!</h3>
                <p className="text-gray-600">आपके टेक्स्ट में कोई व्याकरण की त्रुटि नहीं मिली।</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrammarChecker;
