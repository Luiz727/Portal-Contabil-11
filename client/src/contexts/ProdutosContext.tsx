import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Tipo para produto
export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string;
  preco: number;
  unidade: string;
  categoria?: string;
  ncm?: string;
  cest?: string;
  status: 'ativo' | 'inativo';
  estoque?: {
    quantidade: number;
    minimo?: number;
    maximo?: number;
  };
  impostos?: {
    icms?: number;
    ipi?: number;
    pis?: number;
    cofins?: number;
  };
}

interface ProdutosContextType {
  produtos: Produto[];
  loading: boolean;
  error: string | null;
  fetchProdutos: () => Promise<void>;
  getProduto: (id: number) => Produto | undefined;
  addProduto: (produto: Omit<Produto, 'id'>) => Promise<Produto>;
  updateProduto: (id: number, produto: Partial<Produto>) => Promise<Produto>;
  deleteProduto: (id: number) => Promise<void>;
  searchProdutos: (query: string) => Produto[];
}

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined);

interface ProdutosProviderProps {
  children: ReactNode;
}

export const ProdutosProvider: React.FC<ProdutosProviderProps> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutos = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // const response = await axios.get('/api/produtos');
      // setProdutos(response.data);
      
      // Dados de exemplo para desenvolvimento
      const mockProdutos: Produto[] = [
        {
          id: 1,
          nome: 'Notebook Profissional',
          codigo: 'NOTE001',
          descricao: 'Notebook com processador i7, 16GB RAM, SSD 512GB',
          preco: 4999.99,
          unidade: 'UN',
          categoria: 'Eletrônicos',
          ncm: '8471.30.19',
          cest: '2102100',
          status: 'ativo',
          estoque: {
            quantidade: 15,
            minimo: 5,
            maximo: 30
          },
          impostos: {
            icms: 18,
            ipi: 10,
            pis: 1.65,
            cofins: 7.6
          }
        },
        {
          id: 2,
          nome: 'Monitor 24"',
          codigo: 'MON24',
          descricao: 'Monitor LED 24 polegadas Full HD',
          preco: 899.90,
          unidade: 'UN',
          categoria: 'Eletrônicos',
          ncm: '8528.52.20',
          status: 'ativo',
          estoque: {
            quantidade: 20,
            minimo: 5
          },
          impostos: {
            icms: 18,
            pis: 1.65,
            cofins: 7.6
          }
        },
        {
          id: 3,
          nome: 'Mouse Sem Fio',
          codigo: 'MOUSE01',
          descricao: 'Mouse óptico sem fio com bateria recarregável',
          preco: 99.90,
          unidade: 'UN',
          categoria: 'Periféricos',
          ncm: '8471.60.53',
          status: 'ativo',
          estoque: {
            quantidade: 50,
            minimo: 10,
            maximo: 100
          }
        }
      ];
      
      setProdutos(mockProdutos);
    } catch (err) {
      setError('Erro ao carregar produtos.');
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProduto = (id: number): Produto | undefined => {
    return produtos.find(produto => produto.id === id);
  };

  const addProduto = async (produto: Omit<Produto, 'id'>): Promise<Produto> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // const response = await axios.post('/api/produtos', produto);
      // const newProduto = response.data;
      
      // Simulação da resposta para desenvolvimento
      const newProduto: Produto = {
        ...produto as Produto,
        id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
        status: produto.status || 'ativo'
      };
      
      setProdutos(prevProdutos => [...prevProdutos, newProduto]);
      return newProduto;
    } catch (err) {
      setError('Erro ao adicionar produto.');
      console.error('Erro ao adicionar produto:', err);
      throw new Error('Falha ao adicionar produto');
    } finally {
      setLoading(false);
    }
  };

  const updateProduto = async (id: number, produtoData: Partial<Produto>): Promise<Produto> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // const response = await axios.put(`/api/produtos/${id}`, produtoData);
      // const updatedProduto = response.data;
      
      // Simulação da atualização para desenvolvimento
      const index = produtos.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Produto não encontrado');
      }
      
      const updatedProduto: Produto = {
        ...produtos[index],
        ...produtoData
      };
      
      const updatedProdutos = [...produtos];
      updatedProdutos[index] = updatedProduto;
      
      setProdutos(updatedProdutos);
      return updatedProduto;
    } catch (err) {
      setError('Erro ao atualizar produto.');
      console.error('Erro ao atualizar produto:', err);
      throw new Error('Falha ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduto = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // await axios.delete(`/api/produtos/${id}`);
      
      // Simulação da exclusão para desenvolvimento
      setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
    } catch (err) {
      setError('Erro ao excluir produto.');
      console.error('Erro ao excluir produto:', err);
      throw new Error('Falha ao excluir produto');
    } finally {
      setLoading(false);
    }
  };

  const searchProdutos = (query: string): Produto[] => {
    if (!query || query.trim() === '') {
      return produtos;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    return produtos.filter(produto => 
      produto.nome.toLowerCase().includes(normalizedQuery) || 
      produto.codigo.toLowerCase().includes(normalizedQuery) || 
      (produto.descricao && produto.descricao.toLowerCase().includes(normalizedQuery)) ||
      (produto.categoria && produto.categoria.toLowerCase().includes(normalizedQuery))
    );
  };

  // Carregar produtos ao montar o componente
  useEffect(() => {
    fetchProdutos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProdutosContext.Provider
      value={{
        produtos,
        loading,
        error,
        fetchProdutos,
        getProduto,
        addProduto,
        updateProduto,
        deleteProduto,
        searchProdutos
      }}
    >
      {children}
    </ProdutosContext.Provider>
  );
};

export const useProdutos = (): ProdutosContextType => {
  const context = useContext(ProdutosContext);
  if (context === undefined) {
    throw new Error('useProdutos must be used within a ProdutosProvider');
  }
  return context;
};