import React, { lazy, Suspense } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Componente de carregamento
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
  </div>
);

// Páginas com carregamento lazy
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SemPermissao = lazy(() => import('./pages/SemPermissao'));

// Páginas administrativas
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const CompanySettings = lazy(() => import('./pages/admin/CompanySettings'));

// Páginas de módulos
const FiscalPage = lazy(() => import('./pages/FiscalPage'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Billing = lazy(() => import('./pages/Billing'));
const Integrations = lazy(() => import('./pages/Integrations'));
const WhatsApp = lazy(() => import('./pages/WhatsApp'));
const Reconciliation = lazy(() => import('./pages/Reconciliation'));

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {/* Rotas públicas - autenticação */}
        <Route path="/login">
          <AuthLayout>
            <Login />
          </AuthLayout>
        </Route>
        <Route path="/register">
          <AuthLayout>
            <Register />
          </AuthLayout>
        </Route>
        <Route path="/forgot-password">
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        </Route>
        
        {/* Página de acesso negado */}
        <Route path="/sem-permissao">
          <SemPermissao />
        </Route>
        
        {/* Rotas protegidas - principal */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Módulo Fiscal */}
        <Route path="/fiscal">
          <ProtectedRoute>
            <MainLayout>
              <FiscalPage />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Relatórios */}
        <Route path="/reports">
          <ProtectedRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Configurações */}
        <Route path="/settings">
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Faturamento */}
        <Route path="/billing">
          <ProtectedRoute>
            <MainLayout>
              <Billing />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Integrações */}
        <Route path="/integrations">
          <ProtectedRoute>
            <MainLayout>
              <Integrations />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* WhatsApp */}
        <Route path="/whatsapp">
          <ProtectedRoute>
            <MainLayout>
              <WhatsApp />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Reconciliação */}
        <Route path="/reconciliation">
          <ProtectedRoute>
            <MainLayout>
              <Reconciliation />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Rotas administrativas */}
        <Route path="/admin/users">
          <ProtectedRoute roles={['admin', 'superadmin']}>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/company">
          <ProtectedRoute roles={['admin', 'superadmin']}>
            <MainLayout>
              <CompanySettings />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Rota padrão - redireciona para o dashboard se autenticado */}
        <Route path="/">
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        </Route>
        
        {/* Rota 404 - Não encontrado */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default Routes;