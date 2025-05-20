import { useState } from 'react';

interface User {
  email: string;
  role?: string;
  name?: string;
}

// Hook simplificado para autenticação durante o desenvolvimento
export function useAuth() {
  // Usuário fictício para desenvolvimento - será substituído pelo sistema real
  const superAdmin: User = {
    email: 'adm@nixcon.com.br',
    role: 'superadmin',
    name: 'Administrador NIXCON'
  };
  
  // Simula um usuário autenticado para teste do sistema
  const [user] = useState<User | null>(superAdmin);
  const [isLoading] = useState(false);
  
  return {
    user,
    isLoading,
    isAuthenticated: true, // Definido como true para testar a interface
  };
}

export default useAuth;