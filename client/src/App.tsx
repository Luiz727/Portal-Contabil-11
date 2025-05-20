import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./bootstrap"; // Importa o JavaScript do Bootstrap
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import LoginPage from "@/pages/LoginPage";
import Tasks from "@/pages/Tasks";
import Clients from "@/pages/Clients";
import Documents from "@/pages/Documents";
import Invoices from "@/pages/Invoices";
import Financial from "@/pages/Financial";
import Inventory from "@/pages/Inventory";
import Reconciliation from "@/pages/Reconciliation";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Integrations from "@/pages/Integrations";
import WhatsApp from "@/pages/WhatsApp";
import MainLayout from "@/layouts/MainLayout";
// Vamos temporariamente remover a importação que está causando problemas
// import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Novo módulo fiscal integrado
import FiscalPage from "@/pages/FiscalPage";

// Calculadora de impostos
import TaxCalculatorPage from "@/pages/TaxCalculatorPage";

// Páginas administrativas
import ConfiguracoesAdminPage from "@/pages/admin/ConfiguracoesAdminPage";

// Contextos
import { EmpresasProvider } from "@/contexts/EmpresasContext";
import { ProdutosProvider } from "@/contexts/ProdutosContext";

function Router() {
  // Vamos utilizar uma versão simplificada para evitar erros sem o contexto completo
  // Em produção, isso será substituído pelo contexto real de autenticação
  const { isAuthenticated, isLoading } = { isAuthenticated: false, isLoading: false };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated && <Route path="/" component={LoginPage} />}
      
      {isAuthenticated && (
        <Route path="/">
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/tasks">
          <MainLayout>
            <Tasks />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/clients">
          <MainLayout>
            <Clients />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/documents">
          <MainLayout>
            <Documents />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/invoices">
          <MainLayout>
            <Invoices />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/tax-calculator">
          <MainLayout>
            <TaxCalculatorPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/financial">
          <MainLayout>
            <Financial />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/inventory">
          <MainLayout>
            <Inventory />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/reconciliation">
          <MainLayout>
            <Reconciliation />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/reports">
          <MainLayout>
            <Reports />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/settings">
          <MainLayout>
            <Settings />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/integrations">
          <MainLayout>
            <Integrations />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/whatsapp">
          <MainLayout>
            <WhatsApp />
          </MainLayout>
        </Route>
      )}
      
      {/* Módulo Fiscal Integrado */}
      {isAuthenticated && (
        <Route path="/fiscal">
          <MainLayout>
            <FiscalPage />
          </MainLayout>
        </Route>
      )}
      
      {/* Páginas Administrativas */}
      {isAuthenticated && (
        <Route path="/admin/configuracoes">
          <MainLayout>
            <ConfiguracoesAdminPage />
          </MainLayout>
        </Route>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EmpresasProvider>
          <ProdutosProvider>
            <Toaster />
            <Router />
          </ProdutosProvider>
        </EmpresasProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
