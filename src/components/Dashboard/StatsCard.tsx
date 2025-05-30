
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  bgGradient: string;
  iconBg: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  tooltip?: string;
  onClick?: () => void;
  animatedValue?: number;
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: IconComponent, 
  gradient, 
  bgGradient, 
  iconBg, 
  subtitle,
  trend,
  trendValue,
  tooltip,
  onClick,
  animatedValue
}: StatsCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animatedValue !== undefined) {
      setIsAnimating(true);
      const duration = 1000;
      const steps = 50;
      const increment = animatedValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= animatedValue) {
          current = animatedValue;
          setIsAnimating(false);
          clearInterval(timer);
        }
        setDisplayValue(Math.floor(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [animatedValue]);

  const cardContent = (
    <Card 
      className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br ${bgGradient} relative overflow-hidden cursor-pointer transform hover:scale-105`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {title}
          {tooltip && (
            <Info className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </CardTitle>
        <div className={`${iconBg} p-2.5 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <IconComponent className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline space-x-2 mb-2">
          <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {animatedValue !== undefined ? displayValue.toLocaleString() : value}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-green-100 text-green-700' : 
              trend === 'down' ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
               trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
              {trendValue}
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-600 font-medium mb-1">{description}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
        
        {/* Enhanced Progress Bar */}
        <div className="mt-3 flex items-center space-x-2">
          <div className="flex-1 bg-white/40 rounded-full h-2 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
              style={{ 
                width: `${Math.min(
                  (parseInt(String(value).replace(/,/g, '')) / Math.max(
                    parseInt(String(animatedValue || value).replace(/,/g, '')) || 1, 
                    1000
                  )) * 100, 
                  100
                )}%` 
              }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          {trend && (
            <Badge variant="outline" className={`text-xs px-2 py-0.5 ${
              trend === 'up' ? 'border-green-200 text-green-600' : 
              trend === 'down' ? 'border-red-200 text-red-600' : 
              'border-gray-200 text-gray-600'
            }`}>
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            </Badge>
          )}
        </div>
        
        {/* Activity Indicator */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              isAnimating ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
            } transition-colors duration-300`}></div>
            <span className="text-xs text-gray-500">
              {isAnimating ? 'अपडेटिंग...' : 'अपडेटेड'}
            </span>
          </div>
          {onClick && (
            <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              विवरण के लिए क्लिक करें →
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};

export default StatsCard;
