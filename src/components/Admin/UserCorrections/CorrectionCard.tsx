import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Calendar, 
  Hash, 
  BookOpen, 
  Palette, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Copy
} from 'lucide-react';
import { Correction } from '@/types/grammarChecker';

interface AdminTextCorrection {
  id: string;
  user_id: string;
  original_text: string;
  corrected_text: string;
  processing_type: 'grammar' | 'style';
  corrections_data: Correction[];
  words_used: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

interface CorrectionCardProps {
  correction: AdminTextCorrection;
  index: number;
}

const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('hi-IN'),
      time: date.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDate(correction.created_at);

  const getProcessingTypeBadge = () => {
    if (correction.processing_type === 'grammar') {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <BookOpen className="h-3 w-3 mr-1" />
          व्याकरण
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
        <Palette className="h-3 w-3 mr-1" />
        शैली
      </Badge>
    );
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const highlightDifferences = (original: string, corrected: string) => {
    // Simple word-level highlighting (can be enhanced with proper diff algorithm)
    const originalWords = original.split(' ');
    const correctedWords = corrected.split(' ');
    
    return {
      original: originalWords.map((word, i) => {
        const isChanged = correctedWords[i] !== word;
        return (
          <span 
            key={i} 
            className={isChanged ? 'bg-red-100 text-red-800 px-1 rounded' : ''}
          >
            {word}
          </span>
        );
      }),
      corrected: correctedWords.map((word, i) => {
        const isChanged = originalWords[i] !== word;
        return (
          <span 
            key={i} 
            className={isChanged ? 'bg-green-100 text-green-800 px-1 rounded' : ''}
          >
            {word}
          </span>
        );
      })
    };
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div>
              {getProcessingTypeBadge()}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
              <span>{time}</span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Hash className="h-3 w-3" />
              <span>{correction.words_used} शब्द</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Original Text Preview */}
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">मूल टेक्स्ट:</div>
          <div className="bg-muted/50 p-3 rounded-md text-sm leading-relaxed">
            {truncateText(correction.original_text)}
          </div>
        </div>

        {/* Corrected Text Preview */}
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">सुधारा गया टेक्स्ट:</div>
          <div className="bg-green-50 p-3 rounded-md text-sm leading-relaxed">
            {truncateText(correction.corrected_text)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              <Eye className="h-3 w-3 mr-1" />
              तुलना देखें
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(correction.corrected_text)}
            >
              <Copy className="h-3 w-3 mr-1" />
              कॉपी करें
            </Button>
          </div>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                विवरण देखें
                {isExpanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Text Comparison */}
        {showComparison && (
          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-red-600 mb-2">मूल टेक्स्ट (त्रुटियों के साथ)</div>
                <div className="bg-red-50 p-3 rounded-md text-sm leading-relaxed border-l-4 border-red-200">
                  {highlightDifferences(correction.original_text, correction.corrected_text).original.map((word, i) => (
                    <span key={i}>{word} </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-green-600 mb-2">सुधारा गया टेक्स्ट</div>
                <div className="bg-green-50 p-3 rounded-md text-sm leading-relaxed border-l-4 border-green-200">
                  {highlightDifferences(correction.original_text, correction.corrected_text).corrected.map((word, i) => (
                    <span key={i}>{word} </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Corrections */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="border-t pt-4">
            {correction.corrections_data && correction.corrections_data.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">
                  सुधार विवरण ({correction.corrections_data.length} सुधार)
                </div>
                <div className="space-y-2">
                  {correction.corrections_data.map((corr, i) => (
                    <div key={i} className="bg-muted/30 p-3 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {corr.type === 'grammar' ? 'व्याकरण' : 
                             corr.type === 'spelling' ? 'वर्तनी' :
                             corr.type === 'punctuation' ? 'विराम चिह्न' : 
                             corr.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium text-red-600">गलत:</span> 
                          <span className="ml-2 bg-red-100 px-2 py-1 rounded">{corr.incorrect}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">सही:</span> 
                          <span className="ml-2 bg-green-100 px-2 py-1 rounded">{corr.correct}</span>
                        </div>
                        {corr.reason && (
                          <div className="text-muted-foreground text-xs mt-2">
                            <span className="font-medium">कारण:</span> {corr.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CorrectionCard;