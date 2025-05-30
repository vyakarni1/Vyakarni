
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
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

interface UserFiltersProps {
  filters: {
    search: string;
    subscription_status: string;
    date_range: string;
    sort_by: string;
    sort_order: string;
  };
  onFiltersChange: (filters: any) => void;
  onExport: (format: 'csv' | 'json') => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const UserFilters = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh, 
  isLoading 
}: UserFiltersProps) => {
  return (
    <div className="space-y-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">फिल्टर और खोज</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">खोजें</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="नाम या ईमेल खोजें..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">सब्सक्रिप्शन स्थिति</label>
          <Select 
            value={filters.subscription_status} 
            onValueChange={(value) => onFiltersChange({ ...filters, subscription_status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सभी</SelectItem>
              <SelectItem value="active">सक्रिय</SelectItem>
              <SelectItem value="free">मुफ्त</SelectItem>
              <SelectItem value="suspended">निलंबित</SelectItem>
              <SelectItem value="expired">समाप्त</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">क्रमबद्ध करें</label>
          <div className="flex space-x-2">
            <Select 
              value={filters.sort_by} 
              onValueChange={(value) => onFiltersChange({ ...filters, sort_by: value })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">नाम</SelectItem>
                <SelectItem value="created_at">निर्माण दिनांक</SelectItem>
                <SelectItem value="corrections">सुधार</SelectItem>
                <SelectItem value="words_used">शब्द उपयोग</SelectItem>
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
    </div>
  );
};

export default UserFilters;
