
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV, ExportTransaction } from "@/utils/exportUtils";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

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

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.created_at);
    const matchesDateRange = (!dateRange.from || transactionDate >= dateRange.from) &&
                            (!dateRange.to || transactionDate <= dateRange.to);
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesDateRange && matchesStatus;
  });

  const handleExport = async () => {
    if (filteredTransactions.length === 0) {
      alert('निर्यात के लिए कोई डेटा उपलब्ध नहीं है।');
      return;
    }

    setIsExporting(true);
    
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      
      switch (exportFormat) {
        case 'pdf':
          const pdfDoc = exportToPDF(filteredTransactions, userInfo);
          pdfDoc.save(`billing-report-${timestamp}.pdf`);
          break;
          
        case 'excel':
          const wb = exportToExcel(filteredTransactions);
          XLSX.writeFile(wb, `billing-report-${timestamp}.xlsx`);
          break;
          
        case 'csv':
          const csvContent = exportToCSV(filteredTransactions);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `billing-report-${timestamp}.csv`;
          link.click();
          break;
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('निर्यात में त्रुटि हुई। कृपया पुनः प्रयास करें।');
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
          <DialogTitle>बिलिंग रिपोर्ट निर्यात करें</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium">फॉर्मेट चुनें</label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <label className="text-sm font-medium">स्थिति फिल्टर</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी</SelectItem>
                <SelectItem value="success">सफल</SelectItem>
                <SelectItem value="failed">असफल</SelectItem>
                <SelectItem value="pending">प्रतीक्षारत</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium">तारीख सीमा</label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : 'शुरुआत'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
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
                    {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : 'अंत'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
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
              <span>कुल लेनदेन:</span>
              <Badge variant="secondary">{filteredTransactions.length}</Badge>
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
              {isExporting ? 'निर्यात हो रहा है...' : 'निर्यात करें'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              रद्द करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
