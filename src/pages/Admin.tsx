
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, CreditCard, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [emailStats, setEmailStats] = useState({
    sent: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchEmailStats = async () => {
      try {
        // Get sent emails count
        const { count: sentCount } = await supabase
          .from('email_logs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'sent');

        // Get pending users count
        const { count: pendingCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .is('welcome_email_sent_at', null);

        setEmailStats({
          sent: sentCount || 0,
          pending: pendingCount || 0
        });
      } catch (error) {
        console.error('Error fetching email stats:', error);
      }
    };

    fetchEmailStats();
  }, []);

  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: "कुल उपयोगकर्ता",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "मासिक आय",
      value: "₹45,678",
      change: "+8%",
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "व्याकरण जाँच",
      value: "8,456",
      change: "+15%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "स्वागत ईमेल भेजे गए",
      value: emailStats.sent.toString(),
      change: `${emailStats.pending} प्रतीक्षित`,
      icon: Mail,
      color: "text-orange-600"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">डैशबोर्ड</h1>
          <p className="text-gray-600 mt-2">व्याकरणी एडमिन पैनल में आपका स्वागत है</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} पिछले माह से
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>हाल की गतिविधि</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">नया उपयोगकर्ता पंजीकृत</span>
                  <span className="text-xs text-gray-400 ml-auto">2 मिनट पहले</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">व्याकरण जाँच पूर्ण</span>
                  <span className="text-xs text-gray-400 ml-auto">5 मिनट पहले</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">नया संपर्क संदेश</span>
                  <span className="text-xs text-gray-400 ml-auto">10 मिनट पहले</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>सिस्टम स्थिति</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API स्थिति</span>
                  <span className="text-sm text-green-600 font-medium">चालू</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">डेटाबेस</span>
                  <span className="text-sm text-green-600 font-medium">चालू</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">भंडारण</span>
                  <span className="text-sm text-green-600 font-medium">चालू</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">प्रदर्शन</span>
                  <span className="text-sm text-yellow-600 font-medium">औसत</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Management Quick Action */}
        {emailStats.pending > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                स्वागत ईमेल प्रबंधन
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700">
                    {emailStats.pending} उपयोगकर्ताओं को अभी भी स्वागत ईमेल नहीं मिला है
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    बल्क ईमेल भेजने के लिए ईमेल प्रबंधन पर जाएं
                  </p>
                </div>
                <Link to="/admin/emails">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    ईमेल प्रबंधन
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Admin;
