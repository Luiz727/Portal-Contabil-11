import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'wouter';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import NotFound from './pages/NotFound';
import SemPermissao from './pages/SemPermissao';

// Páginas de autenticação
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Dashboard e principais páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Componente de carregamento
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
  </div>
);

const AppRouter: React.FC = () => {
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
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </Route>
        
        {/* Rota padrão - redireciona para o dashboard */}
        <Route path="/">
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </Route>
        
        {/* Rota 404 - Não encontrado */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default AppRouter;