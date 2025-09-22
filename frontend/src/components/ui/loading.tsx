import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn(
      'relative',
      sizeClasses[size],
      className
    )}>
      <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
    </div>
  );
};

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  lines = 1 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-muted rounded animate-pulse',
            index === lines - 1 && lines > 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

interface LoadingCardProps {
  className?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ className }) => {
  return (
    <div className={cn(
      'bg-card border rounded-lg p-6 shadow-soft animate-pulse',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="h-6 bg-muted rounded w-16"></div>
      </div>
      <LoadingSkeleton lines={3} />
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  children, 
  message = 'جاري التحميل...' 
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-large">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground text-center">{message}</p>
        </div>
      </div>
    </div>
  );
};

export {
  LoadingSpinner,
  LoadingDots,
  LoadingSkeleton,
  LoadingCard,
  LoadingOverlay
};