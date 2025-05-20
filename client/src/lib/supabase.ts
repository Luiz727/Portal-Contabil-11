/**
 * Cliente Supabase para front-end
 * Configura conexão segura com o Supabase e funções de autenticação
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem ser definidas'
  );
}

// Criação do cliente Supabase para uso no frontend
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

/**
 * Hook para gerenciar sessão do usuário com Supabase
 */
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (!session?.user) {
      return null;
    }
    
    // Buscar dados completos do usuário na tabela usuarios
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError);
      return null;
    }
    
    // Formatar dados do usuário para uso na aplicação
    return {
      id: usuario.id,
      email: usuario.email,
      firstName: usuario.first_name,
      lastName: usuario.last_name,
      profileImageUrl: usuario.profile_image_url,
      role: usuario.role,
      empresaId: usuario.empresa_id,
      escritorioId: usuario.escritorio_id,
      isSuperAdmin: usuario.is_super_admin,
      customPermissions: usuario.custom_permissions ? JSON.parse(usuario.custom_permissions) : null
    };
  } catch (error) {
    console.error('Erro ao obter sessão do usuário:', error);
    return null;
  }
}

/**
 * Login com email/senha
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

/**
 * Logout do usuário
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
}

/**
 * Verificar se o usuário atual tem acesso a uma empresa específica
 */
export async function verificarAcessoEmpresa(empresaId: string) {
  try {
    const { data, error } = await supabase.rpc('has_empresa_access', {
      empresa_id: empresaId
    });
    
    if (error) {
      console.error('Erro ao verificar acesso à empresa:', error);
      return false;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao verificar acesso à empresa:', error);
    return false;
  }
}

/**
 * Verificar se o usuário é superadmin
 */
export async function isSuperAdmin() {
  const user = await getCurrentUser();
  return user?.isSuperAdmin || false;
}

/**
 * Verificar se o usuário pertence ao escritório de contabilidade
 */
export async function isEscritorioUser() {
  const user = await getCurrentUser();
  return user?.role === 'escritorio' || user?.role === 'admin' || user?.isSuperAdmin || false;
}