import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tipos de modos de visualização suportados
export type ViewMode = 'simple' | 'advanced' | 'expert';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAdvancedMode: () => boolean;
  isExpertMode: () => boolean;
  isSimpleMode: () => boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('simple');

  const isAdvancedMode = () => viewMode === 'advanced';
  const isExpertMode = () => viewMode === 'expert';
  const isSimpleMode = () => viewMode === 'simple';

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode,
        isAdvancedMode,
        isExpertMode,
        isSimpleMode
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};