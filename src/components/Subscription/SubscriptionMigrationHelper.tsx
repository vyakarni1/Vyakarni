
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface MigrationHelperProps {
  onMigrationComplete?: () => void;
}

const SubscriptionMigrationHelper: React.FC<MigrationHelperProps> = ({ onMigrationComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleMigration = async () => {
    if (!user) return;

    setIsLoading(true);
    setMigrationStatus(null);

    try {
      // Call edge function to handle subscription migration
      const { data, error } = await supabase.functions.invoke('razorpay-payment/migrate-subscription', {
        body: { user_id: user.id }
      });

      if (error) {
        throw new Error(error.message);
      }

      setMigrationStatus('success');
      toast({
        title: "माइग्रेशन सफल",
        description: "आपका सब्स्क्रिप्शन सफलतापूर्वक ठीक किया गया है।",
      });

      if (onMigrationComplete) {
        onMigrationComplete();
      }

    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
      toast({
        title: "माइग्रेशन त्रुटि",
        description: error instanceof Error ? error.message : "माइग्रेशन में समस्या हुई। कृपया सपोर्ट से संपर्क करें।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Call edge function to sync subscription status
      const { data, error } = await supabase.functions.invoke('razorpay-payment/sync-subscription', {
        body: { user_id: user.id }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "सिंक सफल",
        description: "आपका सब्स्क्रिप्शन स्थिति अपडेट की गई है।",
      });

      if (onMigrationComplete) {
        onMigrationComplete();
      }

    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "सिंक त्रुटि", 
        description: error instanceof Error ? error.message : "सिंक में समस्या हुई।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <RefreshCw className="h-5 w-5" />
          <span>सब्स्क्रिप्शन सुधार उपकरण</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            यदि आपके सब्स्क्रिप्शन में कोई समस्या है, तो नीचे दिए गए विकल्पों का उपयोग करके उसे ठीक करने का प्रयास करें।
          </AlertDescription>
        </Alert>

        {migrationStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              माइग्रेशन सफलतापूर्वक पूरा हुआ। आपका सब्स्क्रिप्शन अब सही तरीके से काम कर रहा है।
            </AlertDescription>
          </Alert>
        )}

        {migrationStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              माइग्रेशन में समस्या हुई। कृपया सपोर्ट से संपर्क करें या बाद में पुनः प्रयास करें।
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">विकल्प 1: स्वचालित सुधार</h4>
            <p className="text-sm text-blue-700 mb-3">
              सिस्टम स्वचालित रूप से आपके सब्स्क्रिप्शन की समस्याओं को ठीक करने का प्रयास करेगा।
            </p>
            <Button 
              onClick={handleMigration}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  सुधार हो रहा है...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  स्वचालित सुधार शुरू करें
                </>
              )}
            </Button>
          </div>

          <div>
            <h4 className="font-medium text-blue-800 mb-2">विकल्प 2: मैन्युअल सिंक</h4>
            <p className="text-sm text-blue-700 mb-3">
              Razorpay के साथ आपकी सब्स्क्रिप्शन स्थिति को मैन्युअल रूप से सिंक करें।
            </p>
            <Button 
              onClick={handleManualSync}
              disabled={isLoading}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  सिंक हो रहा है...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  मैन्युअल सिंक करें
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-blue-600 mt-4">
          <p>यदि समस्या बनी रहती है, तो कृपया हमारे सपोर्ट टीम से संपर्क करें।</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionMigrationHelper;
