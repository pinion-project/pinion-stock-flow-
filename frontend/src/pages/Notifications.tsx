import React, { useState } from 'react';
import { Bell, Search, Filter, Trash2, Check, CheckCircle, AlertTriangle, Info, AlertCircle, Clock, User, Package, Settings as SettingsIcon, Calendar, Eye, Archive, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import notificationsApi, { NotificationItem } from '@/services/notificationsApiService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'inventory' | 'system' | 'user' | 'report';
  timestamp: Date;
  read: boolean;
  starred: boolean;
  archived: boolean;
}

const Notifications = () => {
  const { showSuccessToast, showInfoToast } = useNotifications();
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'inventory':
        return <Package className="h-4 w-4" />;
      case 'system':
        return <SettingsIcon className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'report':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: Notification['category']) => {
    switch (category) {
      case 'inventory':
        return 'المخزون';
      case 'system':
        return 'النظام';
      case 'user':
        return 'المستخدمين';
      case 'report':
        return 'التقارير';
      default:
        return 'عام';
    }
  };

  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'report':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  // Fetch notifications
  React.useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await notificationsApi.list();
        setNotifications(data);
      } catch (e: any) {
        setError(e?.message || 'فشل في تحميل الإشعارات');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    
    let matchesTab = true;
    switch (activeTab) {
      case 'unread':
        matchesTab = !notification.read;
        break;
      case 'starred':
        matchesTab = notification.starred;
        break;
      case 'archived':
        matchesTab = notification.archived;
        break;
      default:
        matchesTab = !notification.archived;
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesTab;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const starredCount = notifications.filter(n => n.starred && !n.archived).length;
  const archivedCount = notifications.filter(n => n.archived).length;

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (e: any) {
      showInfoToast('تعذر التحديث', e?.message || 'فشل وضع علامة مقروء');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      showSuccessToast('تم بنجاح', 'تم وضع علامة مقروء على جميع الإشعارات');
    } catch (e: any) {
      showInfoToast('تعذر التحديث', e?.message || 'فشل وضع علامة مقروء على الكل');
    }
  };

  const toggleStar = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, starred: !notification.starred }
          : notification
      )
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, archived: true }
          : notification
      )
    );
    showInfoToast('تم الأرشفة', 'تم نقل الإشعار إلى الأرشيف');
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      showSuccessToast('تم الحذف', 'تم حذف الإشعار نهائياً');
    } catch (e: any) {
      showInfoToast('تعذر الحذف', e?.message || 'فشل حذف الإشعار');
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'read':
        setNotifications(prev => 
          prev.map(notification => 
            selectedNotifications.includes(notification.id)
              ? { ...notification, read: true }
              : notification
          )
        );
        break;
      case 'archive':
        setNotifications(prev => 
          prev.map(notification => 
            selectedNotifications.includes(notification.id)
              ? { ...notification, archived: true }
              : notification
          )
        );
        break;
      case 'delete':
        setNotifications(prev => 
          prev.filter(notification => !selectedNotifications.includes(notification.id))
        );
        break;
    }
    setSelectedNotifications([]);
    showSuccessToast('تم بنجاح', `تم تنفيذ العملية على ${selectedNotifications.length} إشعار`);
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground">الإشعارات</h1>
                <p className="text-muted-foreground mt-1">
                  إدارة وعرض جميع الإشعارات والتنبيهات
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={markAllAsRead} disabled={isLoading}>
                  <Check className="w-4 h-4 ml-2" />
                  قراءة الكل
                </Button>
              </div>
            </div>

            {error && (
              <Card>
                <CardContent className="p-4 text-red-600 text-sm">{error}</CardContent>
              </Card>
            )}

            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">جارٍ تحميل الإشعارات...</CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      الكل
                      <Badge variant="secondary">{notifications.filter(n => !n.archived).length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      غير مقروء
                      {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      مميز
                      {starredCount > 0 && <Badge variant="secondary">{starredCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="flex items-center gap-2">
                      <Archive className="w-4 h-4" />
                      الأرشيف
                      {archivedCount > 0 && <Badge variant="outline">{archivedCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      الإعدادات
                    </TabsTrigger>
                  </TabsList>

                  {/* Bulk Actions */}
                  {selectedNotifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedNotifications.length} محدد
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('read')}>
                        <Check className="w-3 h-3 ml-1" />
                        قراءة
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                        <Archive className="w-3 h-3 ml-1" />
                        أرشفة
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                        <Trash2 className="w-3 h-3 ml-1" />
                        حذف
                      </Button>
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <TabsContent value="all" className="space-y-4">
                  <NotificationsList />
                </TabsContent>
                
                <TabsContent value="unread" className="space-y-4">
                  <NotificationsList />
                </TabsContent>
                
                <TabsContent value="starred" className="space-y-4">
                  <NotificationsList />
                </TabsContent>
                
                <TabsContent value="archived" className="space-y-4">
                  <NotificationsList />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                  <NotificationSettings onSave={(settings) => {
                    console.log('Notification settings saved:', settings);
                    showSuccessToast('تم الحفظ', 'تم حفظ إعدادات الإشعارات بنجاح');
                  }} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );

  function NotificationsList() {
    return (
      <>
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الإشعارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="info">معلومات</SelectItem>
                  <SelectItem value="success">نجاح</SelectItem>
                  <SelectItem value="warning">تحذير</SelectItem>
                  <SelectItem value="error">خطأ</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="inventory">المخزون</SelectItem>
                  <SelectItem value="system">النظام</SelectItem>
                  <SelectItem value="user">المستخدمين</SelectItem>
                  <SelectItem value="report">التقارير</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <div className="space-y-2">
          {filteredNotifications.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={selectedNotifications.length === filteredNotifications.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                تحديد الكل ({filteredNotifications.length})
              </span>
            </div>
          )}
          
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'unread' ? 'جميع الإشعارات مقروءة' : 
                   activeTab === 'starred' ? 'لا توجد إشعارات مميزة' :
                   activeTab === 'archived' ? 'لا توجد إشعارات مؤرشفة' :
                   'لا توجد إشعارات تطابق البحث'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={`transition-all hover:shadow-md cursor-pointer ${
                      !notification.read ? 'border-primary/50 bg-primary/5' : ''
                    } ${
                      selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedNotifications(prev => [...prev, notification.id]);
                            } else {
                              setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getCategoryColor(notification.category)}`}
                              >
                                <span className="flex items-center gap-1">
                                  {getCategoryIcon(notification.category)}
                                  {getCategoryLabel(notification.category)}
                                </span>
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(notification.id);
                                }}
                                className={`h-6 w-6 p-0 ${
                                  notification.starred ? 'text-yellow-500' : 'text-muted-foreground'
                                }`}
                              >
                                <Star className={`h-3 w-3 ${notification.starred ? 'fill-current' : ''}`} />
                              </Button>
                              
                              {!notification.archived && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    archiveNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-blue-600"
                                >
                                  <Archive className="h-3 w-3" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </>
    );
  }
};

export default Notifications;