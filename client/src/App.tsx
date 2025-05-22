import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./bootstrap"; // Importa o JavaScript do Bootstrap
import AppRouter from './AppRouter';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from "./contexts/AuthContext";
import { TenantProvider } from "./contexts/TenantContext";
import { ViewModeProvider } from "./contexts/ViewModeContext";
import { EmpresasProvider } from "./contexts/EmpresasContext";
import { ProdutosProvider } from "./contexts/ProdutosContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AuthProvider>
            <TenantProvider>
              <EmpresasProvider>
                <ProdutosProvider>
                  <ViewModeProvider>
                    <Toaster />
                    <AppRouter />
                  </ViewModeProvider>
                </ProdutosProvider>
              </EmpresasProvider>
            </TenantProvider>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;