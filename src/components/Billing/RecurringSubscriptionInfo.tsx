
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRecurringSubscription } from '@/hooks/useRecurringSubscription';
import { useSubscription } from '@/hooks/useSubscription';
import { RefreshCw, Calendar, CreditCard, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RecurringSubscriptionInfo: React.FC = () => {
  const { mandate, fetchActiveMandate, isLoading } = useRecurringSubscription();
  const { subscription, isRecurringSubscription } = useSubscription();

  useEffect(() => {
    fetchActiveMandate();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'authenticated':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'created':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'सक्रिय';
      case 'authenticated':
        return 'प्रमाणित';
      case 'paused':
        return 'रुका हुआ';
      case 'cancelled':
        return 'निरस्त';
      case 'created':
        return 'बनाया गया';
      default:
        return status;
    }
  };

  if (!isRecurringSubscription()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>AutoPay सब्स्क्रिप्शन</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              आपके पास कोई AutoPay सब्स्क्रिप्शन नहीं है। 
              <Link to="/pricing" className="text-blue-600 hover:underline ml-1">
                यहाँ क्लिक करें और आरम्भ करें
              </Link>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>AutoPay सब्स्क्रिप्शन</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchActiveMandate}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            रिफ्रेश करें
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">वर्तमान प्लान</span>
              <Badge className={getStatusColor(subscription.status)}>
                {getStatusText(subscription.status)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{subscription.plan_name}</span>
              </div>
              
              {subscription.next_billing_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    अगला बिलिंग: {new Date(subscription.next_billing_date).toLocaleDateString('hi-IN')}
                  </span>
                </div>
              )}
            </div>

            {mandate && (
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">AutoPay जानकारी</h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mandate स्थिति</span>
                    <div className="mt-1">
                      <Badge className={getStatusColor(mandate.status)}>
                        {getStatusText(mandate.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">शेष भुगतान</span>
                    <p className="font-medium">{mandate.remaining_count}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-gray-600">अधिकतम राशि: </span>
                  <span className="font-medium">₹{mandate.max_amount}</span>
                </div>

                {mandate.next_charge_at && (
                  <div className="text-sm">
                    <span className="text-gray-600">अगला charge: </span>
                    <span className="font-medium">
                      {new Date(mandate.next_charge_at).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Show status-specific messages */}
            {subscription.status === 'active' && mandate?.status === 'active' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  आपका AutoPay सब्स्क्रिप्शन सफलतापूर्वक सक्रिय है।
                </AlertDescription>
              </Alert>
            )}

            {subscription.status === 'created' && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  आपका सब्स्क्रिप्शन बनाया गया है। AutoPay सक्रियण की प्रतीक्षा में है।
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-3 border-t">
              <Link to="/subscription-management">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  सब्स्क्रिप्शन प्रबंधित करें
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringSubscriptionInfo;
