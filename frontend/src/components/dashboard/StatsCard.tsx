import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  gradient?: string;
}

const StatsCard = ({ title, value, change, changeType, icon: Icon, gradient = "bg-gradient-primary" }: StatsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const changeColors = {
    increase: "text-success",
    decrease: "text-destructive", 
    neutral: "text-muted-foreground"
  };

  const changeIcons = {
    increase: "↗",
    decrease: "↘",
    neutral: "→"
  };

  return (
    <Card 
      className="overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 group hover:scale-[1.02] card-hover cursor-pointer animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1 transition-colors duration-300">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-primary">
              {value}
            </p>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "text-sm font-medium flex items-center gap-1 transition-all duration-300",
                changeColors[changeType],
                isHovered && "scale-105"
              )}>
                <span className={`text-xs ${isHovered ? 'animate-bounce-gentle' : ''}`}>
                  {changeIcons[changeType]}
                </span>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300 relative overflow-hidden",
            gradient,
            "group-hover:scale-110 group-hover:shadow-glow",
            isHovered && "animate-pulse-soft"
          )}>
            <Icon className={cn(
              "h-6 w-6 text-white relative z-10 transition-all duration-300",
              isHovered && "animate-bounce-gentle"
            )} />
            {isHovered && (
              <div className="absolute inset-0 bg-white/10 animate-shimmer" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;