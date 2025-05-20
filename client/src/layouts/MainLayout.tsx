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
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Para o módulo fiscal, usamos apenas o header, sem o sidebar principal
  if (isFiscalModule) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Main content */}
        <main className="flex-grow flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} fiscalModule={true} />
          
          <div className="flex-grow overflow-auto bg-gray-100">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Layout principal com Tailwind
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
      
      {/* Mobile sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:block"
        )}
      >
        <EnhancedSidebar />
      </div>
      
      {/* Main content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="flex-grow overflow-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
