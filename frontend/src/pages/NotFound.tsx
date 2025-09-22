import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-primary mb-2">404</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">الصفحة غير موجودة</h1>
            <p className="text-muted-foreground">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <Home className="w-4 h-4 ml-2" />
                العودة للوحة التحكم
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/products">
                <Search className="w-4 h-4 ml-2" />
                البحث في المنتجات
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              هل تحتاج مساعدة؟ 
              <Button variant="link" className="p-0 h-auto font-normal text-sm mr-1">
                تواصل مع الدعم الفني
                <ArrowRight className="w-3 h-3 mr-1" />
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;