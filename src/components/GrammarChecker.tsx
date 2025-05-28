
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { trackUsage } = useUsageStats();

  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error("कृपया जांच के लिए कुछ टेक्स्ट दर्ज करें");
      return;
    }

    setIsChecking(true);
    
    // Track usage when user checks grammar
    await trackUsage('grammar_check');
    
    // Simulate grammar checking
    setTimeout(() => {
      const mockSuggestions = [
        "वाक्य में कुछ व्याकरण सुधार की आवश्यकता है",
        "अल्पविराम का सही उपयोग करें",
        "शब्द की वर्तनी जांचें"
      ];
      setSuggestions(mockSuggestions);
      setIsChecking(false);
      toast.success("व्याकरण जांच पूर्ण!");
    }, 2000);
  };

  const clearText = () => {
    setText('');
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          हिंदी व्याकरण सुधारक
        </h1>
        <p className="text-lg text-gray-600">
          AI की मदद से अपने हिंदी टेक्स्ट को सुधारें
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            टेक्स्ट दर्ज करें
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें जिसे आप जांचना चाहते हैं..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] text-lg"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleCheck} 
              disabled={isChecking || !text.trim()}
              className="flex items-center gap-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  जांच रहे हैं...
                </>
              ) : (
                'व्याकरण जांचें'
              )}
            </Button>
            <Button variant="outline" onClick={clearText}>
              साफ़ करें
            </Button>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              सुझाव
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrammarChecker;
