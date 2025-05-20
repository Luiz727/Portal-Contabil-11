import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import EnhancedSidebar from "@/components/EnhancedSidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const isFiscalModule = location.startsWith('/fiscal');

  // Verifica a rota atual para determinar se precisa de autenticação
  const isCalculatorPage = location === '/tax-calculator' || location === '/calculadora-nixcon';
  const isCalendarPage = location === '/calendar';
  
  useEffect(() => {
    // Não redireciona se for a página da calculadora de impostos
    if (!isLoading && !isAuthenticated && !isCalculatorPage) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate, isCalculatorPage]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle mobile sidebar display
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mantemos o mesmo layout para todas as páginas, incluindo a calculadora
  // Não precisamos mais de um layout especial para a calculadora

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Para outras páginas, exige autenticação
  if (!isAuthenticated) {
    return null;
  }

  // Layout unificado para todas as páginas, incluindo calculadora e módulo fiscal
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar default */}
      <div className="hidden md:block">
        <EnhancedSidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-500/50 md:hidden backdrop-blur-sm" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <main className="flex-grow flex flex-col overflow-hidden hide-scrollbar">
        <style>
          {`
          /* Ocultar barras de rolagem em toda a aplicação */
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          `}
        </style>
        
        {/* Header padrão */}
        <Header onMenuToggle={toggleSidebar} />
        
        <div className="flex-grow overflow-auto bg-slate-50 p-4 md:p-6 lg:p-8 hide-scrollbar">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
        
        {/* Footer com informações de copyright */}
        <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">
                <span className="nixcon-gold">NIX</span>
                <span className="nixcon-gray">CON</span>
              </span> © {new Date().getFullYear()} Todos os direitos reservados.
            </div>
            <div className="text-xs hidden md:block">
              v1.0.0
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
