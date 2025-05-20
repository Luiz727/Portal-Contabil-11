import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const isFiscalModule = location.startsWith('/fiscal');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Para o módulo fiscal, usamos apenas o header, sem o sidebar principal
  if (isFiscalModule) {
    return (
      <div className="d-flex h-100 overflow-hidden">
        {/* Main content */}
        <main className="flex-grow-1 d-flex flex-column overflow-hidden">
          <Header toggleSidebar={toggleSidebar} fiscalModule={true} />
          
          <div className="flex-grow-1 overflow-auto bg-light">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Para os outros módulos, mantemos o layout original com Bootstrap 5
  return (
    <div className="d-flex h-100 overflow-hidden">
      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="position-fixed top-0 start-0 bottom-0 end-0 z-index-1040 d-md-none">
          <div 
            className="position-fixed top-0 start-0 bottom-0 end-0 bg-dark opacity-50"
            onClick={toggleSidebar}
          ></div>
          <div className="position-relative z-index-1050">
            <EnhancedSidebar />
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="d-none d-md-block">
        <EnhancedSidebar />
      </div>
      
      {/* Main content */}
      <main className="flex-grow-1 d-flex flex-column overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="flex-grow-1 overflow-auto bg-light p-3 p-sm-4 p-lg-5">
          {children}
        </div>
      </main>
    </div>
  );
}
