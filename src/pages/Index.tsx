import { ArrowLeft, BarChart3, Package, Building2, TrendingUp, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const features = [
    {
      icon: Package,
      title: "إدارة المنتجات",
      description: "تتبع شامل لجميع المنتجات مع إدارة المخزون الذكية",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: Building2,
      title: "إدارة المخازن",
      description: "نظرة شاملة على جميع المخازن وحالتها ومستوى الإشغال",
      color: "text-accent", 
      bg: "bg-accent/10"
    },
    {
      icon: TrendingUp,
      title: "التقارير والتحليلات",
      description: "تقارير مفصلة وتحليلات متقدمة لاتخاذ قرارات مدروسة",
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      icon: BarChart3,
      title: "لوحة التحكم",
      description: "رؤية شاملة للمؤشرات الرئيسية وحالة النظام",
      color: "text-warning",
      bg: "bg-warning/10"
    },
    {
      icon: Users,
      title: "إدارة المستخدمين", 
      description: "نظام متكامل لإدارة المستخدمين والصلاحيات",
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      icon: Shield,
      title: "الأمان والحماية",
      description: "نظام أمان متقدم لحماية البيانات والمعلومات",
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Pinion</h1>
                <p className="text-sm text-muted-foreground">نظام إدارة المخازن</p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 ml-2" />
                دخول النظام
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-primary/5">
              نظام إدارة المخازن المتطور
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                إدارة ذكية
              </span>
              <br />
              لمخازنك ومنتجاتك
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نظام Pinion يوفر لك حلولاً شاملة لإدارة المخازن والمنتجات بكفاءة عالية، 
              مع تقارير تفصيلية وتحليلات متقدمة لاتخاذ قرارات مدروسة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover-scale group">
                  <ArrowLeft className="w-5 h-5 ml-2 group-hover:animate-bounce-gentle" />
                  ابدأ الآن
                </Button>
              </Link>
              <Link to="/analytics">
                <Button size="lg" variant="outline" className="hover:bg-accent/10 hover-scale group">
                  <BarChart3 className="w-5 h-5 ml-2 group-hover:animate-bounce-gentle" />
                  عرض التقارير
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              مميزات شاملة لإدارة فعالة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اكتشف الأدوات والمميزات التي تجعل إدارة مخازنك أسهل وأكثر كفاءة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className={`shadow-soft hover:shadow-large transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover-lift group cursor-pointer stagger-item`}>
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${feature.color} group-hover:animate-bounce-gentle`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-hero rounded-2xl p-12 text-white text-center shadow-large">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              أرقام تتحدث عن نجاحنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-lg opacity-90">منتج مُدار بكفاءة</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">مخزن نشط</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-lg opacity-90">دقة في التتبع</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Pinion</span>
          </div>
          <p className="text-muted-foreground mb-6">
            نظام إدارة المخازن المتطور - حلول ذكية لإدارة فعالة
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">لوحة التحكم</Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" size="sm">المنتجات</Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" size="sm">التقارير</Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm">الإعدادات</Button>
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t text-sm text-muted-foreground">
            © 2024 Pinion. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
