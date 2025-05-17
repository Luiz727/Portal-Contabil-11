import React from 'react';
import FiscalSidebar from './FiscalSidebar';

type FiscalMenuProps = {
  activeSection?: 'dashboard' | 'emissor' | 'ajustes' | 'cadastros' | 'relatorios' | 'importacao' | 'comunicacao';
  children?: React.ReactNode;
};

// Este componente serve como um wrapper para manter a compatibilidade com código existente
// enquanto implementamos a nova navegação por sidebar
const FiscalMenuWrapper: React.FC<FiscalMenuProps> = ({ activeSection = 'dashboard', children }) => {
  return (
    <div className="flex">
      <FiscalSidebar activeSection={activeSection} />
      <div className={`flex-1 ml-[64px] transition-all`} style={{ marginLeft: 'var(--sidebar-width, 64px)' }}>
        <div className="container mx-auto py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FiscalMenuWrapper;