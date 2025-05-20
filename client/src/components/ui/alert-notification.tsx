import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface AlertNotificationProps {
  title: string;
  message: string;
  variant?: "success" | "warning" | "error" | "info";
  className?: string;
  duration?: number; // Duração em milissegundos (0 para não fechar automaticamente)
}

export function AlertNotification({
  title,
  message,
  variant = "info",
  className,
  duration = 5000, // 5 segundos por padrão
}: AlertNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Se a duração for maior que 0, configura o timer para fechar automaticamente
    if (duration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  if (!isVisible) return null;

  const variantStyles = {
    success: {
      backgroundColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500",
      icon: CheckCircle
    },
    warning: {
      backgroundColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      iconColor: "text-amber-500",
      icon: AlertCircle
    },
    error: {
      backgroundColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      icon: AlertCircle
    },
    info: {
      backgroundColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      icon: AlertCircle
    }
  };

  const { backgroundColor, borderColor, textColor, iconColor, icon: Icon } = variantStyles[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative rounded-md border p-4 shadow-sm",
            backgroundColor,
            borderColor,
            className
          )}
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-2 rounded-full p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start">
            <div className="mr-3 flex-shrink-0">
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div>
              <h3 className={cn("text-sm font-medium", textColor)}>{title}</h3>
              <div className={cn("mt-1 text-sm", textColor)}>{message}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}