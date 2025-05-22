import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Tipo para empresa
export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  regime_tributario?: string;
  status: 'ativo' | 'inativo';
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
}

interface EmpresasContextType {
  empresas: Empresa[];
  selectedEmpresa: Empresa | null;
  loading: boolean;
  error: string | null;
  fetchEmpresas: () => Promise<void>;
  selectEmpresa: (empresa: Empresa) => void;
  addEmpresa: (empresa: Omit<Empresa, 'id'>) => Promise<Empresa>;
  updateEmpresa: (id: number, empresa: Partial<Empresa>) => Promise<Empresa>;
  deleteEmpresa: (id: number) => Promise<void>;
}

const EmpresasContext = createContext<EmpresasContextType | undefined>(undefined);

interface EmpresasProviderProps {
  children: ReactNode;
}

export const EmpresasProvider: React.FC<EmpresasProviderProps> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpresas = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // const response = await axios.get('/api/empresas');
      // setEmpresas(response.data);
      
      // Dados de exemplo para desenvolvimento
      const mockEmpresas: Empresa[] = [
        {
          id: 1,
          nome: 'Empresa Modelo LTDA',
          cnpj: '12.345.678/0001-99',
          email: 'contato@empresamodelo.com.br',
          telefone: '(11) 3456-7890',
          regime_tributario: 'Simples Nacional',
          status: 'ativo',
          endereco: {
            logradouro: 'Av. Paulista',
            numero: '1000',
            complemento: 'Sala 123',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01310-100'
          }
        },
        {
          id: 2,
          nome: 'Empresa Exemplo S.A.',
          cnpj: '98.765.432/0001-10',
          email: 'contato@empresaexemplo.com.br',
          telefone: '(11) 2345-6789',
          regime_tributario: 'Lucro Presumido',
          status: 'ativo',
          endereco: {
            logradouro: 'Rua Augusta',
            numero: '500',
            bairro: 'Consolação',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01304-000'
          }
        }
      ];
      
      setEmpresas(mockEmpresas);
      
      // Seleciona a primeira empresa por padrão se ainda não houver uma selecionada
      if (!selectedEmpresa && mockEmpresas.length > 0) {
        setSelectedEmpresa(mockEmpresas[0]);
      }
    } catch (err) {
      setError('Erro ao carregar empresas.');
      console.error('Erro ao carregar empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectEmpresa = (empresa: Empresa): void => {
    setSelectedEmpresa(empresa);
    // Salvar a preferência no localStorage ou em um cookie
    localStorage.setItem('selectedEmpresaId', empresa.id.toString());
  };

  const addEmpresa = async (empresa: Omit<Empresa, 'id'>): Promise<Empresa> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // const response = await axios.post('/api/empresas', empresa);
      // const newEmpresa = response.data;
      
      // Simulação da resposta para desenvolvimento
      const newEmpresa: Empresa = {
        ...empresa as Empresa,
        id: empresas.length > 0 ? Math.max(...empresas.map(e => e.id)) + 1 : 1,
        status: empresa.status || 'ativo'
      };
      
      setEmpresas(prevEmpresas => [...prevEmpresas, newEmpresa]);
      return newEmpresa;
    } catch (err) {
      setError('Erro ao adicionar empresa.');
      console.error('Erro ao adicionar empresa:', err);
      throw new Error('Falha ao adicionar empresa');
    } finally {
      setLoading(false);
    }
  };

  const updateEmpresa = async (id: number, empresaData: Partial<Empresa>): Promise<Empresa> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // const response = await axios.put(`/api/empresas/${id}`, empresaData);
      // const updatedEmpresa = response.data;
      
      // Simulação da atualização para desenvolvimento
      const index = empresas.findIndex(e => e.id === id);
      if (index === -1) {
        throw new Error('Empresa não encontrada');
      }
      
      const updatedEmpresa: Empresa = {
        ...empresas[index],
        ...empresaData
      };
      
      const updatedEmpresas = [...empresas];
      updatedEmpresas[index] = updatedEmpresa;
      
      setEmpresas(updatedEmpresas);
      
      // Atualiza a empresa selecionada se for a mesma que está sendo editada
      if (selectedEmpresa && selectedEmpresa.id === id) {
        setSelectedEmpresa(updatedEmpresa);
      }
      
      return updatedEmpresa;
    } catch (err) {
      setError('Erro ao atualizar empresa.');
      console.error('Erro ao atualizar empresa:', err);
      throw new Error('Falha ao atualizar empresa');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmpresa = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada API - substituir pela implementação real
      // await axios.delete(`/api/empresas/${id}`);
      
      // Simulação da exclusão para desenvolvimento
      setEmpresas(prevEmpresas => prevEmpresas.filter(empresa => empresa.id !== id));
      
      // Se a empresa excluída for a selecionada, seleciona outra ou limpa a seleção
      if (selectedEmpresa && selectedEmpresa.id === id) {
        const remainingEmpresas = empresas.filter(empresa => empresa.id !== id);
        if (remainingEmpresas.length > 0) {
          setSelectedEmpresa(remainingEmpresas[0]);
        } else {
          setSelectedEmpresa(null);
        }
      }
    } catch (err) {
      setError('Erro ao excluir empresa.');
      console.error('Erro ao excluir empresa:', err);
      throw new Error('Falha ao excluir empresa');
    } finally {
      setLoading(false);
    }
  };

  // Carregar empresas ao montar o componente
  useEffect(() => {
    fetchEmpresas();
    
    // Tenta restaurar a empresa selecionada do localStorage
    const savedEmpresaId = localStorage.getItem('selectedEmpresaId');
    if (savedEmpresaId) {
      const empresaId = parseInt(savedEmpresaId, 10);
      // Aguarda o carregamento das empresas antes de tentar restaurar a seleção
      const intervalId = setInterval(() => {
        if (empresas.length > 0) {
          const empresa = empresas.find(e => e.id === empresaId);
          if (empresa) {
            setSelectedEmpresa(empresa);
          }
          clearInterval(intervalId);
        }
      }, 100);
      
      // Limpa o intervalo após 5 segundos se as empresas não forem carregadas
      setTimeout(() => clearInterval(intervalId), 5000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        selectedEmpresa,
        loading,
        error,
        fetchEmpresas,
        selectEmpresa,
        addEmpresa,
        updateEmpresa,
        deleteEmpresa
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

export const useEmpresas = (): EmpresasContextType => {
  const context = useContext(EmpresasContext);
  if (context === undefined) {
    throw new Error('useEmpresas must be used within an EmpresasProvider');
  }
  return context;
};