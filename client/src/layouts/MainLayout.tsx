import React, { ReactNode } from 'react';
import LayeredNavigation from '@/components/LayeredNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal do sistema NIXCON
 * Exibe a navegação lateral baseada no nível de acesso e o conteúdo principal
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Barra lateral com navegação por camadas */}
      <div className="w-64 shrink-0">
        <LayeredNavigation />
      </div>
      
      {/* Área de conteúdo principal */}
      <div className="flex-grow p-6 overflow-auto bg-gray-50">
        <div className="container mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;