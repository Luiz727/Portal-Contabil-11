import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/supabase';
// Definições temporárias para UserRole, SystemModule, etc.
// Em produção, essas definições viriam do módulo shared/auth/permissions

enum UserRole {
  ADMIN = 'admin',
  ESCRITORIO = 'escritorio',
  EMPRESA = 'empresa',
  CLIENTE = 'cliente'
}

enum AccessLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  ADMIN = 3
}

enum SystemModule {
  DASHBOARD = 'dashboard',
  FISCAL = 'fiscal',
  FINANCEIRO = 'financeiro',
  DOCUMENTOS = 'documentos',
  CLIENTES = 'clientes',
  TAREFAS = 'tarefas',
  WHATSAPP = 'whatsapp',
  
  // outros módulos...
  SETTINGS = 'settings',
  TAX_CALCULATOR = 'tax_calculator'
}

// Permissões padrão para os papéis
const DEFAULT_PERMISSIONS: Record<UserRole, Record<SystemModule, AccessLevel>> = {
  [UserRole.ADMIN]: {
    [SystemModule.DASHBOARD]: AccessLevel.ADMIN,
    [SystemModule.FISCAL]: AccessLevel.ADMIN,
    [SystemModule.FINANCEIRO]: AccessLevel.ADMIN,
    [SystemModule.DOCUMENTOS]: AccessLevel.ADMIN,
    [SystemModule.CLIENTES]: AccessLevel.ADMIN,
    [SystemModule.TAREFAS]: AccessLevel.ADMIN,
    [SystemModule.WHATSAPP]: AccessLevel.ADMIN,
    [SystemModule.SETTINGS]: AccessLevel.ADMIN,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.ADMIN,
  },
  [UserRole.ESCRITORIO]: {
    [SystemModule.DASHBOARD]: AccessLevel.ADMIN,
    [SystemModule.FISCAL]: AccessLevel.ADMIN,
    [SystemModule.FINANCEIRO]: AccessLevel.ADMIN,
    [SystemModule.DOCUMENTOS]: AccessLevel.ADMIN,
    [SystemModule.CLIENTES]: AccessLevel.ADMIN,
    [SystemModule.TAREFAS]: AccessLevel.ADMIN,
    [SystemModule.WHATSAPP]: AccessLevel.ADMIN,
    [SystemModule.SETTINGS]: AccessLevel.WRITE,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.ADMIN,
  },
  [UserRole.EMPRESA]: {
    [SystemModule.DASHBOARD]: AccessLevel.WRITE,
    [SystemModule.FISCAL]: AccessLevel.WRITE,
    [SystemModule.FINANCEIRO]: AccessLevel.WRITE,
    [SystemModule.DOCUMENTOS]: AccessLevel.WRITE,
    [SystemModule.CLIENTES]: AccessLevel.WRITE,
    [SystemModule.TAREFAS]: AccessLevel.WRITE,
    [SystemModule.WHATSAPP]: AccessLevel.WRITE,
    [SystemModule.SETTINGS]: AccessLevel.WRITE,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.WRITE,
  },
  [UserRole.CLIENTE]: {
    [SystemModule.DASHBOARD]: AccessLevel.READ,
    [SystemModule.FISCAL]: AccessLevel.NONE,
    [SystemModule.FINANCEIRO]: AccessLevel.NONE,
    [SystemModule.DOCUMENTOS]: AccessLevel.READ,
    [SystemModule.CLIENTES]: AccessLevel.NONE,
    [SystemModule.TAREFAS]: AccessLevel.NONE,
    [SystemModule.WHATSAPP]: AccessLevel.READ,
    [SystemModule.SETTINGS]: AccessLevel.READ,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.READ,
  }
};

// Funções de utilidade para verificar permissões
function canRead(userRole: UserRole, module: SystemModule, customPermissions?: Record<SystemModule, AccessLevel>): boolean {
  return hasModuleAccess(userRole, module, AccessLevel.READ, customPermissions);
}

function canWrite(userRole: UserRole, module: SystemModule, customPermissions?: Record<SystemModule, AccessLevel>): boolean {
  return hasModuleAccess(userRole, module, AccessLevel.WRITE, customPermissions);
}

function canAdmin(userRole: UserRole, module: SystemModule, customPermissions?: Record<SystemModule, AccessLevel>): boolean {
  return hasModuleAccess(userRole, module, AccessLevel.ADMIN, customPermissions);
}

function hasModuleAccess(
  userRole: UserRole,
  module: SystemModule,
  requiredLevel: AccessLevel,
  customPermissions?: Record<SystemModule, AccessLevel>
): boolean {
  if (customPermissions && customPermissions[module] !== undefined) {
    return customPermissions[module] >= requiredLevel;
  }
  
  return DEFAULT_PERMISSIONS[userRole][module] >= requiredLevel;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: UserRole;
  empresaId?: string;
  escritorioId?: string;
  profileImageUrl?: string;
  customPermissions?: Record<SystemModule, AccessLevel>;
  isSuperAdmin?: boolean;
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
  // Utiliza a função getCurrentUser do Supabase para obter os dados do usuário autenticado
  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  // Adapta os dados do usuário ao formato esperado
  const user: User | null = fetchedUser ? {
    id: fetchedUser.id,
    firstName: fetchedUser.firstName,
    lastName: fetchedUser.lastName,
    email: fetchedUser.email,
    role: fetchedUser.role as UserRole || UserRole.CLIENTE,
    empresaId: fetchedUser.empresaId,
    escritorioId: fetchedUser.escritorioId,
    profileImageUrl: fetchedUser.profileImageUrl,
    customPermissions: fetchedUser.customPermissions,
    isSuperAdmin: fetchedUser.isSuperAdmin || fetchedUser.email === 'adm@nixcon.com.br'
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