// Adaptado de https://ui.shadcn.com
import { useEffect, useState } from "react";

const TOAST_TIMEOUT = 3000;

type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive" | "success";
  className?: string;
};

type ToastActionElement = React.ReactElement;

export type Toast = ToastProps & {
  id: string;
  action?: ToastActionElement;
};

type ToasterToast = Toast & {
  timestamp: number;
};

const toasts: ToasterToast[] = [];
let listeners: ((toasts: ToasterToast[]) => void)[] = [];

const addToast = (toast: Toast): string => {
  const id = toast.id || `toast-${Date.now()}`;
  const newToast: ToasterToast = {
    ...toast,
    id,
    timestamp: Date.now(),
  };
  
  toasts.push(newToast);
  emitChange();
  
  // Auto-remove if duration is set
  if (newToast.duration !== 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration || TOAST_TIMEOUT);
  }

  return id;
};

const removeToast = (id: string): void => {
  const index = toasts.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
    emitChange();
  }
};

const emitChange = (): void => {
  listeners.forEach((listener) => {
    listener([...toasts]);
  });
};

export function useToast() {
  const [localToasts, setLocalToasts] = useState<ToasterToast[]>([]);

  useEffect(() => {
    const handleChange = (updatedToasts: ToasterToast[]) => {
      setLocalToasts(updatedToasts);
    };

    listeners.push(handleChange);
    return () => {
      listeners = listeners.filter((listener) => listener !== handleChange);
    };
  }, []);

  return {
    toast: (props: ToastProps) => {
      return addToast(props);
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        removeToast(toastId);
      } else {
        // Remove all toasts if no id is provided
        [...toasts].forEach((toast) => {
          removeToast(toast.id);
        });
      }
    },
    toasts: localToasts,
  };
}

export type { ToastProps };