import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
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
import { useAuth } from "@/hooks/useAuth";

// Páginas do Módulo Fiscal
import FiscalDashboard from "@/pages/fiscal/FiscalDashboard";
import EmissaoNFe from "@/pages/fiscal/emissor/EmissaoNFe";
import ConfiguracaoEmpresa from "@/pages/fiscal/ajustes/ConfiguracaoEmpresa";
import CertificadoDigital from "@/pages/fiscal/ajustes/CertificadoDigital";
import ConsultarDocumentos from "@/pages/fiscal/emissor/ConsultarDocumentos";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated && <Route path="/" component={Login} />}
      
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
      
      {/* Rotas do Módulo Fiscal */}
      {isAuthenticated && (
        <Route path="/fiscal">
          <MainLayout>
            <FiscalDashboard />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/fiscal/emissor/nfe">
          <MainLayout>
            <EmissaoNFe />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/fiscal/ajustes/empresa">
          <MainLayout>
            <ConfiguracaoEmpresa />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/fiscal/ajustes/certificado">
          <MainLayout>
            <CertificadoDigital />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/fiscal/emissor/consultar">
          <MainLayout>
            <ConsultarDocumentos />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
