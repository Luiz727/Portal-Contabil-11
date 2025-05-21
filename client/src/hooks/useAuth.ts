import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "wouter";
import { ViewModeContext, VIEW_MODES } from "@/contexts/ViewModeContext";

// Interface do usuário autenticado
export interface User {
  id: string;
  username?: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  profileImageUrl?: string | null;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  isAuthenticated?: boolean;
  permissions?: string[]; // Permissões específicas do usuário
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const viewModeContext = useContext(ViewModeContext);

  useEffect(() => {
    // Configura o modo de visualização e perfil com base no papel do usuário
    const setupUserContext = (userData: User) => {
      if (!viewModeContext) return;
      
      // Define o modo de visualização com base no papel do usuário
      if (userData.role === 'admin' || userData.role === 'superadmin') {
        viewModeContext.changeViewMode(VIEW_MODES.ESCRITORIO);
      } 
      else if (userData.role === 'accountant') {
        viewModeContext.changeViewMode(VIEW_MODES.CONTADOR);
      } 
      else if (userData.role === 'client') {
        viewModeContext.changeViewMode(VIEW_MODES.EMPRESA);
      }
      else {
        viewModeContext.changeViewMode(VIEW_MODES.EXTERNO);
      }
    };
    
    // Prioriza buscar os dados da API para garantir a sessão ativa
    const fetchFromApi = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/user', {
          credentials: 'include' // Importante para enviar cookies de sessão
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          // Salva no localStorage como cache apenas
          localStorage.setItem('nixcon_user', JSON.stringify(userData));
          setupUserContext(userData);
        } else if (response.status === 401) {
          // Se não estiver autenticado, limpa o localStorage
          localStorage.removeItem('nixcon_user');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de usuário da API:', error);
        // Tenta usar o cache local como fallback
        const storedUser = localStorage.getItem('nixcon_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setupUserContext(parsedUser);
          } catch (e) {
            console.error('Erro ao analisar usuário armazenado:', e);
            localStorage.removeItem('nixcon_user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFromApi();
  }, [viewModeContext]);

  // Função para realizar logout
  const logout = () => {
    localStorage.removeItem('nixcon_user');
    setUser(null);
    queryClient.clear();
    // Usar window.location para recarregar a página totalmente
    window.location.href = '/login';
  };

  // Verifica se o usuário é superadmin
  const isSuperAdmin = user?.role === "superadmin";
  
  // Verifica se o usuário é admin
  const isAdmin = user?.role === "admin" || isSuperAdmin;
  
  // Verifica se o usuário é contador
  const isAccountant = user?.role === "accountant";
  
  // Verifica se o usuário é cliente
  const isClient = user?.role === "client";
  
  // Verificar se o usuário tem acesso ao escritório contábil
  const hasOfficeAccess = isSuperAdmin || isAdmin || isAccountant;
  
  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission: string): boolean => {
    // Se não estiver autenticado, não tem permissão
    if (!user) return false;
    
    // Superadmin e admin têm todas as permissões
    if (isSuperAdmin || isAdmin) return true;
    
    // Verificar permissões específicas do usuário
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }
    
    // Verificar permissões do perfil ativo (do ViewModeContext)
    if (viewModeContext && viewModeContext.activeProfile) {
      // Se o perfil tiver permissão '*', tem acesso a tudo
      if (viewModeContext.activeProfile.permissoes?.includes('*')) {
        return true;
      }
      
      // Verifica se o perfil tem a permissão específica
      return viewModeContext.activeProfile.permissoes?.includes(permission) || false;
    }
    
    return false;
  };

  // Função para verificar se um componente/página deve ser mostrado com base no perfil atual
  const shouldShowComponent = (requiredPermissions: string[]): boolean => {
    // Se não houver permissões requeridas, mostrar para todos
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    // Superadmin e admin vêem tudo
    if (isSuperAdmin || isAdmin) {
      return true;
    }
    
    // Verificar se o usuário tem pelo menos uma das permissões requeridas
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin,
    isAdmin,
    isAccountant,
    isClient,
    hasOfficeAccess,
    hasPermission,
    shouldShowComponent,
    logout
  };
}