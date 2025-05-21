import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Definindo as constantes dos modos de visualização
export const VIEW_MODES = {
  ESCRITORIO: 'escritorio',
  EMPRESA: 'empresa',
  CONTADOR: 'contador',
  EXTERNO: 'externo'
};

// Mapeamento de nomes amigáveis para modos de visualização
export const VIEW_MODE_NAMES = {
  [VIEW_MODES.ESCRITORIO]: 'Escritório',
  [VIEW_MODES.EMPRESA]: 'Empresa',
  [VIEW_MODES.CONTADOR]: 'Contador',
  [VIEW_MODES.EXTERNO]: 'Externo'
};

// Criando o contexto
const ViewModeContext = createContext({
  viewMode: VIEW_MODES.ESCRITORIO,
  viewModeName: VIEW_MODE_NAMES[VIEW_MODES.ESCRITORIO],
  setViewMode: () => {},
  availableViewModes: [],
  isLoading: true,
  error: null
});

// Hook para acessar o contexto
export const useViewMode = () => useContext(ViewModeContext);

// Provedor do contexto
export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewModeState] = useState(VIEW_MODES.ESCRITORIO);
  const [viewModeName, setViewModeName] = useState(VIEW_MODE_NAMES[VIEW_MODES.ESCRITORIO]);
  const [availableViewModes, setAvailableViewModes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const setViewMode = (mode) => {
    if (!availableViewModes.find(vm => vm.id === mode)) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar este modo de visualização.',
        variant: 'destructive'
      });
      return;
    }

    setViewModeState(mode);
    setViewModeName(VIEW_MODE_NAMES[mode] || 'Desconhecido');
    localStorage.setItem('viewMode', mode);
    
    fetch('/api/view-mode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ viewMode: mode }),
    }).catch(err => {
      console.error('Erro ao atualizar modo de visualização no servidor:', err);
    });

    toast({
      title: 'Modo de visualização alterado',
      description: `Agora você está no modo ${VIEW_MODE_NAMES[mode]}`,
    });
  };

  useEffect(() => {
    const fetchAvailableViewModes = async () => {
      setIsLoading(true);
      try {
        // Para desenvolvimento, vamos usar dados simulados
        const mockViewModes = [
          { id: VIEW_MODES.ESCRITORIO, name: VIEW_MODE_NAMES[VIEW_MODES.ESCRITORIO] },
          { id: VIEW_MODES.EMPRESA, name: VIEW_MODE_NAMES[VIEW_MODES.EMPRESA] },
          { id: VIEW_MODES.CONTADOR, name: VIEW_MODE_NAMES[VIEW_MODES.CONTADOR] },
          { id: VIEW_MODES.EXTERNO, name: VIEW_MODE_NAMES[VIEW_MODES.EXTERNO] }
        ];
        
        setAvailableViewModes(mockViewModes);
        
        const savedMode = localStorage.getItem('viewMode');
        if (savedMode && mockViewModes.find(vm => vm.id === savedMode)) {
          setViewMode(savedMode);
        } else if (mockViewModes.length > 0) {
          setViewMode(mockViewModes[0].id);
        }
        
        // Quando a API estiver pronta, descomente o código abaixo
        /*
        const response = await fetch('/api/user/view-modes');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar modos de visualização');
        }
        
        const data = await response.json();
        setAvailableViewModes(data.viewModes || []);
        
        const savedMode = localStorage.getItem('viewMode');
        if (savedMode && data.viewModes.find(vm => vm.id === savedMode)) {
          setViewMode(savedMode);
        } else if (data.viewModes.length > 0) {
          setViewMode(data.viewModes[0].id);
        }
        */
      } catch (err) {
        console.error('Erro ao carregar modos de visualização:', err);
        setError(err.message);
        
        setViewModeState(VIEW_MODES.ESCRITORIO);
        setViewModeName(VIEW_MODE_NAMES[VIEW_MODES.ESCRITORIO]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableViewModes();
  }, []);

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

// Exportamos o contexto para acessar nos componentes que precisam dele
export { ViewModeContext };