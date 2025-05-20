import React, { useEffect } from 'react';
import FiscalSidebar from './FiscalSidebar';

type FiscalMenuProps = {
  activeSection?: 'dashboard' | 'emissor' | 'ajustes' | 'cadastros' | 'relatorios' | 'importacao' | 'comunicacao';
  children?: React.ReactNode;
};

// Este componente serve como um wrapper para manter a compatibilidade com código existente
// enquanto implementamos a nova navegação por sidebar
const FiscalMenuWrapper: React.FC<FiscalMenuProps> = ({ activeSection = 'dashboard', children }) => {
  // Define CSS variables para o tamanho do sidebar
  useEffect(() => {
    const isSidebarCollapsed = localStorage.getItem('fiscalMenuCollapsed');
    const sidebarWidth = isSidebarCollapsed === 'true' ? '64px' : '250px';
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    
    return () => {
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <FiscalSidebar activeSection={activeSection} />
      <div 
        className="flex-1 pt-[64px] transition-all duration-300 overflow-auto w-full" 
        style={{ marginLeft: 'var(--sidebar-width, 250px)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default FiscalMenuWrapper;