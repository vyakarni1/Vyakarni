import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, RefreshCw, Download, X } from "lucide-react";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InvoiceFilters {
  search: string;
  status: 'all' | 'completed' | 'failed' | 'pending';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  paymentGateway: 'all' | 'razorpay' | 'cashfree';
  minAmount?: number;
  maxAmount?: number;
}

interface AdminInvoiceFiltersProps {
  filters: InvoiceFilters;
  onFiltersChange: (filters: InvoiceFilters) => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalInvoices: number;
}

const AdminInvoiceFilters = ({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  isLoading,
  totalInvoices,
}: AdminInvoiceFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleFilterChange = (key: keyof InvoiceFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      dateRange: 'all',
      paymentGateway: 'all',
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDateRangeChange = (value: string) => {
    handleFilterChange('dateRange', value);
    if (value !== 'custom') {
      setStartDate(undefined);
      setEndDate(undefined);
      handleFilterChange('customStartDate', undefined);
      handleFilterChange('customEndDate', undefined);
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      handleFilterChange('customStartDate', date ? format(date, 'yyyy-MM-dd') : undefined);
    } else {
      setEndDate(date);
      handleFilterChange('customEndDate', date ? format(date, 'yyyy-MM-dd') : undefined);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.paymentGateway !== 'all') count++;
    if (filters.minAmount !== undefined) count++;
    if (filters.maxAmount !== undefined) count++;
    return count;
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Top Row - Always Visible */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <Input
              placeholder="उपयोगकर्ता, ईमेल या पेमेंट ID खोजें..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              फिल्टर
              {getActiveFiltersCount() > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">रिफ्रेश</span>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">एक्सपोर्ट</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onExport('csv')}
                    disabled={totalInvoices === 0}
                  >
                    CSV
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onExport('excel')}
                    disabled={totalInvoices === 0}
                  >
                    Excel
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onExport('pdf')}
                    disabled={totalInvoices === 0}
                  >
                    PDF
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <Label htmlFor="status-filter" className="text-sm font-medium">
                  स्थिति
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="स्थिति चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी</SelectItem>
                    <SelectItem value="completed">सफल</SelectItem>
                    <SelectItem value="failed">असफल</SelectItem>
                    <SelectItem value="pending">पेंडिंग</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Gateway Filter */}
              <div>
                <Label htmlFor="gateway-filter" className="text-sm font-medium">
                  पेमेंट गेटवे
                </Label>
                <Select
                  value={filters.paymentGateway}
                  onValueChange={(value) => handleFilterChange('paymentGateway', value)}
                >
                  <SelectTrigger id="gateway-filter">
                    <SelectValue placeholder="गेटवे चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="cashfree">Cashfree</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div>
                <Label htmlFor="date-filter" className="text-sm font-medium">
                  तारीख सीमा
                </Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={handleDateRangeChange}
                >
                  <SelectTrigger id="date-filter">
                    <SelectValue placeholder="तारीख चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी</SelectItem>
                    <SelectItem value="today">आज</SelectItem>
                    <SelectItem value="week">इस सप्ताह</SelectItem>
                    <SelectItem value="month">इस महीने</SelectItem>
                    <SelectItem value="custom">कस्टम</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full flex items-center gap-2"
                  disabled={getActiveFiltersCount() === 0}
                >
                  <X className="h-4 w-4" />
                  साफ़ करें
                </Button>
              </div>
            </div>

            {/* Custom Date Range */}
            {filters.dateRange === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">शुरुआती तारीख</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: hi }) : "तारीख चुनें"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => handleCustomDateChange('start', date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium">अंतिम तारीख</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: hi }) : "तारीख चुनें"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => handleCustomDateChange('end', date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Amount Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-amount" className="text-sm font-medium">
                  न्यूनतम राशि (₹)
                </Label>
                <Input
                  id="min-amount"
                  type="number"
                  placeholder="न्यूनतम राशि"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div>
                <Label htmlFor="max-amount" className="text-sm font-medium">
                  अधिकतम राशि (₹)
                </Label>
                <Input
                  id="max-amount"
                  type="number"
                  placeholder="अधिकतम राशि"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          कुल {totalInvoices} इनवॉयस मिले
          {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount() > 0 ? 'फिल्टर लागू' : ''})`}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminInvoiceFilters;