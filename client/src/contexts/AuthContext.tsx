import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/database';

type ProfileType = Database['public']['Tables']['profiles']['Row'];

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: ProfileType | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: AuthError | null;
    data: {} | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        
        // Se a tabela não existir ou houver outro erro, retornar um perfil padrão
        // para evitar o loading infinito
        if (error.code === '42P01') { // "relation does not exist"
          console.warn('Tabela profiles não existe. Criando perfil padrão temporário.');
          return {
            id: userId,
            role: 'user',
            created_at: new Date().toISOString()
          };
        }
        
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      // Retorna um perfil padrão em caso de erro para evitar loops
      return {
        id: userId,
        role: 'user',
        created_at: new Date().toISOString()
      };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar se já existe uma sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Sessão inicial:', session ? 'Ativa' : 'Inativa');
        setSession(session);
        
        if (session?.user) {
          console.log('Usuário da sessão:', session.user.email);
          setUser(session.user);
          
          console.log('Buscando perfil para o usuário:', session.user.id);
          const userProfile = await fetchProfile(session.user.id);
          console.log('Perfil encontrado:', userProfile ? 'Sim' : 'Não');
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Configurar o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AUTH', event, session ? 'Sessão ativa' : 'Sem sessão');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('AuthStateChange: Buscando perfil para', session.user.email);
          const userProfile = await fetchProfile(session.user.id);
          console.log('AuthStateChange: Perfil carregado:', userProfile ? 'Sim' : 'Não');
          
          if (userProfile) {
            console.log('Role do usuário:', userProfile.role || 'não definida');
          }
          
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Limpeza quando o componente for desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.session?.user) {
        const userProfile = await fetchProfile(data.session.user.id);
        setProfile(userProfile);
      }
      
      return { data: data.session, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data: data.user, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};