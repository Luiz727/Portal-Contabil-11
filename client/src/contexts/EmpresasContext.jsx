import React, { createContext, useContext, useState, useEffect } from 'react';
import { useViewMode } from './ViewModeContext';
import { useToast } from '../hooks/use-toast';

// Criação do contexto para empresas
const EmpresasContext = createContext({
  empresas: [],
  empresaAtual: null,
  setEmpresaAtual: () => {},
  isLoading: true,
  error: null
});

// Hook personalizado para usar o contexto
export const useEmpresas = () => useContext(EmpresasContext);

// Componente provedor do contexto
export const EmpresasProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaAtual, setEmpresaAtualState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { viewMode } = useViewMode();
  const { toast } = useToast();

  // Função para atualizar a empresa atual
  const setEmpresaAtual = (empresaId) => {
    // Verifica se a empresa selecionada existe na lista
    const empresa = empresas.find(e => e.id === empresaId);
    
    if (!empresa) {
      toast({
        title: 'Empresa não encontrada',
        description: 'A empresa selecionada não está disponível.',
        variant: 'destructive'
      });
      return;
    }

    // Atualiza o estado local
    setEmpresaAtualState(empresa);
    
    // Salva a preferência no localStorage
    localStorage.setItem('empresaAtual', empresaId.toString());
    
    // Notifica o servidor sobre a mudança (opcional)
    fetch('/api/empresa-atual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empresaId }),
    }).catch(err => {
      console.error('Erro ao atualizar empresa atual no servidor:', err);
    });

    // Exibe toast de confirmação
    toast({
      title: 'Empresa alterada',
      description: `Agora você está visualizando ${empresa.nome}`,
    });
  };

  // Carrega a lista de empresas disponíveis para o usuário
  useEffect(() => {
    const fetchEmpresas = async () => {
      // Só carrega as empresas quando estiver no modo 'empresa'
      if (viewMode !== 'empresa') {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/empresas');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar empresas');
        }
        
        const data = await response.json();
        setEmpresas(data.empresas || []);
        
        // Se tiver uma empresa salva no localStorage, use-a (se estiver disponível)
        const savedEmpresaId = localStorage.getItem('empresaAtual');
        
        if (savedEmpresaId && data.empresas.find(e => e.id === parseInt(savedEmpresaId))) {
          setEmpresaAtual(parseInt(savedEmpresaId));
        } else if (data.empresas.length > 0) {
          // Caso contrário, use a primeira empresa disponível
          setEmpresaAtual(data.empresas[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpresas();
  }, [viewMode]); // Recarrega quando o modo de visualização muda

  // Valor do contexto
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