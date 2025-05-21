import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { Spinner } from "../components/ui/spinner";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Se autenticação é requerida e o usuário não está autenticado
    if (!isLoading && requireAuth && !isAuthenticated) {
      window.location.href = "/api/login";
    }

    // Se existem roles permitidas e o usuário não tem a role necessária
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
  }, [isLoading, isAuthenticated, user, requireAuth, allowedRoles, setLocation]);

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

  // Verificações de permissão
  // Superadmin tem acesso a todas as áreas
  if (
    isAuthenticated && 
    allowedRoles.length > 0 && 
    user && 
    user.role !== "superadmin" && // Superadmin sempre tem acesso
    !allowedRoles.includes(user.role)
  ) {
    return null; // Vai redirecionar no useEffect
  }

  // Renderiza os componentes filhos se todas as verificações passarem
  return <>{children}</>;
}