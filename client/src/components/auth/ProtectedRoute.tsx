import React from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles = [] 
}) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Redirect to="/login" />;
  }

  // Se roles for vazio, qualquer usuário autenticado pode acessar
  if (roles.length === 0) {
    return <>{children}</>;
  }

  // @ts-expect-error - Verificação de permissão será implementada posteriormente
  // Verifica se o usuário tem uma das roles necessárias
  const userHasRequiredRole = roles.includes(user.role);

  if (!userHasRequiredRole) {
    return <Redirect to="/sem-permissao" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;