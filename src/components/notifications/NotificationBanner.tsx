import React, { useState } from 'react';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotificationBannerProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  dismissible?: boolean;
  persistent?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: (id: string) => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  id,
  title,
  message,
  type,
  dismissible = true,
  persistent = false,
  actionLabel,
  onAction,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    if (!persistent) {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss?.(id);
      }, 300);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getBannerStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'announcement':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`
      w-full transition-all duration-300 ease-in-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
    `}>
      <Alert className={`${getBannerStyles()} border-l-4`} dir="rtl">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <AlertDescription className="text-sm">
                {message}
              </AlertDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {actionLabel && onAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAction}
                className="bg-white/80 hover:bg-white"
              >
                {actionLabel}
              </Button>
            )}
            
            {dismissible && !persistent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 hover:bg-white/50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default NotificationBanner;