
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Calendar, BarChart3, TrendingUp } from "lucide-react";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useWordCredits } from "@/hooks/useWordCredits";
import StatsCard from "./Dashboard/StatsCard";

const WordUsageStatsCards = () => {
  const { stats, loading } = useUsageStats();
  const { balance } = useWordCredits();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "उपलब्ध शब्द",
      value: balance.total_words_available,
      description: "कुल शेष शब्द",
      icon: Coins,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-gradient-to-r from-green-500 to-green-600",
      subtitle: balance.free_words > 0 ? `${balance.free_words} फ्री शब्द` : "खरीदे गये शब्द",
      trend: (balance.total_words_available > 1000 ? 'up' : balance.total_words_available > 100 ? 'neutral' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: balance.total_words_available > 1000 ? 'अच्छा' : balance.total_words_available > 100 ? 'ठीक' : 'कम',
      tooltip: "आपके खाते में उपलब्ध कुल शब्द क्रेडिट्स",
      onClick: () => window.open('/billing', '_blank')
    },
    {
      title: "आज उपयोग",
      value: stats.words_used_today,
      description: "आज प्रयोग किये गये शब्द",
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-600",
      subtitle: `${stats.corrections_today} सुधार आज`,
      trend: (stats.words_used_today > 0 ? 'up' : 'neutral') as 'up' | 'down' | 'neutral',
      trendValue: stats.words_used_today > 100 ? 'सक्रिय' : stats.words_used_today > 0 ? 'अच्छा' : 'प्रारंभ करें',
      tooltip: "आज तक आपने कितने शब्दों का उपयोग किया है",
      onClick: () => console.log('Show today details')
    },
    {
      title: "मासिक उपयोग",
      value: stats.words_used_this_month,
      description: "इस माह कुल उपयोग",
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      subtitle: `${stats.corrections_this_month} सुधार इस माह`,
      trend: (stats.words_used_this_month > 500 ? 'up' : stats.words_used_this_month > 100 ? 'neutral' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: stats.words_used_this_month > 500 ? 'बहुत अच्छा' : stats.words_used_this_month > 100 ? 'अच्छा' : 'और करें',
      tooltip: "इस माह आपका कुल शब्द उपयोग",
      onClick: () => console.log('Show monthly details')
    },
    {
      title: "कुल प्रसंस्कृत",
      value: stats.total_words_used,
      description: "सर्वकालिक कुल प्रयोग",
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "bg-gradient-to-r from-orange-500 to-orange-600",
      subtitle: `${stats.total_corrections} कुल सुधार`,
      trend: (stats.total_words_used > 1000 ? 'up' : 'neutral') as 'up' | 'down' | 'neutral',
      trendValue: stats.total_words_used > 1000 ? 'अनुभवी' : 'प्रगति में',
      tooltip: "अब तक आपने कुल कितने शब्दों को सुधारा है",
      onClick: () => console.log('Show all-time stats')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value.toLocaleString()}
          description={stat.description}
          icon={stat.icon}
          gradient={stat.gradient}
          bgGradient={stat.bgGradient}
          iconBg={stat.iconBg}
          subtitle={stat.subtitle}
          trend={stat.trend}
          trendValue={stat.trendValue}
          tooltip={stat.tooltip}
          onClick={stat.onClick}
          animatedValue={typeof stat.value === 'number' ? stat.value : undefined}
        />
      ))}
    </div>
  );
};

export default WordUsageStatsCards;
