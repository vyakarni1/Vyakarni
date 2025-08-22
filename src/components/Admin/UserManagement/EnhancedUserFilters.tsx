import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, Download, RefreshCw, Users, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnhancedUserFiltersProps {
  filters: {
    search: string;
    role: string;
    activity_status: string;
    word_balance_range: string;
    profile_completion: string;
    date_range: string;
    sort_by: string;
    sort_order: string;
  };
  onFiltersChange: (filters: any) => void;
  onExport: (format: 'csv' | 'json') => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalUsers: number;
}

const EnhancedUserFilters = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh, 
  isLoading,
  totalUsers
}: EnhancedUserFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Update local search value when filters change externally
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
              उपयोगकर्ता फिल्टर और खोज
            </CardTitle>
            <div className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{totalUsers} उपयोगकर्ता</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2 lg:gap-3">
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={() => onExport('csv')}
              className="flex items-center space-x-1 min-h-[36px] sm:min-h-[40px]"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">CSV</span>
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={() => onExport('json')}
              className="flex items-center space-x-1 min-h-[36px] sm:min-h-[40px]"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">JSON</span>
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1 min-h-[36px] sm:min-h-[40px]"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">रिफ्रेश</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 py-3 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-3 xl:col-span-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">खोजें</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="नाम या ID खोजें..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8 sm:pl-10 text-sm min-h-[44px]"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">भूमिका</label>
            <Select 
              value={filters.role} 
              onValueChange={(value) => onFiltersChange({ ...filters, role: value })}
            >
              <SelectTrigger className="min-h-[44px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">सभी भूमिकाएं</SelectItem>
                <SelectItem value="admin">एडमिन</SelectItem>
                <SelectItem value="user">उपयोगकर्ता</SelectItem>
                <SelectItem value="suspended">निलंबित</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">गतिविधि स्थिति</label>
            <Select 
              value={filters.activity_status} 
              onValueChange={(value) => onFiltersChange({ ...filters, activity_status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी</SelectItem>
                <SelectItem value="active">सक्रिय (7 दिन)</SelectItem>
                <SelectItem value="inactive">निष्क्रिय</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Word Balance Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Coins className="h-3 w-3" />
              शब्द बैलेंस
            </label>
            <Select 
              value={filters.word_balance_range} 
              onValueChange={(value) => onFiltersChange({ ...filters, word_balance_range: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी</SelectItem>
                <SelectItem value="none">शून्य (0)</SelectItem>
                <SelectItem value="low">कम (1-99)</SelectItem>
                <SelectItem value="medium">मध्यम (100-999)</SelectItem>
                <SelectItem value="high">उच्च (1000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Profile Completion */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">प्रोफ़ाइल पूर्णता</label>
            <Select 
              value={filters.profile_completion} 
              onValueChange={(value) => onFiltersChange({ ...filters, profile_completion: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी</SelectItem>
                <SelectItem value="incomplete">अधूरी</SelectItem>
                <SelectItem value="complete">पूर्ण</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">दिनांक सीमा</label>
            <Select 
              value={filters.date_range} 
              onValueChange={(value) => onFiltersChange({ ...filters, date_range: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी समय</SelectItem>
                <SelectItem value="today">आज</SelectItem>
                <SelectItem value="week">इस सप्ताह</SelectItem>
                <SelectItem value="month">इस महीने</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sorting Options */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0">क्रमबद्ध करें:</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 flex-1">
              <Select 
                value={filters.sort_by} 
                onValueChange={(value) => onFiltersChange({ ...filters, sort_by: value })}
              >
                <SelectTrigger className="min-h-[44px] text-sm sm:w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="name">नाम</SelectItem>
                  <SelectItem value="created_at">निर्माण दिनांक</SelectItem>
                  <SelectItem value="word_balance">शब्द बैलेंस</SelectItem>
                  <SelectItem value="profile_completion">प्रोफ़ाइल पूर्णता</SelectItem>
                  <SelectItem value="last_activity">अंतिम गतिविधि</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.sort_order} 
                onValueChange={(value) => onFiltersChange({ ...filters, sort_order: value })}
              >
                <SelectTrigger className="min-h-[44px] text-sm w-full sm:w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="asc">↑</SelectItem>
                  <SelectItem value="desc">↓</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedUserFilters;
