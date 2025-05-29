
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import ModernStatsCards from '@/components/Admin/Analytics/ModernStatsCards';
import { 
  UserGrowthChart, 
  SubscriptionDistributionChart, 
  RevenueChart, 
  UsageAnalyticsChart 
} from '@/components/Admin/Analytics/AnalyticsCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');
  const { refetch, loading } = useAdminAnalytics();

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              विस्तृत एनालिटिक्स
            </h1>
            <p className="text-gray-600 mt-1">
              व्यापक डेटा विश्लेषण और प्रदर्शन मेट्रिक्स
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">पिछले 7 दिन</SelectItem>
                <SelectItem value="30">पिछले 30 दिन</SelectItem>
                <SelectItem value="90">पिछले 90 दिन</SelectItem>
                <SelectItem value="365">पिछला साल</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={refetch}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश</span>
            </Button>
            
            <Button onClick={handleExport} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>एक्सपोर्ट</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <ModernStatsCards />

        {/* Performance Insights */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                प्रदर्शन अंतर्दृष्टि
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">उपयोगकर्ता वृद्धि</h4>
                <p className="text-sm text-blue-600">
                  पिछले महीने की तुलना में 23% वृद्धि। नए उपयोगकर्ता अधिग्रहण मजबूत है।
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">आय वृद्धि</h4>
                <p className="text-sm text-green-600">
                  प्रीमियम सब्सक्रिप्शन में 18% वृद्धि। औसत आय प्रति उपयोगकर्ता बढ़ी है।
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">उपयोग दर</h4>
                <p className="text-sm text-purple-600">
                  दैनिक सक्रिय उपयोगकर्ता 15% बढ़े हैं। उपयोगकर्ता सहभागिता में सुधार।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserGrowthChart />
          <SubscriptionDistributionChart />
          <RevenueChart />
          <UsageAnalyticsChart />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">शीर्ष मेट्रिक्स</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">औसत सत्र अवधि</span>
                  <span className="font-semibold">8m 32s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">बाउंस दर</span>
                  <span className="font-semibold text-green-600">23.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">रूपांतरण दर</span>
                  <span className="font-semibold text-blue-600">4.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">उपयोगकर्ता संतुष्टि</span>
                  <span className="font-semibold text-purple-600">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">भौगोलिक वितरण</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">भारत</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-blue-200 rounded-full">
                      <div className="w-4/5 h-full bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">संयुक्त राज्य</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-green-200 rounded-full">
                      <div className="w-1/4 h-full bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold">12%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">यूनाइटेड किंगडम</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-purple-200 rounded-full">
                      <div className="w-1/5 h-full bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold">6%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">अन्य</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/12 h-full bg-gray-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold">4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">त्वरित कार्य</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  कस्टम रिपोर्ट बनाएं
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  डेटा एक्सपोर्ट करें
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  रिपोर्ट शेड्यूल करें
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  ट्रेंड विश्लेषण
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default Analytics;
