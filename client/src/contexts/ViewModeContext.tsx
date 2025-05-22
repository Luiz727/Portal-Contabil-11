import React, { createContext, useContext, useState, useEffect } from 'react';

// Define o tipo para os modos de visualização
export type ViewMode = 'standard' | 'compact' | 'expanded' | 'expert';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa com o modo salvo no localStorage ou o padrão 'standard'
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const savedMode = localStorage.getItem('nixcon-view-mode');
    return (savedMode as ViewMode) || 'standard';
  });

  // Atualiza o localStorage quando o modo é alterado
  useEffect(() => {
    localStorage.setItem('nixcon-view-mode', viewMode);
  }, [viewMode]);

  // Função para atualizar o modo de visualização
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  const value = {
    viewMode,
    setViewMode,
  };

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode deve ser usado dentro de um ViewModeProvider');
  }
  return context;
};