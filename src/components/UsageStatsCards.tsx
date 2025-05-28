
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useUsageStats } from "@/hooks/useUsageStats";

const UsageStatsCards = () => {
  const { stats, loading } = useUsageStats();

  const statsData = [
    {
      title: "कुल सुधार",
      value: stats.total_corrections,
      icon: FileText,
      description: "सभी समय के सुधार"
    },
    {
      title: "आज के सुधार",
      value: stats.corrections_today,
      icon: Calendar,
      description: "आज किए गए सुधार"
    },
    {
      title: "इस सप्ताह",
      value: stats.corrections_this_week,
      icon: TrendingUp,
      description: "सप्ताह के सुधार"
    },
    {
      title: "इस महीने",
      value: stats.corrections_this_month,
      icon: BarChart3,
      description: "महीने के सुधार"
    }
  ];

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">लोड हो रहा है...</CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">--</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UsageStatsCards;
