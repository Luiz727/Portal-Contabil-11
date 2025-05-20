import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface DismissibleAlertProps {
  title: string;
  description: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  duration?: number; // em milissegundos, 0 para não fechar automaticamente
  className?: string;
  children?: React.ReactNode;
}

export function DismissibleAlert({
  title,
  description,
  variant = "default",
  duration = 6000, // 6 segundos por padrão
  className,
  children,
}: DismissibleAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (duration > 0) {
      timer = setTimeout(() => {
        setVisible(false);
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  if (!visible) return null;

  const variantStyles = {
    default: "bg-gray-50 border-gray-200 text-gray-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative rounded-lg border p-4 shadow-sm",
            variantStyles[variant],
            className
          )}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-medium">{title}</h3>
              <div className="mt-1 text-sm">{description}</div>
              {children}
            </div>
            <button
              type="button"
              className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setVisible(false)}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}