import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Um componente de Card responsivo que se adapta a diferentes tamanhos de tela
 */
export const ResponsiveCard = React.forwardRef(({ 
  className, 
  title, 
  description, 
  children, 
  footer,
  headerClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  ...props 
}, ref) => {
  return (
    <Card
      ref={ref}
      className={cn("transition-all bg-card border-border", className)}
      {...props}
    >
      {(title || description) && (
        <CardHeader className={cn("space-y-1", headerClassName)}>
          {title && <CardTitle className={cn("text-xl sm:text-2xl md:text-2xl font-semibold", titleClassName)}>{title}</CardTitle>}
          {description && <CardDescription className={cn("text-sm sm:text-base text-muted-foreground", descriptionClassName)}>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && (
        <CardContent className={cn("text-sm sm:text-base", contentClassName)}>
          {children}
        </CardContent>
      )}
      {footer && (
        <CardFooter className={cn("px-6 py-4", footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
});

ResponsiveCard.displayName = "ResponsiveCard";

export default ResponsiveCard;