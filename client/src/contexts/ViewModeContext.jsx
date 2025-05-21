import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Definindo as constantes dos modos de visualização aqui para evitar problemas de importação
const VIEW_MODES = {
  ESCRITORIO: 'escritorio',
  EMPRESA: 'empresa',
  CONTADOR: 'contador',
  EXTERNO: 'externo'
};

// Criação do contexto para o modo de visualização
const ViewModeContext = createContext({
  viewMode: 'escritorio', // Modo padrão
  viewModeName: 'Escritório', // Nome amigável
  setViewMode: () => {},
  availableViewModes: [],
  isLoading: true,
  error: null
});

// Hook personalizado para usar o contexto
export const useViewMode = () => useContext(ViewModeContext);

// Componente provedor do contexto
export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewModeState] = useState('escritorio');
  const [viewModeName, setViewModeName] = useState('Escritório');
  const [availableViewModes, setAvailableViewModes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Função para atualizar o modo de visualização
  const setViewMode = (mode) => {
    if (!availableViewModes.find(vm => vm.id === mode)) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar este modo de visualização.',
        variant: 'destructive'
      });
      return;
    }

    // Atualiza o estado local
    setViewModeState(mode);
    
    // Atualiza o nome amigável com base no modo
    const modeName = VIEW_MODES[mode] || 'Desconhecido';
    setViewModeName(modeName);
    
    // Salva a preferência no localStorage
    localStorage.setItem('viewMode', mode);
    
    // Notifica o servidor sobre a mudança (opcional)
    fetch('/api/view-mode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ viewMode: mode }),
    }).catch(err => {
      console.error('Erro ao atualizar modo de visualização no servidor:', err);
    });

    // Exibe toast de confirmação
    toast({
      title: 'Modo de visualização alterado',
      description: `Agora você está no modo ${modeName}`,
    });
  };

  // Carrega os modos de visualização disponíveis para o usuário atual
  useEffect(() => {
    const fetchAvailableViewModes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/view-modes');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar modos de visualização');
        }
        
        const data = await response.json();
        setAvailableViewModes(data.viewModes || []);
        
        // Se tiver um modo salvo no localStorage, use-o (se estiver disponível)
        const savedMode = localStorage.getItem('viewMode');
        if (savedMode && data.viewModes.find(vm => vm.id === savedMode)) {
          setViewMode(savedMode);
        } else if (data.viewModes.length > 0) {
          // Caso contrário, use o primeiro modo disponível
          setViewMode(data.viewModes[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar modos de visualização:', err);
        setError(err.message);
        
        // Fallback para modo padrão se não conseguir carregar
        setViewModeState('escritorio');
        setViewModeName('Escritório');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableViewModes();
  }, []);

  // Valor do contexto
  const contextValue = {
    viewMode,
    viewModeName,
    setViewMode,
    availableViewModes,
    isLoading,
    error
  };

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
};

export default ViewModeContext;