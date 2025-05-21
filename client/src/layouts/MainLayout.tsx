import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Função para verificar se a tela é mobile
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  // Inicializa e configura o listener para redimensionamento
  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Função para fechar a sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      
      <main className="flex flex-1">
        {/* Sidebar fixa no desktop, modal no mobile */}
        <Sidebar 
          isMobile={isMobile} 
          isOpen={isMobile ? sidebarOpen : true} 
          closeSidebar={closeSidebar} 
        />
        
        {/* Área de conteúdo principal */}
        <div 
          className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'}`}
        >
          <div className="container mx-auto p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;