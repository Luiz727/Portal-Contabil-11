import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import SemPermissao from '../../pages/SemPermissao';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles = [] 
}) => {
  const { session, profile, loading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Se não houver sessão, redireciona para o login
  if (!session) {
    return <Redirect to="/login" />;
  }

  // Se roles for vazio, qualquer usuário autenticado pode acessar
  if (roles.length === 0) {
    return <>{children}</>;
  }

  // Se o perfil não foi carregado, mostra o loader por um tempo máximo
  if (!profile) {
    // Usando um loading com timeout para evitar loop infinito
    const [timeoutReached, setTimeoutReached] = React.useState(false);
    
    React.useEffect(() => {
      const timer = setTimeout(() => {
        console.warn('Timeout: Perfil do usuário não encontrado após 3 segundos');
        setTimeoutReached(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }, []);
    
    // Se o timeout foi atingido, redireciona para login
    if (timeoutReached) {
      console.warn('Perfil do usuário não disponível após timeout, redirecionando para login');
      return <Redirect to="/login" />;
    }
    
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Verifica se o usuário tem uma das roles necessárias
  const userRole = profile?.role || 'user'; // Valor padrão caso não exista
  const userHasRequiredRole = roles.includes(userRole);

  // Se o usuário não tiver as permissões necessárias, mostra a página de acesso negado
  if (!userHasRequiredRole) {
    return <SemPermissao />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;