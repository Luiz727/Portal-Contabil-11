import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { Spinner } from "../components/ui/spinner";
import { useEffect, useContext } from "react";
import { ViewModeContext } from "@/contexts/ViewModeContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  requiredFeatures?: string[];
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  allowedRoles = [],
  requiredFeatures = []
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { viewMode, activeProfile } = useContext(ViewModeContext);

  useEffect(() => {
    // Se autenticação é requerida e o usuário não está autenticado
    if (!isLoading && requireAuth && !isAuthenticated) {
      window.location.href = "/login";
    }

    // Verifica perfil do usuário logado contra roles permitidas
    // Superadmin tem acesso a todas as áreas
    if (
      !isLoading &&
      isAuthenticated && 
      allowedRoles.length > 0 && 
      user && 
      user.role !== "superadmin" && // Superadmin sempre tem acesso
      !allowedRoles.includes(user.role)
    ) {
      setLocation("/sem-permissao");
    }

    // Verifica se o perfil de visualização ativo tem permissão para as funcionalidades requeridas
    if (
      !isLoading &&
      isAuthenticated &&
      requiredFeatures.length > 0 &&
      activeProfile && 
      viewMode === 'empresa' // Apenas verifica quando está no modo empresa
    ) {
      // Verifica se todas as funcionalidades requeridas estão disponíveis no perfil ativo
      const hasAllRequiredFeatures = requiredFeatures.every(feature => 
        activeProfile.permissoes?.includes(feature)
      );
      
      if (!hasAllRequiredFeatures) {
        setLocation("/sem-permissao");
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, allowedRoles, requiredFeatures, setLocation, viewMode, activeProfile]);

  // Mostra um spinner durante o carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Verificações de autenticação
  if (requireAuth && !isAuthenticated) {
    return null; // Vai redirecionar no useEffect
  }

  // Verificações de permissão de perfil do usuário
  if (
    isAuthenticated && 
    allowedRoles.length > 0 && 
    user && 
    user.role !== "superadmin" && // Superadmin sempre tem acesso
    !allowedRoles.includes(user.role)
  ) {
    return null; // Vai redirecionar no useEffect
  }

  // Verificações de permissão baseada no perfil ativo de visualização
  if (
    isAuthenticated &&
    requiredFeatures.length > 0 &&
    activeProfile && 
    viewMode === 'empresa'
  ) {
    // Verifica se todas as funcionalidades requeridas estão disponíveis no perfil ativo
    const hasAllRequiredFeatures = requiredFeatures.every(feature => 
      activeProfile.permissoes?.includes(feature)
    );
    
    if (!hasAllRequiredFeatures) {
      return null; // Vai redirecionar no useEffect
    }
  }

  // Renderiza os componentes filhos se todas as verificações passarem
  return <>{children}</>;
}