
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, Home, Settings } from "lucide-react";
import { toast } from "sonner";
import PerformanceDashboard from '@/components/Performance/PerformanceDashboard';
import SystemHealthIndicator from '@/components/Error/SystemHealthIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PerformanceAdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("सफलतापूर्वक लॉग आउट हो गए!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी - Performance Admin
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  डैशबोर्ड
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  एडमिन
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                लॉग आउट
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* System Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle>सिस्टम स्वास्थ्य अवलोकन</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemHealthIndicator />
            </CardContent>
          </Card>

          {/* Performance Dashboard */}
          <PerformanceDashboard />
        </div>
      </div>
    </div>
  );
};

export default PerformanceAdminPage;
