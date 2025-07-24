
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWordCredits } from "@/hooks/useWordCredits";
import { Coins, ShoppingBag, AlertTriangle } from "lucide-react";
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
                {balance.has_active_subscription && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    सक्रिय प्लान
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {balance.subscription_words > 0 && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>प्लान: {balance.subscription_words}</span>
                  </span>
                )}
                {balance.free_words > 0 && (
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>फ्री: {balance.free_words}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isLowBalance && (
              <Link to="/pricing">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  अधिक शब्द खरीदें
                </Button>
              </Link>
            )}
          </div>
        </div>

        {isLowBalance && (
          <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-800">
                आपके शब्द कम हो रहे हैं! अधिक शब्द खरीदने के लिये 
                <Link to="/pricing" className="font-semibold underline ml-1">
                  यहाँ क्लिक करें
                </Link>
              </p>
            </div>
          </div>
        )}

        {!balance.has_active_subscription && balance.total_words_available > 100 && (
          <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                प्रीमियम प्लान खरीदें और अधिक फीचर्स पायें! 
                <Link to="/pricing" className="font-semibold underline ml-1">
                  प्लान देखें
                </Link>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordBalanceDisplay;
