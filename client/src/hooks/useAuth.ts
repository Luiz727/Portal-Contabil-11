import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

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
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Primeiro, verifica se há usuário no localStorage
    const storedUser = localStorage.getItem('nixcon_user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao analisar usuário armazenado:', error);
        localStorage.removeItem('nixcon_user');
      }
    }
    
    setIsLoading(false);
    
    // Como backup, também tenta buscar do API (para sistemas de produção real)
    const fetchFromApi = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados de usuário da API:', error);
        // Em produção, poderia fazer logout do usuário aqui
      }
    };
    
    // Tenta buscar da API apenas se não tiver encontrado no localStorage
    if (!storedUser) {
      fetchFromApi();
    }
  }, []);

  // Função para realizar logout
  const logout = () => {
    localStorage.removeItem('nixcon_user');
    setUser(null);
    queryClient.clear();
    navigate('/login');
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

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSuperAdmin,
    isAdmin,
    isAccountant,
    isClient,
    hasOfficeAccess,
    logout
  };
}