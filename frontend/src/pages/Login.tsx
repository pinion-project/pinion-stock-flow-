import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Lock, User, Building2, Shield, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';

// مخطط التحقق من صحة البيانات
const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // الخطأ يتم التعامل معه في AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // حسابات تجريبية للعرض
  const demoAccounts = [
    {
      role: 'المدير العام',
      username: 'general_manager',
      password: 'admin123',
      icon: Shield,
      color: 'bg-primary'
    },
    {
      role: 'مدير المخزن الأول',
      username: 'warehouse_manager_1',
      password: 'warehouse1',
      icon: Building2,
      color: 'bg-accent'
    },
    {
      role: 'مدير المخزن الثاني',
      username: 'warehouse_manager_2',
      password: 'warehouse2',
      icon: Building2,
      color: 'bg-secondary'
    }
  ];

  const fillDemoAccount = (username: string, password: string) => {
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (usernameInput && passwordInput) {
      usernameInput.value = username;
      passwordInput.value = password;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* شعار النظام */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">نظام إدارة المخازن</h1>
          <p className="text-muted-foreground">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أدخل بيانات الدخول للوصول إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    className="pl-10"
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* الحسابات التجريبية */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-center">حسابات تجريبية</CardTitle>
            <CardDescription className="text-center">
              اضغط على أي حساب لملء البيانات تلقائياً
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => {
              const IconComponent = account.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => fillDemoAccount(account.username, account.password)}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-8 h-8 rounded-full ${account.color} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{account.role}</p>
                      <p className="text-xs text-muted-foreground">{account.username}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {account.password}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* روابط إضافية */}
        <div className="text-center space-y-2">
          <Separator />
          <div className="flex justify-center space-x-4 space-x-reverse text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              العودة للرئيسية
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">هل تحتاج مساعدة؟</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;