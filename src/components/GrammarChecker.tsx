
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Zap, Crown, FileText, Copy, RotateCcw, CheckCircle, X, ArrowRight, BookOpen, AlertCircle, ChevronDown, Sparkles, Target, Shield, Key } from "lucide-react";
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";
import { supabase } from "@/integrations/supabase/client";

interface Correction {
  incorrect: string;
  correct: string;
  reason: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'syntax';
}

const GrammarChecker = () => {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const { trackUsage } = useUsageStats();

  // Comprehensive word replacement instruction set
  const wordReplacements = [{
    original: 'गए',
    replacement: 'गये'
  }, {
    original: 'आए',
    replacement: 'आये'
  }, {
    original: 'हुए',
    replacement: 'हुये'
  }, {
    original: 'शभकामनाएं',
    replacement: 'शभकामनायें'
  }, {
    original: 'शभकामनाएं',
    replacement: 'शभकामनायें'
  }, {
    original: 'कामनाएं',
    replacement: 'कामनायें'
  }, {
    original: 'कामनाएं',
    replacement: 'कामनायें'
  }, {
    original: 'भाए',
    replacement: 'भाये'
  }, {
    original: 'चलाए',
    replacement: 'चलाये'
  }, {
    original: 'समझाए',
    replacement: 'समझाये'
  }, {
    original: 'समझाएं',
    replacement: 'समझायें'
  }, {
    original: 'समझाएं',
    replacement: 'समझायें'
  }, {
    original: 'समझाए',
    replacement: 'समझाये'
  }, {
    original: 'किए',
    replacement: 'किये'
  }, {
    original: 'लिए',
    replacement: 'लिये'
  }, {
    original: 'सराए',
    replacement: 'सराये'
  }, {
    original: 'खाए',
    replacement: 'खाये'
  }, {
    original: 'निभाए',
    replacement: 'निभाये'
  }, {
    original: 'कसमसाए',
    replacement: 'कसमसाये'
  }, {
    original: 'झरझराए',
    replacement: 'झरझराये'
  }, {
    original: 'बरसाए',
    replacement: 'बरसाये'
  }, {
    original: 'पहुंचाए',
    replacement: 'पहुंचाये'
  }, {
    original: 'पहुंचाए',
    replacement: 'पहुंचाये'
  }, {
    original: 'दिलाए',
    replacement: 'दिलाये'
  }, {
    original: 'भिजवाए',
    replacement: 'भिजवाये'
  }, {
    original: 'गड़बड़ाए',
    replacement: 'गड़बड़ाये'
  }, {
    original: 'पहुंचवाए',
    replacement: 'पहुंचवाये'
  }, {
    original: 'कहिए',
    replacement: 'कहिये'
  }, {
    original: 'गई',
    replacement: 'गयी'
  }, {
    original: 'आई',
    replacement: 'आयी'
  }, {
    original: 'नई',
    replacement: 'नयी'
  }, {
    original: 'पहुंचाई',
    replacement: 'पहुंचायी'
  }, {
    original: 'पहुंचाई',
    replacement: 'पहुंचायी'
  }, {
    original: 'पहुंचवाई',
    replacement: 'पहुंचवायी'
  }, {
    original: 'पहुंचवाई',
    replacement: 'पहुंचवायी'
  }, {
    original: 'छटपटाए',
    replacement: 'छटपटाये'
  }, {
    original: 'पटपटाए',
    replacement: 'पटपटाये'
  }, {
    original: 'पटपटाई',
    replacement: 'पटपटायी'
  }, {
    original: 'उलझाए',
    replacement: 'उलझाये'
  }, {
    original: 'कराए',
    replacement: 'कराये'
  }, {
    original: 'करवाए',
    replacement: 'करवाये'
  }, {
    original: 'दिखाए',
    replacement: 'दिखाये'
  }, {
    original: 'दिखलाए',
    replacement: 'दिखलाये'
  }, {
    original: 'बड़बड़ाए',
    replacement: 'बड़बड़ाये'
  }, {
    original: 'पलटाए',
    replacement: 'पलटाये'
  }, {
    original: 'परम्पराएं',
    replacement: 'परम्परायें'
  }, {
    original: 'परम्पराएं',
    replacement: 'परम्परायें'
  }, {
    original: 'परंपराएं',
    replacement: 'परंपरायें'
  }, {
    original: 'परंपराएं',
    replacement: 'परंपरायें'
  }, {
    original: 'समझिए',
    replacement: 'समझिये'
  }, {
    original: 'समझाइए',
    replacement: 'समझाइये'
  }, {
    original: 'बरबतापूर्ण',
    replacement: 'बरबरतापूर्ण'
  }, {
    original: 'बर्बतापूर्ण',
    replacement: 'बर्बतापूर्ण'
  }, {
    original: 'बरबरतापूर्ण',
    replacement: 'बरबरतापूर्ण'
  }, {
    original: 'करवाएगा',
    replacement: 'करवायेगा'
  }];

  const applyWordReplacements = (text: string): {
    correctedText: string;
    appliedCorrections: Correction[];
  } => {
    let correctedText = text;
    const appliedCorrections: Correction[] = [];
    wordReplacements.forEach(({
      original,
      replacement
    }) => {
      if (correctedText.includes(original)) {
        correctedText = correctedText.replace(new RegExp(original, 'g'), replacement);
        appliedCorrections.push({
          incorrect: original,
          correct: replacement,
          reason: `सही वर्तनी के लिए "${original}" को "${replacement}" से बदला गया`,
          type: 'spelling'
        });
      }
    });
    return { correctedText, appliedCorrections };
  };

  const checkGrammar = async () => {
    if (!inputText.trim()) {
      toast.error('कृपया कुछ टेक्स्ट डालें');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCorrectedText('');
    setCorrections([]);

    try {
      await trackUsage('grammar_check');
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Apply word replacements first
      const { correctedText: wordCorrectedText, appliedCorrections } = applyWordReplacements(inputText);
      
      try {
        // Try to call the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('grammar-check', {
          body: { text: wordCorrectedText }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw new Error('API call failed');
        }

        clearInterval(progressInterval);
        setProgress(100);

        // Combine AI corrections with word replacements
        const allCorrections = [...appliedCorrections, ...(data.corrections || [])];
        
        setCorrectedText(data.correctedText || wordCorrectedText);
        setCorrections(allCorrections);
        
        toast.success(`${allCorrections.length} सुधार किए गए`);
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Fallback to word replacements only
        clearInterval(progressInterval);
        setProgress(100);
        
        setCorrectedText(wordCorrectedText);
        setCorrections(appliedCorrections);
        
        if (appliedCorrections.length > 0) {
          toast.success(`${appliedCorrections.length} शब्द सुधारे गए (केवल स्थानीय सुधार)`);
        } else {
          toast.success('कोई सुधार की आवश्यकता नहीं');
        }
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast.error('व्याकरण जांच में त्रुटि');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('क्लिपबोर्ड में कॉपी किया गया');
    } catch (error) {
      toast.error('कॉपी करने में त्रुटि');
    }
  };

  const resetText = () => {
    setInputText('');
    setCorrectedText('');
    setCorrections([]);
    setProgress(0);
  };

  const getCorrectionIcon = (type: string) => {
    switch (type) {
      case 'grammar': return <BookOpen className="w-4 h-4" />;
      case 'spelling': return <Target className="w-4 h-4" />;
      case 'punctuation': return <AlertCircle className="w-4 h-4" />;
      case 'syntax': return <Shield className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getCorrectionColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'spelling': return 'bg-red-100 text-red-800 border-red-200';
      case 'punctuation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'syntax': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                हिंदी व्याकरण चेकर
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                आपके हिंदी टेक्स्ट को परफेक्ट बनाएं
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  मूल टेक्स्ट
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetText}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें या पेस्ट करें..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] text-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
              />
              
              {isLoading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>व्याकरण जांच की जा रही है...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={checkGrammar}
                disabled={isLoading || !inputText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 text-lg shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    जांच की जा रही है...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    व्याकरण जांचें
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  सुधारा गया टेक्स्ट
                </CardTitle>
                {correctedText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(correctedText)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {correctedText ? (
                <div className="space-y-4">
                  <Textarea
                    value={correctedText}
                    readOnly
                    className="min-h-[300px] text-lg bg-green-50 border-green-200 focus:border-green-400 resize-none"
                  />
                  {corrections.length > 0 && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {corrections.length} सुधार किए गए
                    </div>
                  )}
                </div>
              ) : (
                <div className="min-h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="text-lg">सुधारा गया टेक्स्ट यहाँ दिखेगा</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Corrections Section */}
        {corrections.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                किए गए सुधार ({corrections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {corrections.map((correction, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getCorrectionColor(correction.type)}`}>
                        {getCorrectionIcon(correction.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className={getCorrectionColor(correction.type)}>
                            {correction.type === 'grammar' && 'व्याकरण'}
                            {correction.type === 'spelling' && 'वर्तनी'}
                            {correction.type === 'punctuation' && 'विराम चिह्न'}
                            {correction.type === 'syntax' && 'वाक्य संरचना'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded border border-red-200">
                            {correction.incorrect}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded border border-green-200">
                            {correction.correct}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {correction.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GrammarChecker;
