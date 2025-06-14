
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, RefreshCw } from 'lucide-react';

const PaymentSuccessHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const paymentStatus = searchParams.get('payment');
  const orderId = searchParams.get('order_id');
  const subscriptionId = searchParams.get('subscription_id');

  useEffect(() => {
    if (paymentStatus === 'success') {
      if (subscriptionId) {
        toast({
          title: "AutoPay सब्स्क्रिप्शन सफल!",
          description: "आपका मासिक सब्स्क्रिप्शन सक्रिय हो गया है। AutoPay mandate सेटअप हो गया है।",
        });
      } else {
        toast({
          title: "भुगतान सफल!",
          description: "आपके खाते में शब्द जोड़ दिए गए हैं।",
        });
      }
    }
  }, [paymentStatus, subscriptionId, orderId, toast]);

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              {subscriptionId ? 'AutoPay सब्स्क्रिप्शन सफल!' : 'भुगतान सफल!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionId ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  आपका मासिक सब्स्क्रिप्शन सफलतापूर्वक सक्रिय हो गया है।
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                  <RefreshCw className="h-4 w-4" />
                  <span>AutoPay mandate सेटअप हो गया है</span>
                </div>
                <p className="text-green-600 font-medium">
                  अब हर महीने अपने आप भुगतान हो जाएगा।
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                आपका भुगतान सफलतापूर्वक पूरा हो गया है।
              </p>
            )}
            
            {(orderId || subscriptionId) && (
              <p className="text-sm text-gray-500">
                {subscriptionId ? `Subscription ID: ${subscriptionId}` : `ऑर्डर ID: ${orderId}`}
              </p>
            )}
            
            <p className="text-green-600 font-medium">
              शब्द आपके खाते में जोड़ दिए गए हैं।
            </p>
            
            <div className="pt-4 space-y-2">
              <Button
                onClick={() => navigate('/billing')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                बिलिंग पेज पर जाएं
              </Button>
              
              {subscriptionId && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/subscription-management')}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  सब्स्क्रिप्शन प्रबंधित करें
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessHandler;
