import React from 'react';
import { Switch, Route, Router } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Páginas
import LoginPage from '@/pages/LoginPage';
import TaxCalculatorPage from '@/pages/TaxCalculatorPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Rotas públicas */}
          <Route path="/login" component={LoginPage} />
          <Route path="/tax-calculator" component={TaxCalculatorPage} />
          
          {/* Rota padrão - redireciona para calculadora */}
          <Route path="/">
            <TaxCalculatorPage />
          </Route>
          
          {/* Rota para qualquer caminho desconhecido */}
          <Route>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
                <p className="text-gray-600 mb-6">O caminho que você está procurando não existe.</p>
                <a href="/" className="text-primary hover:underline">Voltar para a página inicial</a>
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
      
      {/* Sistema de notificações */}
      <Toaster />
    </AuthProvider>
  );
};

export default App;