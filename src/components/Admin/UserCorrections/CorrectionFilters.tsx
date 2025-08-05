import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, RotateCcw } from 'lucide-react';

interface CorrectionFiltersProps {
  filters: {
    search: string;
    processing_type: 'all' | 'grammar' | 'style';
    date_range: 'all' | 'today' | 'week' | 'month';
    min_words: number;
    max_words: number;
  };
  onFiltersChange: (filters: CorrectionFiltersProps['filters']) => void;
}

const CorrectionFilters: React.FC<CorrectionFiltersProps> = ({ filters, onFiltersChange }) => {
  const resetFilters = () => {
    onFiltersChange({
      search: '',
      processing_type: 'all',
      date_range: 'all',
      min_words: 0,
      max_words: 1000000
    });
  };

  const updateFilter = <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">खोजें</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="टेक्स्ट में खोजें..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Processing Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">सुधार प्रकार</Label>
            <Select value={filters.processing_type} onValueChange={(value) => updateFilter('processing_type', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी</SelectItem>
                <SelectItem value="grammar">व्याकरण</SelectItem>
                <SelectItem value="style">शैली</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">समय सीमा</Label>
            <Select value={filters.date_range} onValueChange={(value) => updateFilter('date_range', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी समय</SelectItem>
                <SelectItem value="today">आज</SelectItem>
                <SelectItem value="week">पिछले 7 दिन</SelectItem>
                <SelectItem value="month">पिछले 30 दिन</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Word Count Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">शब्द संख्या सीमा</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="न्यूनतम"
                value={filters.min_words || ''}
                onChange={(e) => updateFilter('min_words', parseInt(e.target.value) || 0)}
                className="w-full"
                min="0"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="अधिकतम"
                value={filters.max_words === 1000000 ? '' : filters.max_words}
                onChange={(e) => updateFilter('max_words', parseInt(e.target.value) || 1000000)}
                className="w-full"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end pt-4 border-t mt-4">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4 mr-1" />
            फिल्टर रीसेट करें
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrectionFilters;