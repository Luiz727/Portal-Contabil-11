import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:pointer-events-none disabled:opacity-50",
          
          // Variantes
          {
            "bg-primary text-white hover:bg-primary-600 active:bg-primary-700": 
              variant === 'default',
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": 
              variant === 'destructive',
            "border border-input bg-background hover:bg-gray-50 hover:text-gray-900": 
              variant === 'outline',
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": 
              variant === 'secondary',
            "hover:bg-gray-100 hover:text-gray-900": 
              variant === 'ghost',
            "text-primary underline-offset-4 hover:underline": 
              variant === 'link',
          },
          
          // Tamanhos
          {
            "px-4 py-2 text-sm": size === 'default',
            "px-3 py-1 text-xs rounded-md": size === 'sm',
            "px-6 py-3 text-base rounded-md": size === 'lg',
            "h-9 w-9 p-0": size === 'icon',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };