import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useEmpresas } from './EmpresasContext';
import type { Database } from '../types/database';

// Definir tipos baseados na estrutura do banco de dados
interface ProdutoType {
  id: number;
  nome: string;
  descricao?: string;
  codigo: string;
  preco: number;
  ncm?: string;
  unidade?: string;
  empresa_id: number;
  created_at?: string;
  updated_at?: string;
  active: boolean;
}

interface ProdutosContextType {
  produtos: ProdutoType[];
  isLoading: boolean;
  error: string | null;
  atualizarProdutos: () => Promise<void>;
  adicionarProduto: (produto: Omit<ProdutoType, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editarProduto: (id: number, dados: Partial<ProdutoType>) => Promise<void>;
  excluirProduto: (id: number) => Promise<void>;
}

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined);

export const ProdutosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { empresaAtual } = useEmpresas();

  const carregarProdutos = async () => {
    if (!isAuthenticated || !empresaAtual) {
      setProdutos([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaAtual.id)
        .eq('active', true)
        .order('nome');

      if (error) {
        throw error;
      }

      setProdutos(data || []);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao buscar produtos';
      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar produtos quando o usuário autenticar ou a empresa mudar
  useEffect(() => {
    carregarProdutos();
  }, [isAuthenticated, empresaAtual]);

  // Recarregar lista de produtos
  const atualizarProdutos = async () => {
    await carregarProdutos();
  };

  // Adicionar um novo produto
  const adicionarProduto = async (produto: Omit<ProdutoType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('produtos')
        .insert([{ ...produto, active: true }])
        .select();

      if (error) {
        throw error;
      }

      await carregarProdutos();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao adicionar produto';
      setError(mensagem);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Editar um produto existente
  const editarProduto = async (id: number, dados: Partial<ProdutoType>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('produtos')
        .update(dados)
        .eq('id', id);

      if (error) {
        throw error;
      }

      await carregarProdutos();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao editar produto';
      setError(mensagem);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir um produto (soft delete)
  const excluirProduto = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('produtos')
        .update({ active: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await carregarProdutos();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao excluir produto';
      setError(mensagem);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    produtos,
    isLoading,
    error,
    atualizarProdutos,
    adicionarProduto,
    editarProduto,
    excluirProduto,
  };

  return <ProdutosContext.Provider value={value}>{children}</ProdutosContext.Provider>;
};

export const useProdutos = (): ProdutosContextType => {
  const context = useContext(ProdutosContext);
  if (context === undefined) {
    throw new Error('useProdutos deve ser usado dentro de um ProdutosProvider');
  }
  return context;
};