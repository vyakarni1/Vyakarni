
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWordCredits } from '@/hooks/useWordCredits';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccessHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const { fetchBalance } = useWordCredits();
  const { refetch: refetchSubscription } = useSubscription();

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const refreshData = async () => {
      try {
        // Wait a bit for database to be updated
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refresh both word balance and subscription data
        await Promise.all([
          fetchBalance(),
          refetchSubscription()
        ]);
        
        console.log('Payment success: Data refreshed');
      } catch (error) {
        console.error('Error refreshing data after payment:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshData();
  }, [fetchBalance, refetchSubscription]);

  const handleContinue = () => {
    navigate('/billing');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            भुगतान सफल!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            आपका भुगतान सफलतापूर्वक पूरा हो गया है।
          </p>
          
          {paymentId && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>भुगतान ID:</strong> {paymentId}
              </p>
              {orderId && (
                <p className="text-sm text-gray-700">
                  <strong>ऑर्डर ID:</strong> {orderId}
                </p>
              )}
            </div>
          )}

          {isRefreshing ? (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">
                आपका खाता अपडेट हो रहा है...
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-green-600 font-medium">
                ✓ आपका खाता सफलतापूर्वक अपडेट हो गया है
              </p>
              <Button 
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                बिलिंग पेज पर जाएं
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessHandler;
