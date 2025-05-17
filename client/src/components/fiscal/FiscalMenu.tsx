import React from 'react';
import FiscalSidebar from './FiscalSidebar';
import FiscalMenuWrapper from './FiscalMenuWrapper';

type FiscalMenuProps = {
  activeSection?: 'dashboard' | 'emissor' | 'ajustes' | 'cadastros' | 'relatorios' | 'importacao' | 'comunicacao';
  children?: React.ReactNode;
};

// Este componente agora serve como um wrapper ao redor da nova barra lateral
// para manter a compatibilidade com o código existente
const FiscalMenu: React.FC<FiscalMenuProps> = ({ activeSection, children }) => {
  // Se children forem fornecidos, use o wrapper com conteúdo
  if (children) {
    return <FiscalMenuWrapper activeSection={activeSection}>{children}</FiscalMenuWrapper>;
  }
  
  // Caso contrário, vamos usar o menu sidebar
  return (
    <div>
      <FiscalSidebar activeSection={activeSection} />
    </div>
  );
};

export default FiscalMenu;