import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { EmpresasProvider } from "@/contexts/EmpresasContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ViewModeProvider>
      <EmpresasProvider>
        <div className="min-h-screen bg-gray-50">
          <Header onMenuToggle={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="md:pl-64 pt-16 min-h-[calc(100vh-64px)]">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </EmpresasProvider>
    </ViewModeProvider>
  );
};

export default MainLayout;