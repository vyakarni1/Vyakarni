
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Database, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { runDatabaseCleanup, getDatabaseSizeInfo, type CleanupSummary } from '@/utils/databaseCleanup';

const DatabaseCleanup = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<CleanupSummary | null>(null);
  const [sizeInfo, setSizeInfo] = useState<Record<string, number> | null>(null);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setIsRunning(true);
    try {
      const result = await runDatabaseCleanup();
      setLastResult(result);
      
      if (result.totalSuccess) {
        toast({
          title: "सफाई पूर्ण",
          description: `${result.totalItemsRemoved} आइटम सफलतापूर्वक हटाए गए`,
        });
      } else {
        toast({
          title: "सफाई आंशिक रूप से पूर्ण",
          description: "कुछ त्रुटियों के साथ सफाई पूर्ण हुई",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: "त्रुटि",
        description: "डेटाबेस सफाई में त्रुटि हुई",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetSizeInfo = async () => {
    try {
      const info = await getDatabaseSizeInfo();
      if (info.success) {
        setSizeInfo(info.sizes);
      }
    } catch (error) {
      console.error('Error getting size info:', error);
    }
  };

  React.useEffect(() => {
    handleGetSizeInfo();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            डेटाबेस सफाई
          </CardTitle>
          <CardDescription>
            अनावश्यक डेटा को सुरक्षित रूप से हटाएं। यह केवल लॉग्स और अस्थायी डेटा को प्रभावित करेगा।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              यह सफाई निम्नलिखित को हटाएगी:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>30 दिन से पुराने डिक्शनरी sync लॉग्स</li>
                <li>30 दिन से पुराने processed webhook लॉग्स</li>
                <li>समाप्त हो चुके analytics cache entries</li>
                <li>समाप्त हो चुके password reset tokens</li>
              </ul>
              <strong className="block mt-2">उपयोगकर्ता डेटा, क्रेडिट्स, और व्यावसायिक डेटा सुरक्षित रहेगा।</strong>
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button
              onClick={handleCleanup}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isRunning ? 'सफाई चल रही है...' : 'डेटाबेस सफाई शुरू करें'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGetSizeInfo}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              साइज़ जानकारी रीफ्रेश करें
            </Button>
          </div>
        </CardContent>
      </Card>

      {sizeInfo && (
        <Card>
          <CardHeader>
            <CardTitle>डेटाबेस साइज़ जानकारी</CardTitle>
            <CardDescription>टेबल्स में रिकॉर्ड्स की संख्या</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(sizeInfo).map(([table, count]) => (
                <div key={table} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{table}</span>
                  <Badge variant="secondary" className="w-fit">
                    {count.toLocaleString()} रिकॉर्ड्स
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastResult.totalSuccess ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              अंतिम सफाई परिणाम
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Password Reset Tokens:</span>
                  <Badge variant={lastResult.passwordResetTokens.success ? "default" : "destructive"}>
                    {lastResult.passwordResetTokens.success ? "सफल" : "असफल"}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span>Dictionary Sync Logs:</span>
                  <Badge variant={lastResult.dictionarySyncLogs.success ? "default" : "destructive"}>
                    {lastResult.dictionarySyncLogs.itemsRemoved} हटाए गए
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span>Webhook Logs:</span>
                  <Badge variant={lastResult.webhookLogs.success ? "default" : "destructive"}>
                    {lastResult.webhookLogs.itemsRemoved} हटाए गए
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span>Analytics Cache:</span>
                  <Badge variant={lastResult.analyticsCache.success ? "default" : "destructive"}>
                    {lastResult.analyticsCache.itemsRemoved} हटाए गए
                  </Badge>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {lastResult.totalItemsRemoved}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    कुल आइटम हटाए गए
                  </div>
                </div>
              </div>
            </div>

            {/* Show errors if any */}
            {(!lastResult.totalSuccess) && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  कुछ त्रुटियां आईं:
                  <ul className="list-disc list-inside mt-2">
                    {!lastResult.passwordResetTokens.success && (
                      <li>Password Reset Tokens: {lastResult.passwordResetTokens.error}</li>
                    )}
                    {!lastResult.dictionarySyncLogs.success && (
                      <li>Dictionary Sync Logs: {lastResult.dictionarySyncLogs.error}</li>
                    )}
                    {!lastResult.webhookLogs.success && (
                      <li>Webhook Logs: {lastResult.webhookLogs.error}</li>
                    )}
                    {!lastResult.analyticsCache.success && (
                      <li>Analytics Cache: {lastResult.analyticsCache.error}</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edge Functions Log Management</CardTitle>
          <CardDescription>
            मुख्य स्टोरेज समस्या Edge Functions logs से है (1.6GB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>महत्वपूर्ण:</strong> Edge Functions logs को साफ करने के लिए:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Supabase Dashboard में जाएं</li>
                <li>Functions → Logs सेक्शन खोलें</li>
                <li>Log retention settings चेक करें</li>
                <li>पुराने logs को manually clear करें</li>
                <li>Function में unnecessary console.log statements कम करें</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseCleanup;
