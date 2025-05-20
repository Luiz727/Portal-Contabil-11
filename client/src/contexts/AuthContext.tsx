import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UserRole, 
  SystemModule, 
  AccessLevel,
  canRead,
  canWrite,
  canAdmin,
  DEFAULT_PERMISSIONS
} from '@shared/auth/permissions';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: UserRole;
  empresaId?: string;
  profileImageUrl?: string;
  customPermissions?: Record<SystemModule, AccessLevel>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  canAccessModule: (module: SystemModule, requiredLevel: AccessLevel) => boolean;
  canReadModule: (module: SystemModule) => boolean;
  canWriteModule: (module: SystemModule) => boolean;
  canAdminModule: (module: SystemModule) => boolean;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Adapta os dados do usuário ao formato esperado
  const user: User | null = fetchedUser ? {
    id: fetchedUser.id,
    firstName: fetchedUser.firstName,
    lastName: fetchedUser.lastName,
    email: fetchedUser.email,
    role: fetchedUser.role as UserRole || UserRole.CLIENTE,
    empresaId: fetchedUser.empresaId,
    profileImageUrl: fetchedUser.profileImageUrl,
    customPermissions: fetchedUser.customPermissions,
  } : null;

  // Função que verifica se o usuário tem acesso a um módulo específico
  const canAccessModule = (module: SystemModule, requiredLevel: AccessLevel): boolean => {
    if (!user) return false;
    
    // Se o usuário tiver permissões customizadas, elas têm prioridade
    if (user.customPermissions && user.customPermissions[module] !== undefined) {
      return user.customPermissions[module] >= requiredLevel;
    }
    
    // Caso contrário, use as permissões padrão
    return DEFAULT_PERMISSIONS[user.role][module] >= requiredLevel;
  };

  // Funções auxiliares para verificações comuns
  const canReadModule = (module: SystemModule): boolean => {
    return canAccessModule(module, AccessLevel.READ);
  };

  const canWriteModule = (module: SystemModule): boolean => {
    return canAccessModule(module, AccessLevel.WRITE);
  };

  const canAdminModule = (module: SystemModule): boolean => {
    return canAccessModule(module, AccessLevel.ADMIN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        canAccessModule,
        canReadModule,
        canWriteModule,
        canAdminModule,
        userRole: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook especializado para componentes que precisam verificar permissões
export function usePermission(module: SystemModule, level: AccessLevel = AccessLevel.READ) {
  const { canAccessModule, isAuthenticated, isLoading } = useAuth();
  
  return {
    hasPermission: canAccessModule(module, level),
    isAuthenticated,
    isLoading
  };
}

// Hook para renderização condicional baseada em permissões
export function withPermission(
  WrappedComponent: React.ComponentType<any>,
  module: SystemModule,
  requiredLevel: AccessLevel = AccessLevel.READ
) {
  return function WithPermissionComponent(props: any) {
    const { canAccessModule, isLoading } = useAuth();
    
    if (isLoading) {
      return <div className="p-4 text-center">Carregando...</div>;
    }
    
    return canAccessModule(module, requiredLevel) ? (
      <WrappedComponent {...props} />
    ) : (
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-red-600">Acesso Negado</h3>
        <p className="mt-2 text-muted-foreground">
          Você não tem permissão para acessar este recurso.
        </p>
      </div>
    );
  };
}