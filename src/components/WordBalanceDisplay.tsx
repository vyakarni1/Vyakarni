
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWordCredits } from "@/hooks/useWordCredits";
import { Coins, Clock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const WordBalanceDisplay = () => {
  const { balance, loading } = useWordCredits();

  if (loading) {
    return (
      <Card className="w-full mb-6">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isLowBalance = balance.total_words_available < 100;

  return (
    <Card className={`w-full mb-6 ${isLowBalance ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isLowBalance ? 'bg-orange-100' : 'bg-green-100'}`}>
              <Coins className={`h-5 w-5 ${isLowBalance ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">शब्द बैलेंस</h3>
                <Badge variant={isLowBalance ? "destructive" : "secondary"}>
                  {balance.total_words_available} शब्द
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {balance.free_words > 0 && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>फ्री: {balance.free_words}</span>
                  </span>
                )}
                {balance.purchased_words > 0 && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>खरीदा: {balance.purchased_words}</span>
                  </span>
                )}
                {balance.next_expiry_date && (
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>समाप्ति: {formatExpiryDate(balance.next_expiry_date)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {isLowBalance && (
            <Link to="/pricing">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                शब्द खरीदें
              </Button>
            </Link>
          )}
        </div>

        {isLowBalance && (
          <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              ⚠️ आपके शब्द कम हो रहे हैं! अधिक शब्द खरीदने के लिए 
              <Link to="/pricing" className="font-semibold underline ml-1">
                यहाँ क्लिक करें
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordBalanceDisplay;
