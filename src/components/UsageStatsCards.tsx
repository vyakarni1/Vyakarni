
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Clock, BarChart3 } from "lucide-react";

interface UsageStatsCardsProps {
  stats: {
    total_corrections: number;
    corrections_today: number;
    corrections_this_week: number;
    corrections_this_month: number;
  };
  loading: boolean;
}

const UsageStatsCards = ({ stats, loading }: UsageStatsCardsProps) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "कुल सुधार",
      value: stats.total_corrections,
      description: "अब तक",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "आज के सुधार",
      value: stats.corrections_today,
      description: "आज",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "सप्ताह के सुधार",
      value: stats.corrections_this_week,
      description: "इस सप्ताह",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "महीने के सुधार",
      value: stats.corrections_this_month,
      description: "इस महीने",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UsageStatsCards;
