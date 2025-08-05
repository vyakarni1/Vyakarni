import { useState } from 'react';
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { Button } from "@/components/ui/button";
import { Receipt, Download, RefreshCw } from "lucide-react";
import { useAdminInvoices } from "@/hooks/useAdminInvoices";
import AdminInvoiceStats from "@/components/Admin/Invoices/AdminInvoiceStats";
import AdminInvoiceFilters from "@/components/Admin/Invoices/AdminInvoiceFilters";
import AdminInvoicesTable from "@/components/Admin/Invoices/AdminInvoicesTable";
import { useToast } from '@/hooks/use-toast';

const AdminInvoices = () => {
  const { toast } = useToast();
  const {
    invoices,
    isLoading,
    filters,
    setFilters,
    stats,
    exportInvoices,
    exportSingleInvoice,
    refetch,
  } = useAdminInvoices();

  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleBulkExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "कोई इनवॉयस चयनित नहीं",
        description: "एक्सपोर्ट करने के लिए कम से कम एक इनवॉयस चुनें",
        variant: "destructive",
      });
      return;
    }

    const selectedInvoiceData = invoices.filter(invoice => 
      selectedInvoices.includes(invoice.id)
    );
    
    exportInvoices(format, selectedInvoiceData);
  };

  const handleRefresh = () => {
    refetch();
    setSelectedInvoices([]);
  };

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              इनवॉयस प्रबंधन
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              सभी पेमेंट ट्रांजैक्शन और इनवॉयस देखें
            </p>
          </div>
          
          <div className="flex gap-2">
            {selectedInvoices.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkExport('pdf')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">चयनित एक्सपोर्ट</span>
                  <span className="sm:hidden">एक्सपोर्ट</span>
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedInvoices.length}
                  </span>
                </Button>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">रिफ्रेश</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <AdminInvoiceStats stats={stats} isLoading={isLoading} />

        {/* Filters */}
        <AdminInvoiceFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={exportInvoices}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          totalInvoices={invoices.length}
        />

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {selectedInvoices.length} इनवॉयस चयनित
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkExport('csv')}
                >
                  CSV एक्सपोर्ट
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkExport('excel')}
                >
                  Excel एक्सपोर्ट
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkExport('pdf')}
                >
                  PDF एक्सपोर्ट
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInvoices([])}
                >
                  साफ़ करें
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <AdminInvoicesTable
          invoices={invoices}
          isLoading={isLoading}
          selectedInvoices={selectedInvoices}
          onSelectInvoice={handleSelectInvoice}
          onSelectAll={handleSelectAll}
          onExportSingle={exportSingleInvoice}
        />

        {/* Summary Footer */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {invoices.filter(inv => inv.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">सफल ट्रांजैक्शन</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {invoices.filter(inv => inv.status === 'failed').length}
              </div>
              <div className="text-sm text-muted-foreground">असफल ट्रांजैक्शन</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {invoices.filter(inv => inv.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">पेंडिंग ट्रांजैक्शन</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminInvoices;