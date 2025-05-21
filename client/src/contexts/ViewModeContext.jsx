import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de visualização disponíveis
export const VIEW_MODES = {
  ACCOUNTING_OFFICE: 'accounting_office',  // Escritório contábil
  CLIENT_COMPANY: 'client_company',       // Empresa cliente
  EXTERNAL_ACCOUNTANT: 'external_accountant', // Contador externo
  EXTERNAL_USER: 'external_user'          // Usuário externo de módulos específicos
};

// Nomes amigáveis para exibição
export const VIEW_MODE_NAMES = {
  [VIEW_MODES.ACCOUNTING_OFFICE]: 'Visão do Escritório',
  [VIEW_MODES.CLIENT_COMPANY]: 'Visão da Empresa Cliente',
  [VIEW_MODES.EXTERNAL_ACCOUNTANT]: 'Visão de Contador Externo',
  [VIEW_MODES.EXTERNAL_USER]: 'Visão de Usuário Externo'
};

// Contexto para o modo de visualização
const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  // Estado para armazenar o modo de visualização atual
  const [viewMode, setViewMode] = useState(VIEW_MODES.ACCOUNTING_OFFICE);
  // Estado para armazenar a empresa atual (quando estiver visualizando como empresa)
  const [currentCompany, setCurrentCompany] = useState(null);
  
  // Carrega as preferências salvas ao inicializar
  useEffect(() => {
    const savedViewMode = localStorage.getItem('nixcon_view_mode');
    const savedCompany = localStorage.getItem('nixcon_current_company');
    
    if (savedViewMode && Object.values(VIEW_MODES).includes(savedViewMode)) {
      setViewMode(savedViewMode);
    }
    
    if (savedCompany) {
      try {
        setCurrentCompany(JSON.parse(savedCompany));
      } catch (error) {
        console.error('Erro ao carregar a empresa salva:', error);
        localStorage.removeItem('nixcon_current_company');
      }
    }
  }, []);
  
  // Função para alterar o modo de visualização
  const changeViewMode = (newMode, company = null) => {
    if (Object.values(VIEW_MODES).includes(newMode)) {
      setViewMode(newMode);
      localStorage.setItem('nixcon_view_mode', newMode);
      
      // Se estiver mudando para visão de empresa e tiver uma empresa específica
      if (newMode === VIEW_MODES.CLIENT_COMPANY && company) {
        setCurrentCompany(company);
        localStorage.setItem('nixcon_current_company', JSON.stringify(company));
      }
    }
  };
  
  // Valor do contexto que será disponibilizado
  const contextValue = {
    viewMode,
    currentCompany,
    changeViewMode,
    setCurrentCompany,
    viewModeName: VIEW_MODE_NAMES[viewMode]
  };
  
  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode deve ser usado dentro de um ViewModeProvider');
  }
  return context;
};