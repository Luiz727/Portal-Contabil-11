// Implementação simplificada do toast
import { useState } from "react";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  className?: string;
};

// Armazenamento centralizado das mensagens de toast
let toastStore: Toast[] = [];
let toastSetters: any[] = [];

// Função para notificar todos os componentes sobre mudanças nos toasts
const notifyToastChange = () => {
  toastSetters.forEach((setter) => setter([...toastStore]));
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Registra o setter deste componente se ainda não estiver registrado
  if (!toastSetters.includes(setToasts)) {
    toastSetters.push(setToasts);
    // Configurar o estado inicial
    setToasts([...toastStore]);
  }
  
  return {
    toast: {
      // Método para adicionar um toast
      toast: (props: Omit<Toast, "id">) => {
        const id = `toast-${Date.now()}`;
        const newToast = { ...props, id };
        
        toastStore = [...toastStore, newToast];
        notifyToastChange();
        
        // Auto-remove após 3 segundos
        setTimeout(() => {
          toastStore = toastStore.filter(t => t.id !== id);
          notifyToastChange();
        }, 3000);
        
        return id;
      },
      
      // Método para remover um toast específico
      dismiss: (id?: string) => {
        if (id) {
          toastStore = toastStore.filter(t => t.id !== id);
        } else {
          toastStore = [];
        }
        notifyToastChange();
      },
      
      // Lista atual de toasts
      toasts: toastStore
    }
  };
}