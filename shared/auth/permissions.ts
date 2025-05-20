/**
 * Sistema de permissões em camadas para o NIXCON
 * Define as permissões para cada tipo de usuário no sistema
 */

// Tipos de usuário no sistema
export enum UserRole {
  SUPERADMIN = 'superadmin',   // Administrador do sistema (adm@nixcon.com.br)
  ADMIN = 'admin',             // Administrador do escritório
  ESCRITORIO = 'escritorio',   // Funcionário do escritório de contabilidade
  EMPRESA = 'empresa',         // Empresa usuária (cliente do escritório)
  CLIENTE = 'cliente'          // Cliente final (cliente da empresa usuária)
}

// Interface para permissões em cada módulo
export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve?: boolean;
  export?: boolean;
  admin?: boolean;
}

// Definição dos módulos do sistema
export enum SystemModule {
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

// Mapeamento de permissões por tipo de usuário e módulo
export const rolePermissions: Record<UserRole, Record<SystemModule, ModulePermissions>> = {
  [UserRole.SUPERADMIN]: {
    // Superadmin tem acesso total a todos os módulos
    [SystemModule.DASHBOARD]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.FISCAL]: { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true },
    [SystemModule.FINANCEIRO]: { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true },
    [SystemModule.DOCUMENTOS]: { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true },
    [SystemModule.CLIENTES]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.EMPRESAS]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.USUARIOS]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.TAREFAS]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.CALENDARIO]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.HONORARIOS]: { view: true, create: true, edit: true, delete: true, approve: true, admin: true },
    [SystemModule.INVENTARIO]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.CONFIGURACOES]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.XML_VAULT]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.WHATSAPP]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.TAX_CALCULATOR]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.BACKUP]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.AUDIT]: { view: true, create: true, edit: true, delete: true, admin: true }
  },
  
  [UserRole.ADMIN]: {
    // Admin do escritório tem acesso quase total
    [SystemModule.DASHBOARD]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.FISCAL]: { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true },
    [SystemModule.FINANCEIRO]: { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true },
    [SystemModule.DOCUMENTOS]: { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true },
    [SystemModule.CLIENTES]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.EMPRESAS]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.USUARIOS]: { view: true, create: true, edit: true, delete: false, admin: false },
    [SystemModule.TAREFAS]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.CALENDARIO]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.HONORARIOS]: { view: true, create: true, edit: true, delete: true, approve: true, admin: true },
    [SystemModule.INVENTARIO]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.CONFIGURACOES]: { view: true, create: true, edit: true, delete: false, admin: false },
    [SystemModule.XML_VAULT]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.WHATSAPP]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.TAX_CALCULATOR]: { view: true, create: true, edit: true, delete: true, admin: true },
    [SystemModule.BACKUP]: { view: true, create: true, edit: false, delete: false, admin: false },
    [SystemModule.AUDIT]: { view: true, create: false, edit: false, delete: false, admin: false }
  },
  
  [UserRole.ESCRITORIO]: {
    // Funcionários do escritório têm acesso operacional
    [SystemModule.DASHBOARD]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.FISCAL]: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
    [SystemModule.FINANCEIRO]: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
    [SystemModule.DOCUMENTOS]: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
    [SystemModule.CLIENTES]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.EMPRESAS]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.USUARIOS]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.TAREFAS]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.CALENDARIO]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.HONORARIOS]: { view: true, create: true, edit: true, delete: false, approve: false },
    [SystemModule.INVENTARIO]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.CONFIGURACOES]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.XML_VAULT]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.WHATSAPP]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.TAX_CALCULATOR]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.BACKUP]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.AUDIT]: { view: false, create: false, edit: false, delete: false }
  },
  
  [UserRole.EMPRESA]: {
    // Empresas usuárias têm acesso aos seus próprios dados
    [SystemModule.DASHBOARD]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.FISCAL]: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
    [SystemModule.FINANCEIRO]: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
    [SystemModule.DOCUMENTOS]: { view: true, create: true, edit: false, delete: false, approve: false, export: true },
    [SystemModule.CLIENTES]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.EMPRESAS]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.USUARIOS]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.TAREFAS]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.CALENDARIO]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.HONORARIOS]: { view: true, create: false, edit: false, delete: false, approve: false },
    [SystemModule.INVENTARIO]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.CONFIGURACOES]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.XML_VAULT]: { view: true, create: true, edit: false, delete: false },
    [SystemModule.WHATSAPP]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.TAX_CALCULATOR]: { view: true, create: true, edit: true, delete: false },
    [SystemModule.BACKUP]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.AUDIT]: { view: false, create: false, edit: false, delete: false }
  },
  
  [UserRole.CLIENTE]: {
    // Clientes finais têm acesso mínimo
    [SystemModule.DASHBOARD]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.FISCAL]: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    [SystemModule.FINANCEIRO]: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
    [SystemModule.DOCUMENTOS]: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
    [SystemModule.CLIENTES]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.EMPRESAS]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.USUARIOS]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.TAREFAS]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.CALENDARIO]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.HONORARIOS]: { view: false, create: false, edit: false, delete: false, approve: false },
    [SystemModule.INVENTARIO]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.CONFIGURACOES]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.XML_VAULT]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.WHATSAPP]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.TAX_CALCULATOR]: { view: true, create: false, edit: false, delete: false },
    [SystemModule.BACKUP]: { view: false, create: false, edit: false, delete: false },
    [SystemModule.AUDIT]: { view: false, create: false, edit: false, delete: false }
  }
};

/**
 * Verifica se um usuário tem permissão para uma ação em um módulo específico
 * @param role Papel do usuário
 * @param module Módulo do sistema
 * @param action Ação a ser verificada
 * @returns true se tem permissão, false caso contrário
 */
export function hasPermission(role: UserRole, module: SystemModule, action: keyof ModulePermissions): boolean {
  const modulePermissions = rolePermissions[role]?.[module];
  
  if (!modulePermissions) {
    return false;
  }
  
  return modulePermissions[action] || false;
}

/**
 * Verifica se o usuário é superadmin pelo email
 * @param email Email do usuário
 * @returns true se for superadmin, false caso contrário
 */
export function isSuperAdmin(email: string): boolean {
  return email === 'adm@nixcon.com.br';
}

/**
 * Determina o papel do usuário com base nos dados
 * @param userData Dados do usuário
 * @returns O papel determinado
 */
export function determineUserRole(userData: any): UserRole {
  const email = userData?.email;
  
  if (isSuperAdmin(email)) {
    return UserRole.SUPERADMIN;
  }
  
  // Outros casos com base no campo role
  const role = userData?.role?.toLowerCase();
  
  if (role === 'admin') return UserRole.ADMIN;
  if (role === 'escritorio') return UserRole.ESCRITORIO;
  if (role === 'empresa') return UserRole.EMPRESA;
  
  // Por padrão, assume o nível mais baixo de acesso
  return UserRole.CLIENTE;
}