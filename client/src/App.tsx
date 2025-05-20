import React from 'react';
import { Switch, Route, Router } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

// Páginas
import LoginPage from '@/pages/LoginPage';
import TaxCalculatorPage from '@/pages/TaxCalculatorPage';

// Componente de navegação em camadas
import LayeredNavigation from '@/components/LayeredNavigation';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Rotas públicas */}
          <Route path="/login" component={LoginPage} />
          <Route path="/tax-calculator" component={TaxCalculatorPage} />
          
          {/* Rotas protegidas com navegação em camadas */}
          <Route path="/dashboard">
            <div className="flex h-screen overflow-hidden">
              <div className="w-64 h-full">
                <LayeredNavigation />
              </div>
              <main className="flex-1 overflow-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard NIXCON</h1>
                <p className="text-gray-600">Bem-vindo ao sistema de gestão NIXCON.</p>
              </main>
            </div>
          </Route>
          
          <Route path="/fiscal">
            <div className="flex h-screen overflow-hidden">
              <div className="w-64 h-full">
                <LayeredNavigation />
              </div>
              <main className="flex-1 overflow-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Módulo Fiscal</h1>
                <p className="text-gray-600">Gerenciamento de documentos fiscais e obrigações tributárias.</p>
              </main>
            </div>
          </Route>
          
          <Route path="/financeiro">
            <div className="flex h-screen overflow-hidden">
              <div className="w-64 h-full">
                <LayeredNavigation />
              </div>
              <main className="flex-1 overflow-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Financeiro</h1>
                <p className="text-gray-600">Controle financeiro e gestão de pagamentos.</p>
              </main>
            </div>
          </Route>
          
          <Route path="/documentos">
            <div className="flex h-screen overflow-hidden">
              <div className="w-64 h-full">
                <LayeredNavigation />
              </div>
              <main className="flex-1 overflow-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Documentos</h1>
                <p className="text-gray-600">Gerenciamento de documentos e arquivos da empresa.</p>
              </main>
            </div>
          </Route>
          
          {/* Rota padrão - redireciona para dashboard com navegação em camadas */}
          <Route path="/">
            <div className="flex h-screen overflow-hidden">
              <div className="w-64 h-full">
                <LayeredNavigation />
              </div>
              <main className="flex-1 overflow-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard NIXCON</h1>
                <p className="text-gray-600">Bem-vindo ao sistema de gestão NIXCON.</p>
              </main>
            </div>
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