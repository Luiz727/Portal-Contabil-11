import { useAuth } from '../contexts/AuthContext';
import { 
  UserRole, 
  SystemModule, 
  AccessLevel
} from '../../shared/auth/permissions';

/**
 * Hook para gerenciar acesso em camadas
 * Determina qual interface/funcionalidades mostrar com base no papel do usuário
 */
export function useLayeredAccess() {
  const { user, userRole, canAccessModule } = useAuth();

  // Determina se o usuário está na camada admin (administração do sistema)
  const isAdminLayer = userRole === UserRole.ADMIN;
  
  // Determina se o usuário está na camada de escritório de contabilidade
  const isEscritorioLayer = userRole === UserRole.ESCRITORIO || isAdminLayer;
  
  // Determina se o usuário está na camada de empresa usuária
  const isEmpresaLayer = userRole === UserRole.EMPRESA || isEscritorioLayer;
  
  // Determina se o usuário está na camada de cliente
  const isClienteLayer = userRole === UserRole.CLIENTE || isEmpresaLayer;
  
  // Funções específicas para funcionalidades por camada
  
  // Administração do Sistema
  const canAccessSystemConfig = isAdminLayer || 
    canAccessModule(SystemModule.SYSTEM_CONFIG, AccessLevel.ADMIN);
  
  const canManageUsers = isAdminLayer || 
    canAccessModule(SystemModule.USER_MANAGEMENT, AccessLevel.ADMIN);
  
  // Escritório de Contabilidade
  const canManageEmpresas = isEscritorioLayer || 
    canAccessModule(SystemModule.CLIENTES, AccessLevel.ADMIN);
  
  const canConfigureFiscal = isEscritorioLayer || 
    canAccessModule(SystemModule.FISCAL_AJUSTES, AccessLevel.ADMIN);
  
  // Empresa Usuária
  const canManageClientes = isEmpresaLayer || 
    canAccessModule(SystemModule.CLIENTES, AccessLevel.WRITE);
  
  const canManageProducts = isEmpresaLayer || 
    canAccessModule(SystemModule.FISCAL_CADASTROS, AccessLevel.WRITE);
  
  const canEmitInvoices = isEmpresaLayer || 
    canAccessModule(SystemModule.FISCAL_EMISSOR, AccessLevel.WRITE);
  
  // Clientes 
  const canViewInvoices = isClienteLayer || 
    canAccessModule(SystemModule.DOCUMENTOS, AccessLevel.READ);
  
  return {
    // Camadas gerais
    isAdminLayer,
    isEscritorioLayer,
    isEmpresaLayer,
    isClienteLayer,
    
    // Permissões específicas por funcionalidade
    canAccessSystemConfig,
    canManageUsers,
    canManageEmpresas,
    canConfigureFiscal,
    canManageClientes,
    canManageProducts,
    canEmitInvoices,
    canViewInvoices,
    
    // Informações extras
    currentRole: userRole,
    empresaId: user?.empresaId
  };
}

/**
 * Hook para gerenciar visibilidade específica para cada camada
 * Facilita a renderização condicional de componentes de interface
 */
export function useLayeredUI() {
  const {
    isAdminLayer,
    isEscritorioLayer,
    isEmpresaLayer,
    isClienteLayer
  } = useLayeredAccess();
  
  // Determina quais elementos de UI mostrar com base na camada do usuário
  
  // Para o Menu/Sidebar principal
  const visibleMenuItems = {
    // Módulos principais
    dashboard: isClienteLayer, // Todos podem ver o dashboard, mas adaptado ao seu perfil
    fiscal: isEmpresaLayer,    // Apenas empresas e acima
    financeiro: isEmpresaLayer,
    documentos: isClienteLayer, // Todos precisam ver documentos
    clientes: isEmpresaLayer,  // Empresas gerenciam seus clientes
    tarefas: isEmpresaLayer,   // Tarefas para empresas e acima
    
    // Submódulos específicos
    fiscalEmissor: isEmpresaLayer,
    fiscalCadastros: isEmpresaLayer,
    fiscalRelatorios: isEmpresaLayer,
    fiscalImportacao: isEmpresaLayer,
    
    // Módulos de administração
    empresaManagement: isEscritorioLayer, // Gerenciamento de empresas pelo escritório
    userManagement: isAdminLayer,        // Gerenciamento de usuários pelo admin
    systemSettings: isAdminLayer,        // Configurações do sistema pelo admin
    
    // Ferramentas especiais
    taxCalculator: isClienteLayer,       // Todos os perfis podem acessar a calculadora
    
    // Configurações específicas
    escritorioSettings: isEscritorioLayer, // Configurações do escritório
    empresaSettings: isEmpresaLayer      // Configurações da empresa
  };
  
  // Para o painel principal
  const visiblePanels = {
    // Painéis de Dashboard
    overviewPanel: isClienteLayer,
    fiscalStatusPanel: isEmpresaLayer,
    financeiroStatusPanel: isEmpresaLayer,
    clientesStatusPanel: isEmpresaLayer,
    
    // Painéis Administrativos
    adminStatusPanel: isAdminLayer,
    escritorioStatusPanel: isEscritorioLayer,
    
    // Ações e Botões
    emitirNFButton: isEmpresaLayer,
    gerenciarEmpresasButton: isEscritorioLayer,
    gerenciarUsuariosButton: isAdminLayer
  };
  
  return {
    visibleMenuItems,
    visiblePanels
  };
}