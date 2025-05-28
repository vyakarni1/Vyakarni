
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, CalendarDays, CalendarRange, TrendingUp } from "lucide-react";
import { useUsageStats } from "@/hooks/useUsageStats";

const UsageStatsCards = () => {
  const { stats, loading } = useUsageStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">लोड हो रहा है...</CardTitle>
              <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
              <div className="mt-2 h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "कुल सुधार",
      value: stats.total_corrections,
      description: "सभी समय में",
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500"
    },
    {
      title: "आज के सुधार",
      value: stats.corrections_today,
      description: "आज तक",
      icon: Calendar,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-green-500"
    },
    {
      title: "इस सप्ताह",
      value: stats.corrections_this_week,
      description: "सप्ताह में",
      icon: CalendarDays,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500"
    },
    {
      title: "इस महीने",
      value: stats.corrections_this_month,
      description: "महीने में",
      icon: CalendarRange,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
              <div className={`${stat.iconBg} p-2 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                {stat.value > 0 && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium">{stat.description}</p>
              {stat.value > 0 && (
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-white/50 rounded-full h-1.5">
                    <div 
                      className={`bg-gradient-to-r ${stat.gradient} h-1.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min((stat.value / Math.max(stats.total_corrections, 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UsageStatsCards;
