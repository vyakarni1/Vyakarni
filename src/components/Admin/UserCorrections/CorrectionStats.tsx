import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Palette, 
  Hash, 
  Calendar,
  Clock,
  Target
} from 'lucide-react';

interface CorrectionStatsProps {
  stats: {
    total_corrections: number;
    total_words: number;
    grammar_corrections: number;
    style_corrections: number;
    corrections_today: number;
    corrections_this_week: number;
    corrections_this_month: number;
    avg_words_per_correction: number;
  } | null;
  loading: boolean;
}

const CorrectionStats: React.FC<CorrectionStatsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const grammarPercentage = stats.total_corrections > 0 
    ? Math.round((stats.grammar_corrections / stats.total_corrections) * 100) 
    : 0;
  
  const stylePercentage = stats.total_corrections > 0 
    ? Math.round((stats.style_corrections / stats.total_corrections) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>सांख्यिकी सारांश</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.total_corrections}</div>
              <div className="text-sm text-muted-foreground">कुल सुधार</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.total_words.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">कुल शब्द</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-xl font-semibold text-muted-foreground">{stats.avg_words_per_correction}</div>
            <div className="text-sm text-muted-foreground">औसत शब्द प्रति सुधार</div>
          </div>
        </CardContent>
      </Card>

      {/* Correction Types */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>सुधार प्रकार</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm">व्याकरण सुधार</span>
              </div>
              <Badge variant="secondary">{stats.grammar_corrections}</Badge>
            </div>
            <Progress value={grammarPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">{grammarPercentage}%</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <span className="text-sm">शैली सुधार</span>
              </div>
              <Badge variant="secondary">{stats.style_corrections}</Badge>
            </div>
            <Progress value={stylePercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">{stylePercentage}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span>गतिविधि समयरेखा</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm">आज</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {stats.corrections_today}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm">इस सप्ताह</span>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {stats.corrections_this_week}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-purple-600" />
                <span className="text-sm">इस महीने</span>
              </div>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                {stats.corrections_this_month}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span>प्रदर्शन संकेतक</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">दैनिक औसत</span>
              <span className="font-medium">
                {stats.total_corrections > 0 ? Math.round(stats.corrections_this_month / 30) : 0} सुधार/दिन
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">साप्ताहिक औसत</span>
              <span className="font-medium">
                {Math.round(stats.corrections_this_month / 4)} सुधार/सप्ताह
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">सबसे ज्यादा इस्तेमाल</span>
              <span className="font-medium">
                {grammarPercentage > stylePercentage ? 'व्याकरण' : 'शैली'} सुधार
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrectionStats;