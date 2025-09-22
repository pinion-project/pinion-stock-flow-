import React, { useState, useCallback } from 'react';
import Toast, { ToastProps } from './Toast';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContainerProps {
  maxToasts?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ maxToasts = 5 }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    
    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Keep only the latest maxToasts
      return updated.slice(0, maxToasts);
    });
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Expose methods globally for easy access
  React.useEffect(() => {
    // @ts-ignore
    window.showToast = addToast;
    // @ts-ignore
    window.clearToasts = clearAllToasts;
    
    return () => {
      // @ts-ignore
      delete window.showToast;
      // @ts-ignore
      delete window.clearToasts;
    };
  }, [addToast, clearAllToasts]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          id={index.toString()}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

// Helper functions for easy toast creation
export const showSuccessToast = (title: string, message: string, duration?: number) => {
  // @ts-ignore
  if (window.showToast) {
    // @ts-ignore
    window.showToast({ title, message, type: 'success', duration });
  }
};

export const showErrorToast = (title: string, message: string, duration?: number) => {
  // @ts-ignore
  if (window.showToast) {
    // @ts-ignore
    window.showToast({ title, message, type: 'error', duration });
  }
};

export const showWarningToast = (title: string, message: string, duration?: number) => {
  // @ts-ignore
  if (window.showToast) {
    // @ts-ignore
    window.showToast({ title, message, type: 'warning', duration });
  }
};

export const showInfoToast = (title: string, message: string, duration?: number) => {
  // @ts-ignore
  if (window.showToast) {
    // @ts-ignore
    window.showToast({ title, message, type: 'info', duration });
  }
};

export const clearAllToasts = () => {
  // @ts-ignore
  if (window.clearToasts) {
    // @ts-ignore
    window.clearToasts();
  }
};

export default ToastContainer;