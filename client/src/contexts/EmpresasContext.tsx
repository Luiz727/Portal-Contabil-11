import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import type { Database } from '../types/database';

type EmpresaType = Database['public']['Tables']['empresas']['Row'];

interface EmpresasContextType {
  empresas: EmpresaType[];
  empresaAtual: EmpresaType | null;
  isLoading: boolean;
  error: string | null;
  setEmpresaAtual: (empresa: EmpresaType) => void;
  atualizarEmpresas: () => Promise<void>;
  adicionarEmpresa: (empresa: Omit<EmpresaType, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editarEmpresa: (id: number, dados: Partial<EmpresaType>) => Promise<void>;
  excluirEmpresa: (id: number) => Promise<void>;
}

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

export const EmpresasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<EmpresaType[]>([]);
  const [empresaAtual, setEmpresaAtualState] = useState<EmpresaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const carregarEmpresas = async () => {
    if (!isAuthenticated || !user) {
      setEmpresas([]);
      setEmpresaAtualState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('active', true)
        .order('nome');

      if (error) {
        throw error;
      }

      setEmpresas(data || []);

      if (data && data.length > 0 && !empresaAtual) {
        const savedEmpresaId = localStorage.getItem('empresaAtualId');
        
        if (savedEmpresaId) {
          const savedEmpresa = data.find(empresa => empresa.id.toString() === savedEmpresaId);
          if (savedEmpresa) {
            setEmpresaAtualState(savedEmpresa);
          } else {
            setEmpresaAtualState(data[0]);
            localStorage.setItem('empresaAtualId', data[0].id.toString());
          }
        } else {
          setEmpresaAtualState(data[0]);
          localStorage.setItem('empresaAtualId', data[0].id.toString());
        }
      } else if (data && data.length === 0) {
        setEmpresaAtualState(null);
        localStorage.removeItem('empresaAtualId');
      }
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao buscar empresas';
      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar empresas quando o usuário autenticar
  useEffect(() => {
    carregarEmpresas();
  }, [isAuthenticated, user]);

  // Atualizar a empresa atual
  const setEmpresaAtual = (empresa: EmpresaType) => {
    setEmpresaAtualState(empresa);
    localStorage.setItem('empresaAtualId', empresa.id.toString());
  };

  // Recarregar lista de empresas
  const atualizarEmpresas = async () => {
    await carregarEmpresas();
  };

  // Adicionar uma nova empresa
  const adicionarEmpresa = async (empresa: Omit<EmpresaType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('empresas')
        .insert([{ ...empresa, active: true }])
        .select();

      if (error) {
        throw error;
      }

      await carregarEmpresas();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao adicionar empresa';
      setError(mensagem);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Editar uma empresa existente
  const editarEmpresa = async (id: number, dados: Partial<EmpresaType>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('empresas')
        .update(dados)
        .eq('id', id);

      if (error) {
        throw error;
      }

      await carregarEmpresas();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao editar empresa';
      setError(mensagem);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir uma empresa (soft delete)
  const excluirEmpresa = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('empresas')
        .update({ active: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await carregarEmpresas();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao excluir empresa';
      setError(mensagem);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    empresas,
    empresaAtual,
    isLoading,
    error,
    setEmpresaAtual,
    atualizarEmpresas,
    adicionarEmpresa,
    editarEmpresa,
    excluirEmpresa,
  };

  return <EmpresasContext.Provider value={value}>{children}</EmpresasContext.Provider>;
};

export const useEmpresas = (): EmpresasContextType => {
  const context = useContext(EmpresasContext);
  if (context === undefined) {
    throw new Error('useEmpresas deve ser usado dentro de um EmpresasProvider');
  }
  return context;
};