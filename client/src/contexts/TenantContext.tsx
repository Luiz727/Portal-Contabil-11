import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import type { Database } from '../types/database';

type EmpresaType = Database['public']['Tables']['empresas']['Row'];

interface TenantContextType {
  currentEmpresa: EmpresaType | null;
  empresas: EmpresaType[];
  isLoading: boolean;
  error: string | null;
  setCurrentEmpresa: (empresa: EmpresaType) => void;
  refreshEmpresas: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEmpresa, setCurrentEmpresa] = useState<EmpresaType | null>(null);
  const [empresas, setEmpresas] = useState<EmpresaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchEmpresas = async () => {
    if (!isAuthenticated || !user) {
      setEmpresas([]);
      setCurrentEmpresa(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Buscar todas as empresas associadas ao usuário atual
      // Ou todas as empresas se for administrador
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('active', true)
        .order('nome');

      if (error) {
        throw error;
      }

      setEmpresas(data || []);

      // Se houver empresas e nenhuma for selecionada, selecione a primeira
      if (data && data.length > 0 && !currentEmpresa) {
        // Verificar se há uma empresa salva na localStorage
        const savedEmpresaId = localStorage.getItem('currentEmpresaId');
        if (savedEmpresaId) {
          const savedEmpresa = data.find(empresa => empresa.id.toString() === savedEmpresaId);
          if (savedEmpresa) {
            setCurrentEmpresa(savedEmpresa);
          } else {
            setCurrentEmpresa(data[0]);
            localStorage.setItem('currentEmpresaId', data[0].id.toString());
          }
        } else {
          setCurrentEmpresa(data[0]);
          localStorage.setItem('currentEmpresaId', data[0].id.toString());
        }
      } else if (data && data.length === 0) {
        setCurrentEmpresa(null);
        localStorage.removeItem('currentEmpresaId');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar empresas';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para carregar as empresas quando o usuário autenticar
  useEffect(() => {
    fetchEmpresas();
  }, [isAuthenticated, user]);

  // Função para atualizar a empresa atual
  const handleSetCurrentEmpresa = (empresa: EmpresaType) => {
    setCurrentEmpresa(empresa);
    localStorage.setItem('currentEmpresaId', empresa.id.toString());
  };

  // Função para recarregar as empresas
  const refreshEmpresas = async () => {
    await fetchEmpresas();
  };

  const value = {
    currentEmpresa,
    empresas,
    isLoading,
    error,
    setCurrentEmpresa: handleSetCurrentEmpresa,
    refreshEmpresas
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};