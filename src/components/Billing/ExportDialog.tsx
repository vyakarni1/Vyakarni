
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon, Loader2, Receipt } from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV, ExportTransaction } from "@/utils/exportUtils";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExportDialogProps {
  transactions: ExportTransaction[];
  userInfo: any;
}

const ExportDialog = ({ transactions, userInfo }: ExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exportType, setExportType] = useState<'report' | 'invoices'>('report');

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.created_at);
    const matchesDateRange = (!dateRange.from || transactionDate >= dateRange.from) &&
                            (!dateRange.to || transactionDate <= dateRange.to);
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesDateRange && matchesStatus;
  });

  const handleExport = async () => {
    if (filteredTransactions.length === 0) {
      alert('No data available for export.');
      return;
    }

    setIsExporting(true);
    
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filePrefix = exportType === 'report' ? 'billing-report' : 'invoices-bulk';
      
      switch (exportFormat) {
        case 'pdf':
          const pdfDoc = exportToPDF(filteredTransactions, userInfo);
          pdfDoc.save(`${filePrefix}-${timestamp}.pdf`);
          break;
          
        case 'excel':
          const wb = exportToExcel(filteredTransactions);
          XLSX.writeFile(wb, `${filePrefix}-${timestamp}.xlsx`);
          break;
          
        case 'csv':
          const csvContent = exportToCSV(filteredTransactions);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${filePrefix}-${timestamp}.csv`;
          link.click();
          break;
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          निर्यात करें
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Billing Data</DialogTitle>
        </DialogHeader>
        
        <Tabs value={exportType} onValueChange={(value: any) => setExportType(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="report" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Billing Report</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Professional Invoices</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="report" className="space-y-4">
            <div className="text-sm text-gray-600">
              Generate a comprehensive billing report with all transactions.
            </div>
          </TabsContent>
          
          <TabsContent value="invoices" className="space-y-4">
            <div className="text-sm text-gray-600">
              Generate professional tax invoices with company letterhead and GST details.
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="pdf">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel</span>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>CSV</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium">Status Filter</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="success">Successful</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : 'Start Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : 'End Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Total Transactions:</span>
              <Badge variant="secondary">{filteredTransactions.length}</Badge>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Total Amount:</span>
              <Badge variant="outline">
                ₹{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleExport} disabled={isExporting} className="flex-1">
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : `Export ${exportType === 'report' ? 'Report' : 'Invoices'}`}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
