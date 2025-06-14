
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Link } from 'react-router-dom';

const SubscriptionStatusAlert: React.FC = () => {
  const { subscription, isRecurringSubscription } = useSubscription();

  if (!subscription) return null;

  // Check for problematic subscription states
  const hasActiveSubscriptionWithoutMandate = subscription.status === 'active' && 
    isRecurringSubscription() && !subscription.mandate_id;

  const isSubscriptionExpiring = subscription.expires_at && 
    new Date(subscription.expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  if (hasActiveSubscriptionWithoutMandate) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 mb-6">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="space-y-2">
            <p className="font-medium">सब्स्क्रिप्शन सेटअप अधूरा है</p>
            <p className="text-sm">
              आपका सब्स्क्रिप्शन सक्रिय है लेकिन AutoPay mandate सेटअप नहीं हुआ है। 
              अगले बिलिंग साइकल के लिए mandate सेटअप करना आवश्यक है।
            </p>
            <div className="flex space-x-2 mt-3">
              <Link to="/subscription-management">
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  सब्स्क्रिप्शन ठीक करें
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="sm" variant="outline">
                  नया सब्स्क्रिप्शन शुरू करें
                </Button>
              </Link>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (isSubscriptionExpiring) {
    return (
      <Alert className="border-orange-200 bg-orange-50 mb-6">
        <Info className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="space-y-2">
            <p className="font-medium">सब्स्क्रिप्शन जल्द समाप्त हो रहा है</p>
            <p className="text-sm">
              आपका सब्स्क्रिप्शन {new Date(subscription.expires_at!).toLocaleDateString('hi-IN')} को समाप्त हो जाएगा।
              {subscription.auto_renewal ? ' AutoPay सक्रिय है, यह अपने आप नवीनीकृत हो जाएगा।' : ' कृपया नवीनीकरण करें।'}
            </p>
            {!subscription.auto_renewal && (
              <div className="flex space-x-2 mt-3">
                <Link to="/pricing">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    नवीनीकरण करें
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Show success state for healthy subscriptions
  if (subscription.status === 'active') {
    return (
      <Alert className="border-green-200 bg-green-50 mb-6">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <p>आपका सब्स्क्रिप्शन सक्रिय है और सही तरीके से काम कर रहा है।</p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default SubscriptionStatusAlert;
