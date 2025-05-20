/**
 * Sistema de permissões para o Portal NIXCON
 * Define níveis de acesso e permissões específicas por perfil
 */

// Perfis de usuário
export enum UserRole {
  ADMIN = 'admin',                  // Administrador do Sistema
  ESCRITORIO = 'escritorio',        // Membro do Escritório de Contabilidade
  EMPRESA = 'empresa',              // Empresa Usuária
  CLIENTE = 'cliente'               // Cliente das Empresas Usuárias
}

// Níveis de acesso por módulo
export enum AccessLevel {
  NONE = 0,        // Sem acesso
  READ = 1,        // Acesso de leitura
  WRITE = 2,       // Acesso de escrita
  ADMIN = 3        // Acesso total (incluindo configurações)
}

// Módulos do sistema
export enum SystemModule {
  // Módulos Principais
  DASHBOARD = 'dashboard',
  FISCAL = 'fiscal',
  FINANCEIRO = 'financeiro',
  DOCUMENTOS = 'documentos',
  CLIENTES = 'clientes',
  TAREFAS = 'tarefas',
  WHATSAPP = 'whatsapp',

  // Submódulos Fiscais
  FISCAL_EMISSOR = 'fiscal_emissor',
  FISCAL_DASHBOARD = 'fiscal_dashboard',
  FISCAL_CADASTROS = 'fiscal_cadastros',
  FISCAL_RELATORIOS = 'fiscal_relatorios',
  FISCAL_IMPORTACAO = 'fiscal_importacao',
  FISCAL_AJUSTES = 'fiscal_ajustes',

  // Financeiros
  FLUXO_CAIXA = 'fluxo_caixa',
  CONCILIACAO = 'conciliacao',
  CONTROLE_ESTOQUE = 'controle_estoque',
  
  // Configurações
  SETTINGS = 'settings',
  USER_MANAGEMENT = 'user_management',
  SYSTEM_CONFIG = 'system_config',
  
  // Ferramentas especiais
  TAX_CALCULATOR = 'tax_calculator'
}

