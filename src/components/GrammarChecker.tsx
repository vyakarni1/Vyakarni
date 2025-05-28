import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Zap, Crown, FileText, Copy, RotateCcw, CheckCircle, X, ArrowRight, BookOpen, AlertCircle, ChevronDown, Sparkles, Target, Shield } from "lucide-react";
import { toast } from "sonner";
import { useUsageStats } from "@/hooks/useUsageStats";

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
  
  const OPENAI_API_KEY = "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";

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
  const extractCorrectionsFromResponse = (original: string, corrected: string): Correction[] => {
    const foundCorrections: Correction[] = [];

    // First, add word replacement corrections
    const {
      appliedCorrections
    } = applyWordReplacements(original);
    foundCorrections.push(...appliedCorrections);

    // Split texts into words for comparison
    const originalWords = original.toLowerCase().split(/\s+/);
    const correctedWords = corrected.toLowerCase().split(/\s+/);

    // Find differences between original and corrected text
    const minLength = Math.min(originalWords.length, correctedWords.length);
    for (let i = 0; i < minLength; i++) {
      if (originalWords[i] !== correctedWords[i]) {
        // Skip if already covered by word replacements
        const alreadyCovered = foundCorrections.some(c => originalWords[i].includes(c.incorrect.toLowerCase()) || correctedWords[i].includes(c.correct.toLowerCase()));
        if (!alreadyCovered) {
          foundCorrections.push({
            incorrect: originalWords[i],
            correct: correctedWords[i],
            reason: `व्याकरण सुधार: "${originalWords[i]}" को "${correctedWords[i]}" से बदला गया`,
            type: 'grammar'
          });
        }
      }
    }

    // Check for additional words in corrected text
    if (correctedWords.length > originalWords.length) {
      for (let i = minLength; i < correctedWords.length; i++) {
        foundCorrections.push({
          incorrect: '[अनुपस्थित]',
          correct: correctedWords[i],
          reason: 'वाक्य पूर्णता के लिए शब्द जोड़ा गया',
          type: 'syntax'
        });
      }
    }

    // Check for removed words
    if (originalWords.length > correctedWords.length) {
      for (let i = minLength; i < originalWords.length; i++) {
        foundCorrections.push({
          incorrect: originalWords[i],
          correct: '[हटाया गया]',
          reason: 'अनावश्यक शब्द हटाया गया',
          type: 'syntax'
        });
      }
    }
    return foundCorrections;
  };
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
    return {
      correctedText,
      appliedCorrections
    };
  };
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
      // Create instruction set for AI based on word replacements
      const wordReplacementInstructions = wordReplacements
        .map(({ original, replacement }) => `"${original}" को "${replacement}" से बदलें`)
        .join(', ');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.5-preview-2025-02-27',
          messages: [
            {
              role: 'system',
              content: `You are a Hindi grammar correction expert. Follow these specific word replacement rules: ${wordReplacementInstructions}. Additionally, correct any grammatical errors, punctuation mistakes, sentence structure issues, and word choice problems in the given Hindi text while maintaining the original meaning and style. Only return the corrected text, no explanations or additional text.`
            },
            {
              role: 'user',
              content: `कृपया इस हिंदी टेक्स्ट में सभी व्याकरण की त्रुटियों, वर्तनी की गलतियों, विराम चिह्न की समस्याओं और वाक्य संरचना की त्रुटियों को सुधारें। दिए गए शब्द प्रतिस्थापन नियमों का पूर्ण पालन करें: "${inputText}"`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      });
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      const aiCorrected = data.choices[0].message.content.trim();
      setProgress(100);
      setCorrectedText(aiCorrected);

      // Extract all corrections from the comparison
      const allCorrections = extractCorrectionsFromResponse(inputText, aiCorrected);
      setCorrections(allCorrections);
      setIsLoading(false);
      clearInterval(progressInterval);
      
      // Track usage after successful correction
      await trackUsage('grammar_check');
      
      toast.success(`व्याकरण सुधार पूरा हो गया! ${allCorrections.length} सुधार मिले।`);
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
    setCorrections([]);
  };
  const copyToClipboard = async () => {
    if (correctedText) {
      await navigator.clipboard.writeText(correctedText);
      toast.success("टेक्स्ट कॉपी किया गया!");
    }
  };
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const getCorrectionTypeColor = (type: string) => {
    switch (type) {
      case 'grammar':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'spelling':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'punctuation':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'syntax':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  const getCorrectionTypeLabel = (type: string) => {
    switch (type) {
      case 'grammar':
        return 'व्याकरण';
      case 'spelling':
        return 'वर्तनी';
      case 'punctuation':
        return 'विराम चिह्न';
      case 'syntax':
        return 'वाक्य संरचना';
      default:
        return 'सुधार';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Modern Header */}
      <div className="text-center py-20 px-6">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            व्याकरणी
          </h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI की शक्ति से अपने हिंदी टेक्स्ट को पूर्ण और शुद्ध बनाएं
        </p>
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-slate-500">
            <Target className="h-5 w-5" />
            <span className="text-sm font-medium">99% सटीकता</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-medium">तत्काल परिणाम</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">सुरक्षित</span>
          </div>
        </div>
      </div>

      {/* Main Editor Section */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Original Text Panel */}
          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  मूल टेक्स्ट
                </CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                  {wordCount} शब्द
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="यहाँ अपना हिंदी टेक्स्ट लिखें..."
                className="min-h-[400px] text-lg border-0 resize-none focus-visible:ring-0 p-6 bg-slate-50 rounded-2xl text-slate-800 placeholder:text-slate-400 leading-relaxed"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-8">
                <span className="text-sm text-slate-500 font-medium">{charCount} अक्षर</span>
                <div className="flex space-x-4">
                  <Button
                    onClick={resetText}
                    variant="outline"
                    disabled={isLoading}
                    className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    रीसेट
                  </Button>
                  <Button
                    onClick={correctGrammar}
                    disabled={isLoading || !inputText.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isLoading ? 'सुधार रहे हैं...' : 'व्याकरण सुधारें'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corrected Text Panel */}
          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  सुधारा गया टेक्स्ट
                </CardTitle>
                <div className="flex items-center space-x-3">
                  {correctedText && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                      {correctedText.trim().split(/\s+/).length} शब्द
                    </Badge>
                  )}
                  {corrections.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="bg-white/20 text-white border-0 hover:bg-white/30 rounded-xl px-4 py-2"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {corrections.length} सुधार
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-2">
                        <DropdownMenuLabel className="text-base font-semibold text-slate-700 px-4 py-3">
                          सभी सुधार ({corrections.length})
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {corrections.map((correction, index) => (
                          <DropdownMenuItem key={index} className="p-0 focus:bg-slate-50 rounded-xl">
                            <div className="w-full p-4 border-b border-slate-100 last:border-b-0">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <Badge className={`${getCorrectionTypeColor(correction.type)} text-xs font-medium`}>
                                    {getCorrectionTypeLabel(correction.type)}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <X className="h-4 w-4 text-red-500" />
                                  <span className="text-red-600 text-sm line-through font-medium">"{correction.incorrect}"</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                  <span className="text-emerald-600 text-sm font-semibold">"{correction.correct}"</span>
                                </div>
                                <p className="text-xs text-slate-600 mt-2 ml-7 leading-relaxed">
                                  {correction.reason}
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="min-h-[400px] p-6 bg-slate-50 rounded-2xl">
                {correctedText ? (
                  <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {correctedText}
                  </p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowRight className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-lg font-medium">
                        सुधारा गया टेक्स्ट यहाँ दिखेगा...
                      </p>
                      <p className="text-sm text-slate-300 mt-2">
                        पहले मूल टेक्स्ट में कुछ लिखें
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Progress Bar */}
              {isLoading && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">प्रगति</span>
                    <span className="text-sm text-slate-500 font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out" />
                  </Progress>
                </div>
              )}

              {correctedText && !isLoading && (
                <div className="flex space-x-4 mt-8">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    कॉपी करें
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 border-2 text-center p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">तत्काल सुधार</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              एक क्लिक में व्याकरण सुधारें और परिणाम तुरंत देखें
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 border-2 text-center p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">AI संचालित</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              उन्नत कृत्रिम बुद्धिमत्ता से सटीक व्याकरण सुधार
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 border-2 text-center p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">विस्तृत विश्लेषण</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              प्रत्येक सुधार की पूर्ण व्याख्या और कारण देखें
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
