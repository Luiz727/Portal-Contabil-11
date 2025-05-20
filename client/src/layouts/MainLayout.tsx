import { useState, useEffect } from "react";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Para o módulo fiscal, usamos o layout normal com a sidebar
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar em desktop ou tablet */}
      <div className="hidden md:block flex-shrink-0">
        <EnhancedSidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="flex-grow overflow-auto bg-background/40 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
