import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook para acessar o contexto de autenticação
 * Fornece dados do usuário e funções de login/logout
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}