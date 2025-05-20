import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

type ProtectedRouteProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
};

/**
 * Componente que protege rotas exigindo autenticação
 * Redireciona para login caso o usuário não esteja autenticado
 * Opcionalmente verifica as permissões do usuário
 */
const ProtectedRoute = ({ 
  children, 
  fallback, 
  requiredRoles 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Se ainda está carregando, mostra uma indicação de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não há usuário autenticado
  if (!user) {
    // Se um fallback foi fornecido, mostra-o
    if (fallback) {
      return <>{fallback}</>;
    }

    // Caso contrário, redireciona para a página de login
    toast.show({
      title: "Acesso Restrito",
      description: "Você precisa fazer login para acessar esta página",
      variant: "destructive"
    });
    
    setLocation('/login');
    return null;
  }

  // Verificação de papéis/permissões, se necessário
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      toast.show({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive"
      });
      
      setLocation('/dashboard');
      return null;
    }
  }

  // Se passou por todas as verificações, renderiza o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;