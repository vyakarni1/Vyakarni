
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

const PaymentSuccessHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const paymentStatus = searchParams.get('payment');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (paymentStatus === 'success' && orderId) {
      toast({
        title: "भुगतान सफल!",
        description: "आपके खाते में शब्द जोड़ दिए गए हैं।",
      });
    }
  }, [paymentStatus, orderId, toast]);

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              भुगतान सफल!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              आपका भुगतान सफलतापूर्वक पूरा हो गया है।
            </p>
            {orderId && (
              <p className="text-sm text-gray-500">
                ऑर्डर ID: {orderId}
              </p>
            )}
            <p className="text-green-600 font-medium">
              शब्द आपके खाते में जोड़ दिए गए हैं।
            </p>
            <div className="pt-4">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                डैशबोर्ड पर जाएं
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessHandler;
