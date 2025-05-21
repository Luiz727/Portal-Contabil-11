import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./bootstrap"; // Importa o JavaScript do Bootstrap
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import NIXCONDashboard from "@/pages/NIXCONDashboard";
import LoginPage from "@/pages/LoginPage";
import SemPermissaoPage from "@/pages/SemPermissaoPage";
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
import ImpostometroPage from "./pages/ImpostometroPage";
import MainLayout from "@/layouts/MainLayout";
import { useAuth, AuthProvider } from "./contexts/AuthContext";

// Novo módulo fiscal integrado
import FiscalPage from "@/pages/FiscalPage";
import FiscalPageResponsivo from "./pages/FiscalPageResponsivo";

// Calculadora de impostos
import TaxCalculatorPage from "@/pages/TaxCalculatorPage";
import TaxCalculatorNIXCONPage from "./pages/TaxCalculatorNIXCONPage";

// Páginas administrativas
import ConfiguracoesAdminPage from "@/pages/admin/ConfiguracoesAdminPage";
import ConfiguracoesEmpresaPage from "@/pages/admin/ConfiguracoesEmpresaPage";
import ProdutosUniversaisPage from "./pages/admin/ProdutosUniversaisPage";
import ImportacaoProdutosPage from "./pages/admin/ImportacaoProdutosPage";
import PlanosAssinaturasPage from "./pages/admin/PlanosAssinaturasPage";
import EmpresasUsuariasPage from "./pages/admin/EmpresasUsuariasPage";
import PainelAdministrativoPage from "./pages/admin/PainelAdministrativoPage";
import UsuariosPermissoesPage from "./pages/admin/UsuariosPermissoesPage";
import SuperAdminPage from "./pages/admin/SuperAdminPage";

// Contextos
import { EmpresasProvider } from "./contexts/EmpresasContext";
import { ProdutosProvider } from "./contexts/ProdutosContext";
import { ViewModeProvider } from "./contexts/ViewModeContext";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

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
      {!isAuthenticated && <Route path="/login" component={LoginPage} />}

      {isAuthenticated && (
        <Route path="/">
          <MainLayout>
            <NIXCONDashboard />
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

      {/* Página de invoices foi removida conforme solicitado */}

      {/* A calculadora agora só é acessível com autenticação */}
      {isAuthenticated && (
        <Route path="/tax-calculator">
          <MainLayout>
            <TaxCalculatorPage />
          </MainLayout>
        </Route>
      )}

      {/* Nova rota NIXCON da calculadora com autenticação */}
      {isAuthenticated && (
        <Route path="/calculadora-nixcon">
          <TaxCalculatorNIXCONPage />
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

      {/* Impostômetro */}
      {isAuthenticated && (
        <Route path="/impostometro">
          <MainLayout>
            <ImpostometroPage />
          </MainLayout>
        </Route>
      )}

      {/* Módulo Fiscal Integrado - Versão Responsiva */}
      {isAuthenticated && (
        <Route path="/fiscal">
          <MainLayout>
            <FiscalPageResponsivo />
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
      
      {isAuthenticated && (
        <Route path="/admin/painel">
          <MainLayout>
            <PainelAdministrativoPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/empresas-usuarias">
          <MainLayout>
            <EmpresasUsuariasPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/produtos-universais">
          <MainLayout>
            <ProdutosUniversaisPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/importar-produtos">
          <MainLayout>
            <ImportacaoProdutosPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/planos">
          <MainLayout>
            <PlanosAssinaturasPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/usuarios">
          <MainLayout>
            <UsuariosPermissoesPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/configuracoes-empresa">
          <MainLayout>
            <ConfiguracoesEmpresaPage />
          </MainLayout>
        </Route>
      )}
      
      {isAuthenticated && (
        <Route path="/admin/superadmin">
          <SuperAdminPage />
        </Route>
      )}

      {/* Página de acesso negado/sem permissão */}
      <Route path="/sem-permissao">
        <SemPermissaoPage />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ViewModeProvider>
            <EmpresasProvider>
              <ProdutosProvider>
                <Toaster />
                <Router />
              </ProdutosProvider>
            </EmpresasProvider>
          </ViewModeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;