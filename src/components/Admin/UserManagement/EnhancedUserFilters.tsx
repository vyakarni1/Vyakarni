import React from 'react';
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
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              उपयोगकर्ता फिल्टर और खोज
            </CardTitle>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>{totalUsers} उपयोगकर्ता</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport('csv')}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onExport('json')}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">खोजें</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="नाम या ID खोजें..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">भूमिका</label>
            <Select 
              value={filters.role} 
              onValueChange={(value) => onFiltersChange({ ...filters, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी भूमिकायें</SelectItem>
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
                <SelectItem value="incomplete">अपूर्ण</SelectItem>
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
                <SelectItem value="month">इस माह</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sorting Options */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">क्रमबद्ध करें:</label>
            <div className="flex space-x-2">
              <Select 
                value={filters.sort_by} 
                onValueChange={(value) => onFiltersChange({ ...filters, sort_by: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
