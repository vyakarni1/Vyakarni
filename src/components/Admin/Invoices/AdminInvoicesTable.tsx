import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, User, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { hi } from "date-fns/locale";

interface Invoice {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method?: string;
  payment_gateway: string;
  razorpay_payment_id?: string;
  cashfree_payment_id?: string;
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface AdminInvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  selectedInvoices: string[];
  onSelectInvoice: (invoiceId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onExportSingle: (invoice: Invoice) => void;
}

const AdminInvoicesTable = ({
  invoices,
  isLoading,
  selectedInvoices,
  onSelectInvoice,
  onSelectAll,
  onExportSingle,
}: AdminInvoicesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'सफल', variant: 'default' as const },
      failed: { label: 'असफल', variant: 'destructive' as const },
      pending: { label: 'पेंडिंग', variant: 'secondary' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentGatewayBadge = (gateway: string) => {
    const colors = {
      razorpay: 'bg-blue-100 text-blue-800',
      cashfree: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[gateway as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {gateway.charAt(0).toUpperCase() + gateway.slice(1)}
      </span>
    );
  };

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(invoices.length / itemsPerPage);

  const isAllSelected = paginatedInvoices.length > 0 && paginatedInvoices.every(invoice => selectedInvoices.includes(invoice.id));
  const isIndeterminate = paginatedInvoices.some(invoice => selectedInvoices.includes(invoice.id)) && !isAllSelected;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            इनवॉयस लिस्ट
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            इनवॉयस लिस्ट
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">कोई इनवॉयस नहीं मिला</h3>
            <p className="text-sm text-muted-foreground">फिल्टर बदलकर देखें या बाद में दोबारा कोशिश करें</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          इनवॉयस लिस्ट
          <span className="text-sm text-muted-foreground">({invoices.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onSelectAll}
                    ref={(ref) => {
                      if (ref) (ref as any).indeterminate = isIndeterminate;
                    }}
                  />
                </TableHead>
                <TableHead>उपयोगकर्ता</TableHead>
                <TableHead>राशि</TableHead>
                <TableHead>स्थिति</TableHead>
                <TableHead>गेटवे</TableHead>
                <TableHead>तारीख</TableHead>
                <TableHead>पेमेंट ID</TableHead>
                <TableHead className="w-12">क्रिया</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={(checked) => onSelectInvoice(invoice.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {invoice.userInfo?.name || 'अनाम उपयोगकर्ता'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {invoice.userInfo?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(invoice.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentGatewayBadge(invoice.payment_gateway)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(invoice.created_at), "dd MMM yyyy", { locale: hi })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(invoice.created_at), "HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {invoice.razorpay_payment_id && (
                        <div className="truncate max-w-20" title={invoice.razorpay_payment_id}>
                          {invoice.razorpay_payment_id}
                        </div>
                      )}
                      {invoice.cashfree_payment_id && (
                        <div className="truncate max-w-20" title={invoice.cashfree_payment_id}>
                          {invoice.cashfree_payment_id}
                        </div>
                      )}
                      {!invoice.razorpay_payment_id && !invoice.cashfree_payment_id && 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onExportSingle(invoice)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          इनवॉयस डाउनलोड
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              पेज {currentPage} of {totalPages} (कुल {invoices.length} इनवॉयस)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                पिछला
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                अगला
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminInvoicesTable;