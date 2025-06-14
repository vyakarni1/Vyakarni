
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Calendar, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubscriptionCharge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  charge_date: string;
  paid_at: string | null;
  razorpay_payment_id: string | null;
  error_code: string | null;
  error_description: string | null;
  failure_reason: string | null;
}

const SubscriptionChargeHistory: React.FC = () => {
  const { user } = useAuth();
  const [charges, setCharges] = useState<SubscriptionCharge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCharges = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscription_charges')
        .select('*')
        .eq('user_id', user.id)
        .order('charge_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching charges:', error);
      } else {
        setCharges(data || []);
      }
    } catch (error) {
      console.error('Error in fetchCharges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'captured':
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">सफल</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">असफल</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">प्रतीक्षित</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>भुगतान इतिहास</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCharges}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश करें
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>लोड हो रहा है...</span>
          </div>
        ) : charges.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              अभी तक कोई भुगतान नहीं हुआ है।
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {charges.map((charge) => (
              <div key={charge.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(charge.charge_date).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                  {getStatusBadge(charge.status)}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">राशि</span>
                    <p className="font-medium">₹{charge.amount} {charge.currency}</p>
                  </div>
                  
                  {charge.razorpay_payment_id && (
                    <div>
                      <span className="text-sm text-gray-600">Payment ID</span>
                      <p className="font-mono text-sm">{charge.razorpay_payment_id}</p>
                    </div>
                  )}
                </div>

                {charge.paid_at && (
                  <div>
                    <span className="text-sm text-gray-600">भुगतान की तारीख</span>
                    <p className="text-sm">
                      {new Date(charge.paid_at).toLocaleString('hi-IN')}
                    </p>
                  </div>
                )}

                {(charge.error_description || charge.failure_reason) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {charge.error_description || charge.failure_reason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionChargeHistory;
