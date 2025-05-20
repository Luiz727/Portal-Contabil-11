import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useToast, type Toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

/**
 * Componente de toasts (notificações) para o sistema NIXCON
 * Exibe mensagens temporárias que desaparecem automaticamente ou quando clicadas
 */
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Forma simplificada - observamos direto os toasts do hook
    setToasts(toast.toasts || []);
    
    // Configurando um timeout para verificar toasts a cada 300ms
    const interval = setInterval(() => {
      setToasts(toast.toasts || []);
    }, 300);
    
    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end p-4 gap-2 w-full sm:max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex w-full items-center justify-between rounded-md border px-4 py-3 shadow-md",
            "transform transition-all duration-300 ease-in-out",
            "animate-in slide-in-from-right-full fade-in-80",
            {
              "bg-white text-gray-900 border-gray-200": toast.variant === "default" || !toast.variant,
              "bg-red-50 text-red-900 border-red-200": toast.variant === "destructive",
              "bg-green-50 text-green-900 border-green-200": toast.variant === "success",
            },
            toast.className
          )}
          onClick={() => {
            // Permite fechar o toast ao clicar nele
            toast.dismiss(toast.id);
          }}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="font-medium leading-none tracking-tight">{toast.title}</div>
            )}
            {toast.description && (
              <div className="mt-1 text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(toast.id);
            }}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-200/50 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// Extensão do hook de toast global
toast.subscribe = (listener: (toasts: Toast[]) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  // @ts-ignore - Estendendo a API global do toast
  if (!toast._listeners) toast._listeners = [];
  // @ts-ignore
  toast._listeners.push(listener);
  
  return () => {
    // @ts-ignore
    toast._listeners = toast._listeners.filter((l: any) => l !== listener);
  };
};

toast.unsubscribe = (listener: (toasts: Toast[]) => void) => {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  if (!toast._listeners) return;
  // @ts-ignore
  toast._listeners = toast._listeners.filter((l: any) => l !== listener);
};

// Função interna para notificar alterações
// @ts-ignore
toast._notify = () => {
  // @ts-ignore
  if (!toast._listeners) return;
  // @ts-ignore
  toast._listeners.forEach((listener: (toasts: Toast[]) => void) => {
    // @ts-ignore
    listener(toast._toasts || []);
  });
};

// Integração com o hook existente
const originalToast = toast.toast;
toast.toast = (props: any) => {
  const id = originalToast(props);
  // @ts-ignore
  toast._notify();
  return id;
};

const originalDismiss = toast.dismiss;
toast.dismiss = (toastId?: string) => {
  originalDismiss(toastId);
  // @ts-ignore
  toast._notify();
};

// Inicialização
// @ts-ignore
toast._toasts = toast.toasts || [];
// @ts-ignore
toast._listeners = [];