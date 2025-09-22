import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, Package } from "lucide-react";
import { User } from "@/types/auth";

interface ActivityItem {
  id: string;
  type: "in" | "out" | "transfer";
  product: string;
  quantity: number;
  warehouse: string;
  user: string;
  time: string;
  value: string;
}

const allActivities: ActivityItem[] = [
  {
    id: "1",
    type: "in",
    product: "لابتوب ديل",
    quantity: 50,
    warehouse: "مخزن القاهرة",
    user: "أحمد محمد",
    time: "منذ 5 دقائق",
    value: "250,000 ج.م"
  },
  {
    id: "2", 
    type: "out",
    product: "طابعة HP",
    quantity: 25,
    warehouse: "المخزن المسطح",
    user: "فاطمة علي",
    time: "منذ 15 دقيقة",
    value: "75,000 ج.م"
  },
  {
    id: "3",
    type: "transfer",
    product: "شاشات سامسونج",
    quantity: 30,
    warehouse: "القاهرة ← الجيزة",
    user: "محمد حسن",
    time: "منذ 30 دقيقة",
    value: "180,000 ج.م"
  },
  {
    id: "4",
    type: "in",
    product: "كيبورد لوجيتك",
    quantity: 100,
    warehouse: "مخزن ستيل",
    user: "سارة أحمد",
    time: "منذ ساعة",
    value: "50,000 ج.م"
  },
  {
    id: "5",
    type: "out",
    product: "ماوس لاسلكي",
    quantity: 75,
    warehouse: "مخزن الإسكندرية",
    user: "خالد عبدالله",
    time: "منذ ساعتين",
    value: "37,500 ج.م"
  },
  {
    id: "6",
    type: "in",
    product: "هارد ديسك خارجي",
    quantity: 40,
    warehouse: "مخزن أسوان",
    user: "نورا حسام",
    time: "منذ 3 ساعات",
    value: "120,000 ج.م"
  }
];

interface RecentActivityProps {
  user?: User;
}

const getAccessibleActivities = (user?: User): ActivityItem[] => {
  if (!user) return allActivities;
  
  const isGeneralManager = user.role === 'GENERAL_MANAGER';
  const isPurchasingManager = user.role === 'PURCHASING_MANAGER';
  
  if (isGeneralManager || isPurchasingManager) {
    return allActivities;
  }
  
  // For warehouse managers, show only activities from their assigned warehouse
  const warehouseMapping: { [key: string]: string } = {
    'warehouse_manager_1': 'مخزن القاهرة',
    'warehouse_manager_2': 'المخزن المسطح', 
    'warehouse_manager_3': 'مخزن الجيزة',
    'warehouse_manager_4': 'مخزن ستيل',
    'warehouse_manager_5': 'مخزن الإسكندرية',
    'warehouse_manager_6': 'مخزن أسوان'
  };
  
  const userWarehouse = warehouseMapping[user.username];
  if (!userWarehouse) return [];
  
  return allActivities.filter(activity => 
    activity.warehouse === userWarehouse || 
    activity.warehouse.includes(userWarehouse)
  );
};

const RecentActivity: React.FC<RecentActivityProps> = ({ user }) => {
  const activities = getAccessibleActivities(user);
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "in":
        return <ArrowDownCircle className="h-4 w-4 text-success" />;
      case "out":
        return <ArrowUpCircle className="h-4 w-4 text-destructive" />;
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-accent" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "in":
        return <Badge variant="outline" className="text-success border-success/20 bg-success/10">دخول</Badge>;
      case "out":
        return <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10">خروج</Badge>;
      case "transfer":
        return <Badge variant="outline" className="text-accent border-accent/20 bg-accent/10">نقل</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-primary" />
          <span>النشاط الأخير</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أنشطة حديثة</p>
            </div>
          ) : (
            activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.product}
                  </p>
                  {getActivityBadge(activity.type)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground space-x-4">
                  <span>الكمية: {activity.quantity.toLocaleString('ar')}</span>
                  <span>•</span>
                  <span>{activity.warehouse}</span>
                  <span>•</span>
                  <span>{activity.user}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  <span className="text-sm font-semibold text-foreground">{activity.value}</span>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;