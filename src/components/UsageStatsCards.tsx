
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { useUsageStats } from "@/hooks/useUsageStats";

const UsageStatsCards = () => {
  const { stats, loading } = useUsageStats();

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">लोड हो रहा है...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse">---</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">कुल सुधार</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_corrections}</div>
          <p className="text-xs text-muted-foreground">सभी समय</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">आज के सुधार</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.corrections_today}</div>
          <p className="text-xs text-muted-foreground">आज तक</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">इस सप्ताह</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.corrections_this_week}</div>
          <p className="text-xs text-muted-foreground">सप्ताह में</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">इस महीने</CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.corrections_this_month}</div>
          <p className="text-xs text-muted-foreground">महीने में</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageStatsCards;
