import { useQuery } from "@tanstack/react-query";

// Interface do usuário autenticado
export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Verifica se o usuário é admin
  const isAdmin = user?.role === "admin";
  
  // Verifica se o usuário é contador
  const isAccountant = user?.role === "accountant";
  
  // Verifica se o usuário é cliente
  const isClient = user?.role === "client";
  
  // Verificar se o usuário tem acesso ao escritório contábil
  const hasOfficeAccess = isAdmin || isAccountant;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    isAccountant,
    isClient,
    hasOfficeAccess,
  };
}