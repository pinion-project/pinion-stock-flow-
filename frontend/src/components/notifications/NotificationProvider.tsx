import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer from './ToastContainer';
import NotificationBanner from './NotificationBanner';

interface ToastData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface BannerData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  dismissible?: boolean;
  persistent?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationContextType {
  // Toast methods
  showToast: (toast: ToastData) => void;
  showSuccessToast: (title: string, message: string, duration?: number) => void;
  showErrorToast: (title: string, message: string, duration?: number) => void;
  showWarningToast: (title: string, message: string, duration?: number) => void;
  showInfoToast: (title: string, message: string, duration?: number) => void;
  
  // Banner methods
  showBanner: (banner: BannerData) => void;
  dismissBanner: (id: string) => void;
  clearAllBanners: () => void;
  
  // System notifications
  showSystemMaintenance: (message?: string) => void;
  showLowStockAlert: (productName: string, quantity: number) => void;
  showTransferComplete: (fromWarehouse: string, toWarehouse: string, productName: string, quantity: number) => void;
  showBackupComplete: () => void;
  showSystemUpdate: (version: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [banners, setBanners] = useState<BannerData[]>([]);

  // Toast methods
  const showToast = useCallback((toast: ToastData) => {
    // @ts-ignore
    if (window.showToast) {
      // @ts-ignore
      window.showToast(toast);
    }
  }, []);

  const showSuccessToast = useCallback((title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'success', duration });
  }, [showToast]);

  const showErrorToast = useCallback((title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'error', duration });
  }, [showToast]);

  const showWarningToast = useCallback((title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'warning', duration });
  }, [showToast]);

  const showInfoToast = useCallback((title: string, message: string, duration?: number) => {
    showToast({ title, message, type: 'info', duration });
  }, [showToast]);

  // Banner methods
  const showBanner = useCallback((banner: BannerData) => {
    setBanners(prev => {
      // Remove existing banner with same id if exists
      const filtered = prev.filter(b => b.id !== banner.id);
      return [banner, ...filtered];
    });
  }, []);

  const dismissBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  }, []);

  const clearAllBanners = useCallback(() => {
    setBanners([]);
  }, []);

  // System notification methods
  const showSystemMaintenance = useCallback((message?: string) => {
    showBanner({
      id: 'system-maintenance',
      title: 'صيانة النظام',
      message: message || 'النظام تحت الصيانة حالياً. قد تواجه بعض التأخير في الاستجابة.',
      type: 'warning',
      persistent: true,
      dismissible: false
    });
  }, [showBanner]);

  const showLowStockAlert = useCallback((productName: string, quantity: number) => {
    showBanner({
      id: `low-stock-${productName}`,
      title: 'تنبيه: مخزون منخفض',
      message: `المنتج "${productName}" وصل إلى الحد الأدنى للمخزون (${quantity} قطعة متبقية)`,
      type: 'warning',
      actionLabel: 'عرض المنتج',
      onAction: () => {
        // Navigate to product page
        console.log('Navigate to product:', productName);
      }
    });
    
    showWarningToast(
      'مخزون منخفض',
      `المنتج "${productName}" وصل إلى الحد الأدنى (${quantity} قطعة)`
    );
  }, [showBanner, showWarningToast]);

  const showTransferComplete = useCallback((fromWarehouse: string, toWarehouse: string, productName: string, quantity: number) => {
    showSuccessToast(
      'تم إكمال النقل',
      `تم نقل ${quantity} قطعة من "${productName}" من ${fromWarehouse} إلى ${toWarehouse}`
    );
  }, [showSuccessToast]);

  const showBackupComplete = useCallback(() => {
    showSuccessToast(
      'نسخة احتياطية مكتملة',
      'تم إنشاء النسخة الاحتياطية بنجاح'
    );
  }, [showSuccessToast]);

  const showSystemUpdate = useCallback((version: string) => {
    showBanner({
      id: 'system-update',
      title: 'تحديث النظام',
      message: `تم تحديث النظام إلى الإصدار ${version} بنجاح. قد تحتاج إلى إعادة تحميل الصفحة.`,
      type: 'info',
      actionLabel: 'إعادة تحميل',
      onAction: () => {
        window.location.reload();
      }
    });
    
    showInfoToast(
      'تحديث النظام',
      `تم التحديث إلى الإصدار ${version}`
    );
  }, [showBanner, showInfoToast]);

  const contextValue: NotificationContextType = {
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    showBanner,
    dismissBanner,
    clearAllBanners,
    showSystemMaintenance,
    showLowStockAlert,
    showTransferComplete,
    showBackupComplete,
    showSystemUpdate
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {/* System-wide banners */}
      <div className="fixed top-0 left-0 right-0 z-50 space-y-1">
        {banners.map(banner => (
          <NotificationBanner
            key={banner.id}
            {...banner}
            onDismiss={dismissBanner}
          />
        ))}
      </div>
      
      {/* Toast container */}
      <ToastContainer />
      
      {/* Main content */}
      <div className={banners.length > 0 ? `mt-${banners.length * 16}` : ''}>
        {children}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;