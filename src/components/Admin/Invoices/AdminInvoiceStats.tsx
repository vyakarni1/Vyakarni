import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, DollarSign, TrendingUp, CreditCard } from "lucide-react";

interface InvoiceStats {
  totalTransactions: number;
  totalRevenue: number;
  successRate: number;
  razorpayRevenue: number;
  cashfreeRevenue: number;
}

interface AdminInvoiceStatsProps {
  stats: InvoiceStats;
  isLoading: boolean;
}

const AdminInvoiceStats = ({ stats, isLoading }: AdminInvoiceStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">कुल ट्रांजैक्शन</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">सभी पेमेंट ट्रांजैक्शन</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">कुल रेवेन्यू</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">सफल ट्रांजैक्शन से</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">सफलता दर</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.successRate / 100) * stats.totalTransactions)} सफल ट्रांजैक्शन
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">गेटवे वितरण</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Razorpay</span>
              <span className="font-medium">{formatCurrency(stats.razorpayRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cashfree</span>
              <span className="font-medium">{formatCurrency(stats.cashfreeRevenue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvoiceStats;