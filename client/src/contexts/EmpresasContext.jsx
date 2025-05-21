import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useViewMode } from './ViewModeContext';

// Criando o contexto de empresas
const EmpresasContext = createContext({
  empresas: [],
  empresaAtual: null,
  setEmpresaAtual: () => {},
  isLoading: true,
  error: null
});

// Hook para acessar o contexto
export const useEmpresas = () => useContext(EmpresasContext);

// Provedor do contexto
export const EmpresasProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaAtual, setEmpresaAtualState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { viewMode } = useViewMode();
  const { toast } = useToast();

  // Função para selecionar uma empresa
  const setEmpresaAtual = (empresaId) => {
    if (!empresaId) {
      setEmpresaAtualState(null);
      localStorage.removeItem('empresaAtual');
      return;
    }

    const empresa = empresas.find(e => e.id === empresaId);
    if (!empresa) {
      toast({
        title: 'Empresa não encontrada',
        description: 'A empresa selecionada não existe ou você não tem acesso a ela.',
        variant: 'destructive'
      });
      return;
    }

    setEmpresaAtualState(empresa);
    localStorage.setItem('empresaAtual', empresa.id.toString());
    
    // Notificar o servidor sobre a mudança de empresa
    fetch('/api/empresa-atual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empresaId: empresa.id }),
    }).catch(err => {
      console.error('Erro ao atualizar empresa atual no servidor:', err);
    });

    toast({
      title: 'Empresa alterada',
      description: `Você está visualizando dados da empresa ${empresa.nome}`,
    });
  };

  // Buscar lista de empresas quando o modo de visualização mudar
  useEffect(() => {
    const fetchEmpresas = async () => {
      // Apenas buscar empresas se estiver no modo empresa
      if (viewMode !== 'empresa') {
        setEmpresas([]);
        setEmpresaAtualState(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Para desenvolvimento, dados simulados
        const mockEmpresas = [
          { id: 1, nome: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90', cidade: 'São Paulo', uf: 'SP' },
          { id: 2, nome: 'Comércio XYZ Ltda', cnpj: '98.765.432/0001-10', cidade: 'Rio de Janeiro', uf: 'RJ' },
          { id: 3, nome: 'Indústria 123 S/A', cnpj: '45.678.912/0001-34', cidade: 'Belo Horizonte', uf: 'MG' }
        ];
        
        setEmpresas(mockEmpresas);
        
        // Verificar se há empresa salva no localStorage
        const savedEmpresaId = localStorage.getItem('empresaAtual');
        if (savedEmpresaId) {
          const empresaId = parseInt(savedEmpresaId);
          const empresa = mockEmpresas.find(e => e.id === empresaId);
          if (empresa) {
            setEmpresaAtualState(empresa);
          } else if (mockEmpresas.length > 0) {
            setEmpresaAtualState(mockEmpresas[0]);
            localStorage.setItem('empresaAtual', mockEmpresas[0].id.toString());
          }
        } else if (mockEmpresas.length > 0) {
          setEmpresaAtualState(mockEmpresas[0]);
          localStorage.setItem('empresaAtual', mockEmpresas[0].id.toString());
        }
        
        // Em produção, use a API
        /*
        const response = await fetch('/api/empresas');
        if (!response.ok) {
          throw new Error('Falha ao carregar empresas');
        }
        
        const data = await response.json();
        setEmpresas(data.empresas || []);
        
        const savedEmpresaId = localStorage.getItem('empresaAtual');
        if (savedEmpresaId && data.empresas.some(e => e.id === parseInt(savedEmpresaId))) {
          const empresa = data.empresas.find(e => e.id === parseInt(savedEmpresaId));
          setEmpresaAtualState(empresa);
        } else if (data.empresas.length > 0) {
          setEmpresaAtualState(data.empresas[0]);
          localStorage.setItem('empresaAtual', data.empresas[0].id.toString());
        }
        */
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpresas();
  }, [viewMode]);

  const contextValue = {
    empresas,
    empresaAtual,
    setEmpresaAtual,
    isLoading,
    error
  };

  return (
    <EmpresasContext.Provider value={contextValue}>
      {children}
    </EmpresasContext.Provider>
  );
};

export default EmpresasContext;