import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

// Criação do contexto para autenticação
const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isSuperAdmin: false,
  isAdmin: false,
  isAccountant: false,
  isClient: false,
  hasOfficeAccess: false,
  hasPermission: () => false,
  shouldShowComponent: () => false,
  logout: () => {},
});

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Componente provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carrega os dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Usuário não está autenticado
            setUser(null);
            return;
          }
          throw new Error('Falha ao carregar usuário');
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas informações. Por favor, tente novamente mais tarde.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Função auxiliar para verificar se deve mostrar um componente baseado em permissões
  const shouldShowComponent = (requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!user || !user.permissions) return false;
    
    // Verifica se o usuário tem pelo menos uma das permissões requeridas
    return requiredPermissions.some(permission => user.permissions.includes(permission));
  };

  // Função para logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      // Redireciona para a página de login
      window.location.href = '/login';
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer logout. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Propriedades derivadas para facilitar a verificação de papéis
  const isAuthenticated = !!user;
  const isSuperAdmin = hasPermission('super_admin');
  const isAdmin = hasPermission('admin');
  const isAccountant = hasPermission('contador');
  const isClient = hasPermission('cliente');
  const hasOfficeAccess = hasPermission('acesso_escritorio');

  // Valor do contexto
  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isAccountant,
    isClient,
    hasOfficeAccess,
    hasPermission,
    shouldShowComponent,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;