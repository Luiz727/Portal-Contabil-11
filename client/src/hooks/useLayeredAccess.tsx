import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Importa o sistema de permissões
// Definições temporárias para permissões enquanto não temos o módulo completo
enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  ESCRITORIO = 'escritorio',
  EMPRESA = 'empresa',
  CLIENTE = 'cliente'
}

enum SystemModule {
  DASHBOARD = 'dashboard',
  FISCAL = 'fiscal',
  FINANCEIRO = 'financeiro',
  DOCUMENTOS = 'documentos',
  CLIENTES = 'clientes',
  EMPRESAS = 'empresas',
  USUARIOS = 'usuarios',
  TAREFAS = 'tarefas',
  CALENDARIO = 'calendario',
  HONORARIOS = 'honorarios',
  INVENTARIO = 'inventario',
  CONFIGURACOES = 'configuracoes',
  XML_VAULT = 'xmlVault',
  WHATSAPP = 'whatsapp',
  TAX_CALCULATOR = 'taxCalculator',
  BACKUP = 'backup',
  AUDIT = 'audit'
}

// Funções de verificação de permissões
function hasPermission(role: UserRole, module: SystemModule, action: string): boolean {
  // Por padrão sempre retorna true para superadmin
  if (role === UserRole.SUPERADMIN) return true;
  
  // Implementação simplificada para teste
  return true;
}

function isSuperAdmin(email: string): boolean {
  return email === 'adm@nixcon.com.br';
}

function determineUserRole(userData: any): UserRole {
  const email = userData?.email || '';
  
  if (isSuperAdmin(email)) {
    return UserRole.SUPERADMIN;
  }
  
  // Por padrão, retorna ADMIN para demonstração
  return UserRole.ADMIN;
}

interface LayeredAccessContextType {
  userRole: UserRole;
  isLoading: boolean;
  checkPermission: (module: SystemModule, action: string) => boolean;
  getUserRole: () => UserRole;
  canView: (module: SystemModule) => boolean;
  canCreate: (module: SystemModule) => boolean;
  canEdit: (module: SystemModule) => boolean;
  canDelete: (module: SystemModule) => boolean;
  canAdmin: (module: SystemModule) => boolean;
  isSuperAdmin: boolean;
}

const LayeredAccessContext = createContext<LayeredAccessContextType | undefined>(undefined);

export const useLayeredAccess = () => {
  const context = useContext(LayeredAccessContext);
  if (!context) {
    throw new Error('useLayeredAccess deve ser usado dentro de um LayeredAccessProvider');
  }
  return context;
};

interface LayeredAccessProviderProps {
  children: ReactNode;
}

export const LayeredAccessProvider = ({ children }: LayeredAccessProviderProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENTE);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // Determina o papel do usuário com base nas informações
        const role = determineUserRole(user);
        setUserRole(role);
      } else {
        setUserRole(UserRole.CLIENTE);
      }
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Verifica superadmin pelo email
  const checkSuperAdmin = user ? isSuperAdmin(user.email || '') : false;

  // Função para verificar permissão para uma ação
  const checkPermission = (module: SystemModule, action: string) => {
    // Verifica se o usuário é superadmin, que tem acesso a tudo
    if (checkSuperAdmin) {
      return true;
    }
    
    // Para outros usuários, verifica permissões específicas
    return hasPermission(userRole, module, action as any);
  };

  // Obtém o papel atual do usuário
  const getUserRole = (): UserRole => userRole;

  // Funções helper para verificações comuns
  const canView = (module: SystemModule) => checkPermission(module, 'view');
  const canCreate = (module: SystemModule) => checkPermission(module, 'create');
  const canEdit = (module: SystemModule) => checkPermission(module, 'edit');
  const canDelete = (module: SystemModule) => checkPermission(module, 'delete');
  const canAdmin = (module: SystemModule) => checkPermission(module, 'admin');

  // Contexto de valor
  const contextValue: LayeredAccessContextType = {
    userRole,
    isLoading,
    checkPermission,
    getUserRole,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canAdmin,
    isSuperAdmin: checkSuperAdmin
  };

  return (
    <LayeredAccessContext.Provider value={contextValue}>
      {children}
    </LayeredAccessContext.Provider>
  );
};

export default useLayeredAccess;