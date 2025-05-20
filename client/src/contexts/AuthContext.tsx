import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'wouter';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  empresaId?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: string) => boolean;
}

const initialAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se existe um usuário autenticado no localStorage ao iniciar
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Função para autenticação do usuário
  const login = async (email: string, password: string): Promise<boolean> => {
    // Implementação simplificada para desenvolvimento
    // Em produção, isso faria uma chamada de API para autenticar

    // Admin (superadmin) - Acesso completo ao sistema
    if (email === 'adm@nixcon.com.br' && password === 'Temp123.') {
      const adminUser = {
        id: '1',
        email: 'adm@nixcon.com.br',
        nome: 'Administrador NIXCON',
        role: 'superadmin',
      };
      
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // Contador (staff) - Acesso aos módulos de escritório
    else if (email === 'contador@nixcon.com.br' && password === 'contador') {
      const contadorUser = {
        id: '2',
        email: 'contador@nixcon.com.br',
        nome: 'Contador NIXCON',
        role: 'staff',
      };
      
      setUser(contadorUser);
      localStorage.setItem('user', JSON.stringify(contadorUser));
      return true;
    }
    
    // Cliente (client) - Acesso ao portal do cliente
    else if (email === 'cliente@exemplo.com' && password === 'cliente') {
      const clienteUser = {
        id: '3',
        email: 'cliente@exemplo.com',
        nome: 'Empresa Cliente',
        role: 'client',
        empresaId: 1,
      };
      
      setUser(clienteUser);
      localStorage.setItem('user', JSON.stringify(clienteUser));
      return true;
    }
    
    // Visitante (anônimo) - Acesso limitado à calculadora de impostos
    else if (email === 'visitante@exemplo.com' && password === 'visitante') {
      const visitanteUser = {
        id: '4',
        email: 'visitante@exemplo.com',
        nome: 'Visitante',
        role: 'visitor',
      };
      
      setUser(visitanteUser);
      localStorage.setItem('user', JSON.stringify(visitanteUser));
      return true;
    }
    
    return false;
  };

  // Função para logout do usuário
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Verifica se o usuário tem a permissão necessária para acessar um recurso
  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false;

    // Hierarquia de permissões
    const roles = {
      superadmin: 4, // Acesso total
      staff: 3,      // Acesso às funcionalidades do escritório
      client: 2,     // Acesso ao portal do cliente
      visitor: 1     // Acesso básico (calculadora)
    };

    const userRoleLevel = roles[user.role as keyof typeof roles] || 0;
    const requiredRoleLevel = roles[requiredRole as keyof typeof roles] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};