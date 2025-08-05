import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExportTransaction, exportToCSV, exportToExcel, exportToPDF, exportSingleInvoice } from '@/utils/exportUtils';

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

interface InvoiceStats {
  totalTransactions: number;
  totalRevenue: number;
  successRate: number;
  razorpayRevenue: number;
  cashfreeRevenue: number;
}

export const useAdminInvoices = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    status: 'all',
    dateRange: 'all',
    paymentGateway: 'all',
  });

  const fetchInvoices = async () => {
    let query = supabase
      .from('payment_transactions')
      .select(`
        *,
        profiles!inner(name, email, phone)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.search) {
      query = query.or(`profiles.name.ilike.%${filters.search}%,profiles.email.ilike.%${filters.search}%,razorpay_payment_id.ilike.%${filters.search}%,cashfree_payment_id.ilike.%${filters.search}%`);
    }

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.paymentGateway !== 'all') {
      query = query.eq('payment_gateway', filters.paymentGateway);
    }

    // Date range filtering
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'custom':
          if (filters.customStartDate) {
            startDate = new Date(filters.customStartDate);
            if (filters.customEndDate) {
              const endDate = new Date(filters.customEndDate);
              query = query.gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());
            } else {
              query = query.gte('created_at', startDate.toISOString());
            }
          }
          break;
        default:
          startDate = new Date(0);
      }

      if (filters.dateRange !== 'custom') {
        query = query.gte('created_at', startDate.toISOString());
      }
    }

    // Amount range filtering
    if (filters.minAmount !== undefined) {
      query = query.gte('amount', filters.minAmount);
    }
    if (filters.maxAmount !== undefined) {
      query = query.lte('amount', filters.maxAmount);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(transaction => ({
      ...transaction,
      userInfo: transaction.profiles
    })) || [];
  };

  const { data: invoices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-invoices', filters],
    queryFn: fetchInvoices,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate stats
  const stats: InvoiceStats = {
    totalTransactions: invoices.length,
    totalRevenue: invoices
      .filter(inv => inv.status === 'completed')
      .reduce((sum, inv) => sum + Number(inv.amount), 0),
    successRate: invoices.length > 0 
      ? (invoices.filter(inv => inv.status === 'completed').length / invoices.length) * 100 
      : 0,
    razorpayRevenue: invoices
      .filter(inv => inv.status === 'completed' && inv.payment_gateway === 'razorpay')
      .reduce((sum, inv) => sum + Number(inv.amount), 0),
    cashfreeRevenue: invoices
      .filter(inv => inv.status === 'completed' && inv.payment_gateway === 'cashfree')
      .reduce((sum, inv) => sum + Number(inv.amount), 0),
  };

  const exportInvoices = async (format: 'csv' | 'excel' | 'pdf', selectedInvoices?: any[]) => {
    try {
      const dataToExport = selectedInvoices || invoices;
      
      if (dataToExport.length === 0) {
        toast({
          title: "कोई डेटा नहीं",
          description: "एक्सपोर्ट करने के लिए कोई इनवॉयस नहीं मिला",
          variant: "destructive",
        });
        return;
      }

      const exportData: ExportTransaction[] = dataToExport.map(invoice => ({
        id: invoice.id,
        amount: Number(invoice.amount),
        currency: invoice.currency || 'INR',
        status: invoice.status,
        created_at: invoice.created_at,
        payment_method: invoice.payment_method || 'N/A',
        payment_gateway: invoice.payment_gateway || 'N/A',
      }));

      const userInfo = {
        name: 'व्याकरणी एडमिन',
        email: 'admin@example.com',
        phone: '+91-XXXXXXXXXX',
      };

      switch (format) {
        case 'csv':
          const csvData = exportToCSV(exportData);
          const csvBlob = new Blob([csvData], { type: 'text/csv' });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement('a');
          csvLink.href = csvUrl;
          csvLink.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
          csvLink.click();
          break;

        case 'excel':
          await exportToExcel(exportData);
          break;

        case 'pdf':
          const pdfDoc = exportToPDF(exportData, userInfo);
          pdfDoc.save(`invoices-${new Date().toISOString().split('T')[0]}.pdf`);
          break;
      }

      toast({
        title: "एक्सपोर्ट सफल",
        description: `${dataToExport.length} इनवॉयस ${format.toUpperCase()} फॉर्मेट में एक्सपोर्ट किए गए`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "एक्सपोर्ट त्रुटि",
        description: "इनवॉयस एक्सपोर्ट करते समय त्रुटि हुई",
        variant: "destructive",
      });
    }
  };

  const exportSingleInvoiceAction = async (invoice: any) => {
    try {
      const exportData: ExportTransaction = {
        id: invoice.id,
        amount: Number(invoice.amount),
        currency: invoice.currency || 'INR',
        status: invoice.status,
        created_at: invoice.created_at,
        payment_method: invoice.payment_method || 'N/A',
        payment_gateway: invoice.payment_gateway || 'N/A',
      };

      const userInfo = {
        name: invoice.userInfo?.name || 'अनाम उपयोगकर्ता',
        email: invoice.userInfo?.email || 'N/A',
        phone: invoice.userInfo?.phone || 'N/A',
      };

      const pdfDoc = exportSingleInvoice(exportData, userInfo);
      pdfDoc.save(`invoice-${invoice.id.substring(0, 8)}.pdf`);

      toast({
        title: "इनवॉयस डाउनलोड",
        description: "इनवॉयस सफलतापूर्वक डाउनलोड किया गया",
      });
    } catch (error) {
      console.error('Single invoice export error:', error);
      toast({
        title: "डाउनलोड त्रुटि",
        description: "इनवॉयस डाउनलोड करते समय त्रुटि हुई",
        variant: "destructive",
      });
    }
  };

  return {
    invoices,
    isLoading,
    error,
    filters,
    setFilters,
    stats,
    exportInvoices,
    exportSingleInvoice: exportSingleInvoiceAction,
    refetch,
  };
};