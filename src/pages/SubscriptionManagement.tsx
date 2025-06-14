
import React from 'react';
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import Layout from "@/components/Layout";
import SubscriptionManagement from "@/components/Subscription/SubscriptionManagement";
import SubscriptionChargeHistory from "@/components/Subscription/SubscriptionChargeHistory";

const SubscriptionManagementPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (!authLoading && !user) {
    navigate("/login");
    return null;
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link to="/billing">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  बिलिंग पेज
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  सब्स्क्रिप्शन प्रबंधन
                </h1>
                <p className="text-gray-600">
                  अपने AutoPay सब्स्क्रिप्शन को प्रबंधित करें और भुगतान इतिहास देखें
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Subscription Management */}
            <SubscriptionManagement />
            
            {/* Charge History */}
            <SubscriptionChargeHistory />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionManagementPage;
