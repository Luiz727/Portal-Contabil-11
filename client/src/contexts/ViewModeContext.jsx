import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const VIEW_MODES = {
  ESCRITORIO: 'escritorio',
  EMPRESA: 'empresa',
  CONTADOR: 'contador',
  EXTERNO: 'externo'
};

const ViewModeContext = createContext({
  viewMode: 'escritorio',
  viewModeName: 'Escritório',
  setViewMode: () => {},
  availableViewModes: [],
  isLoading: true,
  error: null
});

export const useViewMode = () => useContext(ViewModeContext);

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewModeState] = useState('escritorio');
  const [viewModeName, setViewModeName] = useState('Escritório');
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
    
    const modeName = VIEW_MODES[mode] || 'Desconhecido';
    setViewModeName(modeName);
    
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
      description: `Agora você está no modo ${modeName}`,
    });
  };

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
        
        const savedMode = localStorage.getItem('viewMode');
        if (savedMode && data.viewModes.find(vm => vm.id === savedMode)) {
          setViewMode(savedMode);
        } else if (data.viewModes.length > 0) {
          setViewMode(data.viewModes[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar modos de visualização:', err);
        setError(err.message);
        
        setViewModeState('escritorio');
        setViewModeName('Escritório');
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

export default ViewModeContext;