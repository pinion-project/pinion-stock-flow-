import { Building2, User, Settings, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Header = () => {
  const { user, logout, hasRole } = useAuth();

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return 'المدير العام';
      case UserRole.WAREHOUSE_MANAGER:
        return 'مدير المخزن';
      case UserRole.PURCHASING_MANAGER:
        return 'مدير المشتريات';
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.GENERAL_MANAGER:
        return 'default';
      case UserRole.WAREHOUSE_MANAGER:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-gradient-primary shadow-soft border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Pinion</h1>
              <p className="text-xs text-white/80 hidden sm:block">نظام إدارة المخازن</p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            <NotificationCenter />
            
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/20 h-auto p-1.5 sm:p-2">
                    <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarFallback className="bg-white/20 text-white text-xs sm:text-sm">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-white truncate max-w-32 lg:max-w-none">{user.fullName}</p>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge 
                            variant={getRoleBadgeVariant(user.role)} 
                            className="text-xs bg-white/20 text-white border-white/30"
                          >
                            {getRoleDisplayName(user.role)}
                          </Badge>
                          {hasRole(UserRole.GENERAL_MANAGER) && (
                            <Shield className="h-3 w-3 text-white/80" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-right">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs w-fit">
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-right">
                    <User className="ml-2 h-4 w-4" />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-right">
                    <Settings className="ml-2 h-4 w-4" />
                    الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-right text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;