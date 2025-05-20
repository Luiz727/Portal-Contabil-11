import { useState, useEffect } from 'react';

interface User {
  email: string;
  role?: string;
  name?: string;
}

/**
 * Hook para autenticação que utiliza localStorage para persistir a sessão
 * Permite testar o sistema com diferentes papéis de usuário
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carrega usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('nixcon_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  // Função para logout
  const logout = () => {
    localStorage.removeItem('nixcon_user');
    setUser(null);
  };
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
}

export default useAuth;