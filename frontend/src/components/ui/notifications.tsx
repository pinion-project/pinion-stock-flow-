import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, TrendingUp, Users, Package } from 'lucide-react';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  isRead?: boolean;
  onClick?: () => void;
}

const NotificationCard: React.FC<NotificationProps> = ({
  title,
  message,
  type,
  timestamp,
  isRead = false,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      iconColor: 'text-success',
      badge: 'نجح'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      iconColor: 'text-warning',
      badge: 'تحذير'
    },
    info: {
      icon: TrendingUp,
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      iconColor: 'text-primary',
      badge: 'معلومة'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      iconColor: 'text-destructive',
      badge: 'خطأ'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-medium border-l-4',
        config.borderColor,
        config.bgColor,
        isRead ? 'opacity-60' : 'opacity-100',
        isHovered && 'scale-[1.02] shadow-large'
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={cn(
            'p-2 rounded-full transition-all duration-300',
            config.bgColor,
            isHovered && 'scale-110'
          )}>
            <Icon className={cn(
              'h-5 w-5',
              config.iconColor,
              isHovered && 'animate-bounce-gentle'
            )} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                {title}
              </h4>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={config.iconColor}>
                  {config.badge}
                </Badge>
                {!isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timestamp}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickStatsProps {
  className?: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ className }) => {
  const stats = [
    {
      icon: Package,
      label: 'منتجات جديدة',
      value: '15',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      icon: Users,
      label: 'مستخدمين نشطين',
      value: '8',
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      icon: TrendingUp,
      label: 'نمو المبيعات',
      value: '+12%',
      color: 'text-accent',
      bg: 'bg-accent/10'
    }
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="group hover:shadow-medium transition-all duration-300 cursor-pointer hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={cn('p-2 rounded-lg transition-all duration-300 group-hover:scale-110', stat.bg)}>
                  <Icon className={cn('h-5 w-5 group-hover:animate-bounce-gentle', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={cn('text-xl font-bold transition-colors duration-300', stat.color)}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export { NotificationCard, QuickStats };