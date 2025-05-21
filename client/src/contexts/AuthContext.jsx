import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Criando o contexto de autenticação
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  error: null
});

// Hook para acessar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Para desenvolvimento, vamos simular um usuário logado
  useEffect(() => {
    const mockUser = {
      id: '1',
      name: 'Administrador NIXCON',
      email: 'admin@nixcon.com.br',
      role: 'admin',
      permissions: ['*']
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoading(false);
    
    // Em produção, você faria uma chamada API para verificar a sessão
    /*
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        
        if (!response.ok) {
          throw new Error('Falha ao verificar autenticação');
        }
        
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setError(err.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    */
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      // Em produção, você faria uma chamada API para autenticar
      /*
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao fazer login');
      }
      
      const data = await response.json();
      
      setUser(data.user);
      setIsAuthenticated(true);
      */
      
      // Para desenvolvimento, simulando login bem-sucedido
      const mockUser = {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'admin',
        permissions: ['*']
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${mockUser.name}!`,
      });
      
      return true;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.message);
      
      toast({
        title: 'Erro ao fazer login',
        description: err.message,
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Em produção, você faria uma chamada API para fazer logout
      /*
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao fazer logout');
      }
      */
      
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: 'Logout realizado com sucesso',
        description: 'Você saiu do sistema com segurança.',
      });
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError(err.message);
      
      toast({
        title: 'Erro ao fazer logout',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;