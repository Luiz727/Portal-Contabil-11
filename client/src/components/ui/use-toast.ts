// Sistema simplificado de toast

// Definição do tipo de toast
export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  className?: string;
};

// Estado global dos toasts
const globalToasts: Toast[] = [];
const subscribers: Array<(toasts: Toast[]) => void> = [];

// Notificar todos os assinantes
const notifySubscribers = (): void => {
  subscribers.forEach(subscriber => subscriber([...globalToasts]));
};

// Funções de gerenciamento
const addToast = (toast: Omit<Toast, "id">): string => {
  const id = `toast-${Date.now()}`;
  const newToast = { ...toast, id };
  
  globalToasts.push(newToast);
  notifySubscribers();
  
  // Auto-remover após 3 segundos
  setTimeout(() => {
    removeToast(id);
  }, 3000);
  
  return id;
};

const removeToast = (id?: string): void => {
  if (id) {
    const index = globalToasts.findIndex(toast => toast.id === id);
    if (index !== -1) {
      globalToasts.splice(index, 1);
      notifySubscribers();
    }
  } else {
    globalToasts.length = 0;
    notifySubscribers();
  }
};

// Hook para usar o sistema de toast
export function useToast() {
  return {
    toast: (props: Omit<Toast, "id">) => addToast(props),
    dismiss: (id?: string) => removeToast(id),
    toasts: globalToasts
  };
}

// API global
export const toast = {
  show: (props: Omit<Toast, "id">) => addToast(props),
  dismiss: (id?: string) => removeToast(id),
  subscribe: (callback: (toasts: Toast[]) => void): (() => void) => {
    subscribers.push(callback);
    callback([...globalToasts]);
    
    return () => {
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }
};