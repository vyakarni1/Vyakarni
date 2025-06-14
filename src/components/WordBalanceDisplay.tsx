
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertTriangle, Loader2 } from "lucide-react";
import { useWordCredits } from "@/hooks/useWordCredits";
import { Link } from "react-router-dom";

const WordBalanceDisplay = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('[WordBalanceDisplay] Component mounting');

  const { balance, loading } = useWordCredits();
  
  useEffect(() => {
    try {
      console.log('[WordBalanceDisplay] Balance updated:', balance);
      console.log('[WordBalanceDisplay] Loading state:', loading);
      setIsLoading(loading);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('[WordBalanceDisplay] Error in useEffect:', err);
      setError(err instanceof Error ? err.message : 'Unknown error in WordBalanceDisplay');
    }
  }, [balance, loading]);

  if (error) {
    console.log('[WordBalanceDisplay] Showing error state:', error);
    return (
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">शब्द बैलेंस लोड नहीं हो सका: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    console.log('[WordBalanceDisplay] Showing loading state');
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">शब्द बैलेंस लोड हो रहा है...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('[WordBalanceDisplay] Rendering balance display with:', balance);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('hi-IN');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>शब्द बैलेंस</span>
          </div>
          <Badge variant="outline" className="bg-white">
            कुल: {balance.total_words_available || 0} शब्द
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-gray-600">मुफ्त शब्द</div>
            <div className="font-semibold text-green-600">{balance.free_words || 0}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-gray-600">खरीदे गए शब्द</div>
            <div className="font-semibold text-blue-600">{balance.purchased_words || 0}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-gray-600">सब्स्क्रिप्शन शब्द</div>
            <div className="font-semibold text-purple-600">{balance.subscription_words || 0}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-gray-600">टॉप-अप शब्द</div>
            <div className="font-semibold text-orange-600">{balance.topup_words || 0}</div>
          </div>
        </div>

        {balance.next_expiry_date && (
          <div className="text-xs text-gray-600 bg-white p-2 rounded border">
            अगली समाप्ति: {formatDate(balance.next_expiry_date)}
          </div>
        )}

        {balance.total_words_available < 100 && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="text-yellow-800 text-sm font-medium mb-2">
              शब्द सीमा कम है!
            </div>
            <Link to="/pricing">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                और शब्द खरीदें
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordBalanceDisplay;
