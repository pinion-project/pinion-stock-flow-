import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, TrendingUp, ArrowRight, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WarehouseCardProps {
  id: number;
  name: string;
  location: string;
  totalProducts: number;
  capacity: number;
  status: "active" | "maintenance" | "full";
  revenue: string;
  trend: number;
}

const WarehouseCard = ({ id, name, location, totalProducts, capacity, status, revenue, trend }: WarehouseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const utilizationPercentage = (totalProducts / capacity) * 100;

  const statusConfig = {
    active: { 
      color: "bg-success", 
      label: "نشط", 
      textColor: "text-success",
      variant: "default" as const,
      gradient: "bg-gradient-to-r from-success/10 to-success/5"
    },
    maintenance: { 
      color: "bg-warning", 
      label: "صيانة", 
      textColor: "text-warning",
      variant: "secondary" as const,
      gradient: "bg-gradient-to-r from-warning/10 to-warning/5"
    },
    full: { 
      color: "bg-destructive", 
      label: "ممتلئ", 
      textColor: "text-destructive",
      variant: "destructive" as const,
      gradient: "bg-gradient-to-r from-destructive/10 to-destructive/5"
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <Card 
      className="overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 group hover:scale-[1.02] card-hover cursor-pointer animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className={`${currentStatus.gradient} pb-4 transition-all duration-300 ${
        isHovered ? 'bg-gradient-to-r from-primary/10 to-primary/5' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-primary/10 transition-all duration-300 ${
              isHovered ? 'bg-primary/20 scale-110' : ''
            }`}>
              <Building2 className={`h-5 w-5 text-primary transition-all duration-300 ${
                isHovered ? 'animate-bounce-gentle' : ''
              }`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                {name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${
                  isHovered ? 'text-primary animate-bounce-gentle' : ''
                }`} />
                <span className="text-sm text-muted-foreground">{location}</span>
              </div>
            </div>
          </div>
          <Badge 
            variant={currentStatus.variant} 
            className={`${currentStatus.textColor} transition-all duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${currentStatus.color} ml-2 ${
              isHovered ? 'animate-pulse' : ''
            }`} />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Products and Capacity */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg transition-all duration-300 hover:bg-muted/50">
            <div className="flex items-center space-x-2">
              <Package className={`h-5 w-5 text-primary transition-all duration-300 ${
                isHovered ? 'animate-bounce-gentle' : ''
              }`} />
              <span className="text-sm font-medium">المنتجات</span>
            </div>
            <span className="text-lg font-bold transition-all duration-300 group-hover:text-primary">
              {totalProducts.toLocaleString('ar')}
            </span>
          </div>

          {/* Capacity Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">معدل الاستخدام</span>
              <span className="font-medium">{utilizationPercentage.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={utilizationPercentage} 
                className={`h-3 transition-all duration-500 ${
                  isHovered ? 'scale-y-150' : ''
                }`}
              />
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full" />
              )}
            </div>
            <div className="text-xs text-muted-foreground text-left">
              {capacity.toLocaleString('ar')} / السعة القصوى
            </div>
          </div>

          {/* Revenue */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-4 w-4 text-accent transition-all duration-300 ${
                isHovered ? 'animate-bounce-gentle' : ''
              }`} />
              <span className="text-sm text-muted-foreground">الإيرادات</span>
            </div>
            <div className="text-left">
              <span className="text-lg font-bold text-foreground transition-all duration-300 group-hover:text-primary">
                {revenue}
              </span>
              <span className={`text-xs text-success mr-2 transition-all duration-300 ${
                isHovered ? 'scale-110' : ''
              }`}>
                +{trend}%
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover-scale"
            onClick={() => navigate(`/warehouse/${id}`)}
          >
            عرض التفاصيل
            <ArrowRight className={`w-4 h-4 mr-2 transition-all duration-300 ${
              isHovered ? 'animate-bounce-gentle' : ''
            }`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseCard;