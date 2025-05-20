/**
 * Configuração para conexão com o Supabase
 * Implementa integração segura com o banco de dados e autenticação
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';
import * as dotenv from 'dotenv';

dotenv.config();

// Validação das variáveis de ambiente críticas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    'Credenciais do Supabase não encontradas. Configure SUPABASE_URL e SUPABASE_ANON_KEY nas variáveis de ambiente.'
  );
}

// Criação do cliente do Supabase para uso em toda a aplicação
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: {
        'x-application-name': 'NIXCON-SistemaContabilidade',
      },
    },
  }
);

/**
 * Inicializa um usuário superadmin se não existir
 * Esta função deve ser executada apenas durante a configuração inicial do sistema
 */
export async function initializeSuperAdmin() {
  // Verificar se o superadmin já existe
  const { data: existingAdmin, error: queryError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', 'adm@nixcon.com.br')
    .single();

  if (queryError && queryError.code !== 'PGRST116') {
    console.error('Erro ao verificar superadmin existente:', queryError);
    return false;
  }

  // Se o superadmin já existe, não fazer nada
  if (existingAdmin) {
    console.log('Superadmin já existe, não é necessário criar');
    return true;
  }

  // Se chegou aqui, precisamos criar o superadmin
  console.log('Criando usuário superadmin...');
  
  try {
    // Criar o usuário na autenticação do Supabase
    // Nota: Em produção, você deve usar uma senha segura e mudar após a primeira configuração
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'adm@nixcon.com.br',
      password: process.env.SUPERADMIN_INITIAL_PASSWORD || 'NixconAdminTemporal@2025',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrador NIXCON',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Erro ao criar usuário superadmin na autenticação:', authError);
      return false;
    }

    // Inserir dados na tabela de usuários
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email: 'adm@nixcon.com.br',
        firstName: 'Administrador',
        lastName: 'NIXCON',
        role: 'admin',
        isSuperAdmin: true,
      })
      .select()
      .single();

    if (userError) {
      console.error('Erro ao inserir superadmin na tabela de usuários:', userError);
      return false;
    }

    console.log('Superadmin criado com sucesso:', userData);
    return true;
  } catch (error) {
    console.error('Erro não esperado ao criar superadmin:', error);
    return false;
  }
}

/**
 * Verificar se um usuário tem acesso a uma empresa específica
 */
export async function verificarAcessoEmpresa(userId: string, empresaId: string): Promise<boolean> {
  // Verificar se é superadmin ou admin
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('role, is_super_admin, empresa_id, escritorio_id')
    .eq('id', userId)
    .single();

  if (!usuario) return false;

  // Superadmin ou admin tem acesso a tudo
  if (usuario.is_super_admin || usuario.role === 'admin') {
    return true;
  }

  // Usuário do escritório tem acesso a todas as empresas do escritório
  if (usuario.role === 'escritorio') {
    const { data: empresa } = await supabase
      .from('empresas')
      .select('escritorio_id')
      .eq('id', empresaId)
      .single();

    return empresa?.escritorio_id === usuario.escritorio_id;
  }

  // Usuário da empresa só tem acesso à própria empresa
  if (usuario.role === 'empresa') {
    return usuario.empresa_id === empresaId;
  }

  // Cliente não tem acesso direto às empresas
  return false;
}

/**
 * Consultar permissões de um usuário
 */
export async function consultarPermissoesUsuario(userId: string) {
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('role, is_super_admin, custom_permissions')
    .eq('id', userId)
    .single();

  if (!usuario) return null;

  // Se for superadmin, retorna todas as permissões
  if (usuario.is_super_admin) {
    return {
      role: 'admin',
      isSuperAdmin: true,
      customPermissions: null, // Superadmin tem todas as permissões por padrão
      hasFullAccess: true
    };
  }

  return {
    role: usuario.role,
    isSuperAdmin: false,
    customPermissions: usuario.custom_permissions ? JSON.parse(usuario.custom_permissions) : null,
    hasFullAccess: usuario.role === 'admin'
  };
}