"use client";

import React, { createContext, useState, useCallback, useContext, useEffect } from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    const newToast = {
      ...toast,
      id
    };
    
    setToasts(prev => [...prev, newToast]);
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  useEffect(() => {
    return () => {
      setToasts([]);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;
  const { toasts } = context;

  return (
    <div className="fixed z-50 right-2 bottom-0 mb-2 flex flex-col-reverse gap-2 max-w-sm w-20 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: Toast }) {
  const { type, title, message } = toast;
  
  const getAlertProps = () => {
    switch (type) {
      case 'success':
        return {
          variant: "default" as const,
          className: "border-green-500 bg-green-100 text-green-800 dark:border-green-500 dark:bg-green-800 dark:text-green-100",
          icon: <CheckCircle className="h-4 w-4 mr-2" />
        };
      case 'warning':
        return {
          variant: "default" as const,
          className: "border-amber-500 bg-amber-100 text-amber-800 dark:border-amber-500 dark:bg-amber-800 dark:text-amber-100",
          icon: <AlertTriangle className="h-4 w-4 mr-2" />
        };
      case 'info':
        return {
          variant: "default" as const,
          className: "border-blue-500 bg-blue-100 text-blue-800 dark:border-blue-500 dark:bg-blue-800 dark:text-blue-100",
          icon: <Info className="h-4 w-4 mr-2" />
        };
      case 'error':
        return {
          variant: "destructive" as const,
          className: "border-red-500 bg-red-100 text-red-800 dark:border-red-500 dark:bg-red-800 dark:text-red-100",
          icon: <AlertCircle className="h-4 w-4 mr-2" />
        };
    }
  };

  const { variant, className, icon } = getAlertProps();

  return (
    <div className="pointer-events-auto">
      <Alert variant={variant} className={`${className} pr-8 shadow-md relative`}>
        <div className="flex items-start">
          {icon}
          <div>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{message}</AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return {
    toast: (props: Omit<Toast, 'id'>) => {
      const duration = props.duration || 5000;
      context.addToast({ ...props, duration });
    },
    removeToast: (id: string) => context.removeToast(id),
    toasts: context.toasts
  };
}