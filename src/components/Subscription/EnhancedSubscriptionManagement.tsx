
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRecurringSubscription } from '@/hooks/useRecurringSubscription';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CreditCard, AlertCircle, Pause, Play, X, RefreshCw, Settings } from 'lucide-react';
import SubscriptionStatusAlert from './SubscriptionStatusAlert';
import SubscriptionMigrationHelper from './SubscriptionMigrationHelper';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EnhancedSubscriptionManagement: React.FC = () => {
  const { mandate, fetchActiveMandate, pauseSubscription, cancelSubscription, isLoading } = useRecurringSubscription();
  const { subscription, isRecurringSubscription, getMandateStatus } = useSubscription();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState(false);
  const [showMigrationHelper, setShowMigrationHelper] = useState(false);

  useEffect(() => {
    fetchActiveMandate();
  }, []);

  useEffect(() => {
    // Show migration helper if there are subscription issues
    const hasIssues = (subscription?.status === 'active' && isRecurringSubscription() && !mandate) ||
                     (mandate && (mandate.status === 'halted' || mandate.status === 'failed'));
    setShowMigrationHelper(hasIssues);
  }, [subscription, mandate, isRecurringSubscription]);

  const handlePauseSubscription = async () => {
    setActionLoading(true);
    try {
      const success = await pauseSubscription();
      if (success) {
        await fetchActiveMandate();
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "सब्स्क्रिप्शन रोकने में समस्या हुई।",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      const success = await cancelSubscription();
      if (success) {
        await fetchActiveMandate();
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "सब्स्क्रिप्शन रद्द करने में समस्या हुई।",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">सक्रिय</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">रुका हुआ</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">रद्द</Badge>;
      case 'created':
        return <Badge className="bg-blue-100 text-blue-800">बनाया गया</Badge>;
      case 'halted':
        return <Badge className="bg-red-100 text-red-800">रोका गया</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">असफल</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMigrationComplete = () => {
    setShowMigrationHelper(false);
    fetchActiveMandate();
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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              आपके पास कोई सक्रिय AutoPay सब्स्क्रिप्शन नहीं है। मासिक सब्स्क्रिप्शन लेने के लिए प्राइसिंग पेज पर जाएं।
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <SubscriptionStatusAlert />

      {/* Migration Helper */}
      {showMigrationHelper && (
        <SubscriptionMigrationHelper onMigrationComplete={handleMigrationComplete} />
      )}

      {/* Main Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>AutoPay सब्स्क्रिप्शन प्रबंधन</span>
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
        <CardContent className="space-y-6">
          {subscription && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">वर्तमान प्लान</h3>
                {getStatusBadge(subscription.status)}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">प्लान नाम</span>
                  </div>
                  <p className="font-medium">{subscription.plan_name}</p>
                </div>
                
                {subscription.next_billing_date && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">अगला बिलिंग</span>
                    </div>
                    <p className="font-medium">
                      {new Date(subscription.next_billing_date).toLocaleDateString('hi-IN')}
                    </p>
                  </div>
                )}
              </div>

              {mandate && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold">AutoPay जानकारी</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-600">Mandate स्थिति</span>
                      <div>{getStatusBadge(mandate.status)}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm text-gray-600">शेष भुगतान</span>
                      <p className="font-medium">{mandate.remaining_count}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm text-gray-600">अधिकतम राशि</span>
                      <p className="font-medium">₹{mandate.max_amount}</p>
                    </div>
                  </div>

                  {mandate.next_charge_at && (
                    <div className="space-y-1">
                      <span className="text-sm text-gray-600">अगला charge</span>
                      <p className="font-medium">
                        {new Date(mandate.next_charge_at).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold">सब्स्क्रिप्शन कार्यवाही</h4>
                
                <div className="flex flex-wrap gap-3">
                  {mandate?.status === 'active' && (
                    <Button
                      variant="outline"
                      onClick={handlePauseSubscription}
                      disabled={actionLoading}
                      className="flex items-center space-x-2"
                    >
                      <Pause className="h-4 w-4" />
                      <span>सब्स्क्रिप्शन रोकें</span>
                    </Button>
                  )}
                  
                  {mandate?.status === 'paused' && (
                    <Button
                      variant="outline"
                      onClick={handlePauseSubscription}
                      disabled={actionLoading}
                      className="flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>सब्स्क्रिप्शन शुरू करें</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={actionLoading}
                    className="flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>सब्स्क्रिप्शन रद्द करें</span>
                  </Button>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    सब्स्क्रिप्शन रद्द करने पर यह अगले बिलिंग साइकल के अंत में बंद हो जाएगा।
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSubscriptionManagement;
