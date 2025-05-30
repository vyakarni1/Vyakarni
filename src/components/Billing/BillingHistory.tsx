
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { History, Download, Calendar } from "lucide-react";
import { format } from "date-fns";

interface WordPurchase {
  id: string;
  words_purchased: number;
  total_amount: number;
  status: string;
  purchase_date: string;
  expiry_date: string;
  razorpay_payment_id: string | null;
}

interface UsageHistory {
  id: string;
  words_used: number;
  action_type: string;
  created_at: string;
  text_processed: string | null;
}

const BillingHistory = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<WordPurchase[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'usage'>('purchases');

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      // Fetch word purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('word_purchases')
        .select('*')
        .eq('user_id', user?.id)
        .order('purchase_date', { ascending: false });

      if (purchasesError) throw purchasesError;
      setPurchases(purchasesData || []);

      // Fetch recent usage history (last 50 records)
      const { data: usageData, error: usageError } = await supabase
        .from('word_usage_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (usageError) throw usageError;
      setUsageHistory(usageData || []);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      'completed': { label: 'पूर्ण', variant: 'default' },
      'pending': { label: 'लंबित', variant: 'secondary' },
      'failed': { label: 'असफल', variant: 'destructive' },
      'cancelled': { label: 'रद्द', variant: 'outline' }
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels: { [key: string]: string } = {
      'grammar_check': 'व्याकरण जांच',
      'style_enhance': 'शैली सुधार',
      'spelling_check': 'वर्तनी जांच',
      'text_correction': 'पाठ सुधार'
    };
    return labels[actionType] || actionType;
  };

  const exportData = () => {
    const dataToExport = activeTab === 'purchases' ? purchases : usageHistory;
    const headers = activeTab === 'purchases' 
      ? ['Date', 'Words', 'Amount', 'Status', 'Payment ID']
      : ['Date', 'Words Used', 'Action Type', 'Text Preview'];

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => {
        if (activeTab === 'purchases') {
          const purchase = item as WordPurchase;
          return [
            format(new Date(purchase.purchase_date), 'dd/MM/yyyy'),
            purchase.words_purchased,
            `₹${purchase.total_amount}`,
            purchase.status,
            purchase.razorpay_payment_id || 'N/A'
          ].join(',');
        } else {
          const usage = item as UsageHistory;
          return [
            format(new Date(usage.created_at), 'dd/MM/yyyy HH:mm'),
            usage.words_used,
            getActionTypeLabel(usage.action_type),
            (usage.text_processed || '').substring(0, 50).replace(/,/g, ';')
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab === 'purchases' ? 'purchases' : 'usage'}_history_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>बिलिंग हिस्ट्री</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'purchases' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('purchases')}
              >
                खरीदारी
              </Button>
              <Button
                variant={activeTab === 'usage' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('usage')}
              >
                उपयोग
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                एक्सपोर्ट
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'purchases' ? (
            <div className="space-y-4">
              {purchases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>अभी तक कोई खरीदारी नहीं की गई है</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>तारीख</TableHead>
                      <TableHead>शब्द</TableHead>
                      <TableHead>राशि</TableHead>
                      <TableHead>स्थिति</TableHead>
                      <TableHead>समाप्ति</TableHead>
                      <TableHead>पेमेंट ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          {format(new Date(purchase.purchase_date), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {purchase.words_purchased.toLocaleString()}
                        </TableCell>
                        <TableCell>₹{purchase.total_amount}</TableCell>
                        <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                        <TableCell>
                          {format(new Date(purchase.expiry_date), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {purchase.razorpay_payment_id || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {usageHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>अभी तक कोई उपयोग रिकॉर्ड नहीं है</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>तारीख/समय</TableHead>
                      <TableHead>शब्द उपयोग</TableHead>
                      <TableHead>गतिविधि प्रकार</TableHead>
                      <TableHead>टेक्स्ट प्रीव्यू</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageHistory.map((usage) => (
                      <TableRow key={usage.id}>
                        <TableCell>
                          {format(new Date(usage.created_at), 'dd MMM yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {usage.words_used}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getActionTypeLabel(usage.action_type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {usage.text_processed || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory;
