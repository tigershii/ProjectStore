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
    // eslint-disable-next-line
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
          variant: "success" as const,
          icon: <CheckCircle className="h-4 w-4 mr-2" />
        };
      case 'warning':
        return {
          variant: "warning" as const,
          icon: <AlertTriangle className="h-4 w-4 mr-2" />
        };
      case 'info':
        return {
          variant: "info" as const,
          icon: <Info className="h-4 w-4 mr-2" />
        };
      case 'error':
        return {
          variant: "error" as const,
          icon: <AlertCircle className="h-4 w-4 mr-2" />
        };
    }
  };

  const { variant, icon } = getAlertProps();

  return (
    <div className="pointer-events-auto w-80">
      <Alert variant={variant} className={`pr-8 shadow-md relative`}>
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