// Mapeamento padrão de permissões por perfil
export const DEFAULT_PERMISSIONS: Record<UserRole, Record<SystemModule, AccessLevel>> = {
  // Administrador do Sistema - Acesso total a tudo
  [UserRole.ADMIN]: {
    [SystemModule.DASHBOARD]: AccessLevel.ADMIN,
    [SystemModule.FISCAL]: AccessLevel.ADMIN,
    [SystemModule.FINANCEIRO]: AccessLevel.ADMIN,
    [SystemModule.DOCUMENTOS]: AccessLevel.ADMIN,
    [SystemModule.CLIENTES]: AccessLevel.ADMIN,
    [SystemModule.TAREFAS]: AccessLevel.ADMIN,
    [SystemModule.WHATSAPP]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_EMISSOR]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_DASHBOARD]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_CADASTROS]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_RELATORIOS]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_IMPORTACAO]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_AJUSTES]: AccessLevel.ADMIN,
    [SystemModule.FLUXO_CAIXA]: AccessLevel.ADMIN,
    [SystemModule.CONCILIACAO]: AccessLevel.ADMIN,
    [SystemModule.CONTROLE_ESTOQUE]: AccessLevel.ADMIN,
    [SystemModule.SETTINGS]: AccessLevel.ADMIN,
    [SystemModule.USER_MANAGEMENT]: AccessLevel.ADMIN,
    [SystemModule.SYSTEM_CONFIG]: AccessLevel.ADMIN,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.ADMIN,
  },
  
  // Escritório de Contabilidade - Acesso amplo com algumas restrições
  [UserRole.ESCRITORIO]: {
    [SystemModule.DASHBOARD]: AccessLevel.ADMIN,
    [SystemModule.FISCAL]: AccessLevel.ADMIN,
    [SystemModule.FINANCEIRO]: AccessLevel.ADMIN,
    [SystemModule.DOCUMENTOS]: AccessLevel.ADMIN,
    [SystemModule.CLIENTES]: AccessLevel.ADMIN,
    [SystemModule.TAREFAS]: AccessLevel.ADMIN,
    [SystemModule.WHATSAPP]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_EMISSOR]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_DASHBOARD]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_CADASTROS]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_RELATORIOS]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_IMPORTACAO]: AccessLevel.ADMIN,
    [SystemModule.FISCAL_AJUSTES]: AccessLevel.ADMIN,
    [SystemModule.FLUXO_CAIXA]: AccessLevel.ADMIN,
    [SystemModule.CONCILIACAO]: AccessLevel.ADMIN,
    [SystemModule.CONTROLE_ESTOQUE]: AccessLevel.ADMIN,
    [SystemModule.SETTINGS]: AccessLevel.WRITE,
    [SystemModule.USER_MANAGEMENT]: AccessLevel.WRITE,
    [SystemModule.SYSTEM_CONFIG]: AccessLevel.READ,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.ADMIN,
  },
  
  // Empresa Usuária - Acesso limitado aos seus próprios dados
  [UserRole.EMPRESA]: {
    [SystemModule.DASHBOARD]: AccessLevel.WRITE,
    [SystemModule.FISCAL]: AccessLevel.WRITE,
    [SystemModule.FINANCEIRO]: AccessLevel.WRITE,
    [SystemModule.DOCUMENTOS]: AccessLevel.WRITE,
    [SystemModule.CLIENTES]: AccessLevel.WRITE,
    [SystemModule.TAREFAS]: AccessLevel.WRITE,
    [SystemModule.WHATSAPP]: AccessLevel.WRITE,
    [SystemModule.FISCAL_EMISSOR]: AccessLevel.WRITE,
    [SystemModule.FISCAL_DASHBOARD]: AccessLevel.READ,
    [SystemModule.FISCAL_CADASTROS]: AccessLevel.WRITE,
    [SystemModule.FISCAL_RELATORIOS]: AccessLevel.READ,
    [SystemModule.FISCAL_IMPORTACAO]: AccessLevel.WRITE,
    [SystemModule.FISCAL_AJUSTES]: AccessLevel.READ,
    [SystemModule.FLUXO_CAIXA]: AccessLevel.WRITE,
    [SystemModule.CONCILIACAO]: AccessLevel.READ,
    [SystemModule.CONTROLE_ESTOQUE]: AccessLevel.WRITE,
    [SystemModule.SETTINGS]: AccessLevel.WRITE,
    [SystemModule.USER_MANAGEMENT]: AccessLevel.WRITE,
    [SystemModule.SYSTEM_CONFIG]: AccessLevel.NONE,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.WRITE,
  },
  
  // Cliente - Acesso muito limitado, apenas ao que lhe diz respeito
  [UserRole.CLIENTE]: {
    [SystemModule.DASHBOARD]: AccessLevel.READ,
    [SystemModule.FISCAL]: AccessLevel.NONE,
    [SystemModule.FINANCEIRO]: AccessLevel.NONE,
    [SystemModule.DOCUMENTOS]: AccessLevel.READ,
    [SystemModule.CLIENTES]: AccessLevel.NONE,
    [SystemModule.TAREFAS]: AccessLevel.NONE,
    [SystemModule.WHATSAPP]: AccessLevel.READ,
    [SystemModule.FISCAL_EMISSOR]: AccessLevel.NONE,
    [SystemModule.FISCAL_DASHBOARD]: AccessLevel.NONE,
    [SystemModule.FISCAL_CADASTROS]: AccessLevel.NONE,
    [SystemModule.FISCAL_RELATORIOS]: AccessLevel.NONE,
    [SystemModule.FISCAL_IMPORTACAO]: AccessLevel.NONE,
    [SystemModule.FISCAL_AJUSTES]: AccessLevel.NONE,
    [SystemModule.FLUXO_CAIXA]: AccessLevel.NONE,
    [SystemModule.CONCILIACAO]: AccessLevel.NONE,
    [SystemModule.CONTROLE_ESTOQUE]: AccessLevel.NONE,
    [SystemModule.SETTINGS]: AccessLevel.READ,
    [SystemModule.USER_MANAGEMENT]: AccessLevel.NONE,
    [SystemModule.SYSTEM_CONFIG]: AccessLevel.NONE,
    [SystemModule.TAX_CALCULATOR]: AccessLevel.READ,
  }
};

// Funções de utilidade para verificar permissões

/**
 * Verifica se um usuário tem acesso suficiente a um módulo
 */
export function hasModuleAccess(
  userRole: UserRole,
  module: SystemModule,
  requiredLevel: AccessLevel,
  customPermissions?: Record<SystemModule, AccessLevel>
): boolean {
  // Verifique permissões customizadas primeiro (se fornecidas)
  if (customPermissions && customPermissions[module] !== undefined) {
    return customPermissions[module] >= requiredLevel;
  }
  
  // Caso contrário, use as permissões padrão
  return DEFAULT_PERMISSIONS[userRole][module] >= requiredLevel;
}

/**
 * Verifica se o usuário tem permissão de leitura
 */
export function canRead(
  userRole: UserRole,
  module: SystemModule, 
  customPermissions?: Record<SystemModule, AccessLevel>
): boolean {
  return hasModuleAccess(userRole, module, AccessLevel.READ, customPermissions);
}

/**
 * Verifica se o usuário tem permissão de escrita
 */
export function canWrite(
  userRole: UserRole,
  module: SystemModule,
  customPermissions?: Record<SystemModule, AccessLevel>
): boolean {
  return hasModuleAccess(userRole, module, AccessLevel.WRITE, customPermissions);
}

/**
 * Verifica se o usuário tem permissões administrativas
 */
export function canAdmin(
  userRole: UserRole,
  module: SystemModule,
  customPermissions?: Record<SystemModule, AccessLevel>
): boolean {
  return hasModuleAccess(userRole, module, AccessLevel.ADMIN, customPermissions);
}