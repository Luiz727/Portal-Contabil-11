import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart2, Users, FileText, Calculator, Bell, Calendar, DollarSign, PlusCircle } from 'lucide-react';

const NIXCONDashboard = () => {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState('all');
  
  // Dados simulados para o dashboard
  const statsData = {
    pendingTasks: 3,
    newDocuments: 7,
    upcomingEvents: 2,
    recentNotifications: 2
  };

  // Função para criar um novo documento/tarefa
  const handleCreateTask = () => {
    console.log('Criar nova tarefa');
  };

  return (
    <div className="nixcon-container nixcon-py-4">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-700 mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500">Visão geral das atividades do escritório</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <select 
            className="text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#d9bb42] focus:border-[#d9bb42]"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="all">Todas as Empresas</option>
            <option value="group1">Grupo Aurora</option>
            <option value="group2">Holding XYZ</option>
          </select>
          
          <button 
            className="flex items-center justify-center gap-2 bg-[#d9bb42] text-white py-2 px-4 rounded-md text-sm font-medium"
            onClick={handleCreateTask}
          >
            <PlusCircle size={16} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10">
              <FileText className="text-[#d9bb42]" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Documentos Novos</p>
              <h3 className="text-2xl font-semibold text-gray-700">{statsData.newDocuments}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10">
              <Users className="text-[#d9bb42]" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tarefas Pendentes</p>
              <h3 className="text-2xl font-semibold text-gray-700">{statsData.pendingTasks}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10">
              <Calendar className="text-[#d9bb42]" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Eventos Próximos</p>
              <h3 className="text-2xl font-semibold text-gray-700">{statsData.upcomingEvents}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10">
              <Bell className="text-[#d9bb42]" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Notificações</p>
              <h3 className="text-2xl font-semibold text-gray-700">{statsData.recentNotifications}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Acesso Rápido */}
      <div className="nixcon-card mb-6">
        <h2 className="nixcon-subtitle mb-4">Acesso Rápido</h2>
        <div className="nixcon-grid nixcon-grid-sm-2 nixcon-grid-md-3 nixcon-grid-lg-7 nixcon-gap-3">
          <a href="/clients" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24">
            <Users size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Clientes</span>
          </a>
          
          <a href="/documents" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24">
            <FileText size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Documentos</span>
          </a>
          
          <a href="/tasks" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24">
            <Calendar size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Tarefas</span>
          </a>
          
          <a href="/financial" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24">
            <DollarSign size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Financeiro</span>
          </a>
          
          <a href="/fiscal" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24 nixcon-bg-primary/5">
            <BarChart2 size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Módulo Fiscal</span>
          </a>
          
          <a href="/tax-calculator" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24">
            <Calculator size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Calculadora</span>
          </a>
          
          <a href="/invoices" className="nixcon-card flex flex-col items-center justify-center p-4 hover:nixcon-bg-primary/5 text-center h-24">
            <FileText size={24} className="nixcon-text-primary mb-2" />
            <span className="text-sm font-medium nixcon-text-secondary">Notas Fiscais</span>
          </a>
        </div>
      </div>
      
      {/* Layout de 2 colunas para informações recentes */}
      <div className="nixcon-grid nixcon-grid-md-2 nixcon-gap-6">
        {/* Tarefas Recentes */}
        <div className="nixcon-card nixcon-dashboard-card">
          <div className="nixcon-dashboard-card-header nixcon-flex nixcon-justify-between nixcon-items-center">
            <h3 className="nixcon-subtitle">Tarefas Recentes</h3>
            <a href="/tasks" className="nixcon-btn-link">Ver todas</a>
          </div>
          <div className="nixcon-dashboard-card-body">
            {statsData.pendingTasks > 0 ? (
              <ul className="space-y-3">
                <li className="nixcon-p-2 hover:nixcon-bg-primary/5 rounded-md">
                  <div className="nixcon-flex nixcon-items-center">
                    <div className="nixcon-flex nixcon-items-center nixcon-justify-center rounded-full w-8 h-8 nixcon-bg-primary/10 mr-3">
                      <FileText className="nixcon-text-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium nixcon-text-secondary">Revisar Balancete - Empresa Alpha</p>
                      <p className="text-xs text-gray-500">Vence em: 21/05/2025</p>
                    </div>
                    <span className="nixcon-badge nixcon-badge-primary text-xs">Médio</span>
                  </div>
                </li>
                <li className="nixcon-p-2 hover:nixcon-bg-primary/5 rounded-md">
                  <div className="nixcon-flex nixcon-items-center">
                    <div className="nixcon-flex nixcon-items-center nixcon-justify-center rounded-full w-8 h-8 nixcon-bg-primary/10 mr-3">
                      <FileText className="nixcon-text-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium nixcon-text-secondary">Entregar DEFIS - Comércio Beta</p>
                      <p className="text-xs text-gray-500">Vence em: 25/05/2025</p>
                    </div>
                    <span className="nixcon-badge nixcon-badge-primary text-xs">Alta</span>
                  </div>
                </li>
                <li className="nixcon-p-2 hover:nixcon-bg-primary/5 rounded-md">
                  <div className="nixcon-flex nixcon-items-center">
                    <div className="nixcon-flex nixcon-items-center nixcon-justify-center rounded-full w-8 h-8 nixcon-bg-primary/10 mr-3">
                      <FileText className="nixcon-text-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium nixcon-text-secondary">Conferência Tributária - Grupo Delta</p>
                      <p className="text-xs text-gray-500">Vence em: 30/05/2025</p>
                    </div>
                    <span className="nixcon-badge nixcon-badge-primary text-xs">Baixa</span>
                  </div>
                </li>
              </ul>
            ) : (
              <div className="nixcon-flex nixcon-flex-col nixcon-items-center nixcon-justify-center py-4">
                <FileText className="nixcon-text-primary mb-2" size={32} />
                <p className="text-sm text-gray-500">Nenhuma tarefa pendente</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Documentos Recentes */}
        <div className="nixcon-card nixcon-dashboard-card">
          <div className="nixcon-dashboard-card-header nixcon-flex nixcon-justify-between nixcon-items-center">
            <h3 className="nixcon-subtitle">Documentos Recentes</h3>
            <a href="/documents" className="nixcon-btn-link">Ver todos</a>
          </div>
          <div className="nixcon-dashboard-card-body">
            {statsData.newDocuments > 0 ? (
              <ul className="space-y-3">
                <li className="nixcon-p-2 hover:nixcon-bg-primary/5 rounded-md">
                  <div className="nixcon-flex nixcon-items-center">
                    <div className="nixcon-flex nixcon-items-center nixcon-justify-center rounded-full w-8 h-8 nixcon-bg-primary/10 mr-3">
                      <FileText className="nixcon-text-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium nixcon-text-secondary">NFe 001234 - Venda de Produtos</p>
                      <p className="text-xs text-gray-500">Recebido em: 19/05/2025</p>
                    </div>
                    <span className="text-xs text-gray-500">Empresa Alpha</span>
                  </div>
                </li>
                <li className="nixcon-p-2 hover:nixcon-bg-primary/5 rounded-md">
                  <div className="nixcon-flex nixcon-items-center">
                    <div className="nixcon-flex nixcon-items-center nixcon-justify-center rounded-full w-8 h-8 nixcon-bg-primary/10 mr-3">
                      <FileText className="nixcon-text-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium nixcon-text-secondary">Contrato de Locação - Sede Comercial</p>
                      <p className="text-xs text-gray-500">Recebido em: 18/05/2025</p>
                    </div>
                    <span className="text-xs text-gray-500">Holding XYZ</span>
                  </div>
                </li>
                <li className="nixcon-p-2 hover:nixcon-bg-primary/5 rounded-md">
                  <div className="nixcon-flex nixcon-items-center">
                    <div className="nixcon-flex nixcon-items-center nixcon-justify-center rounded-full w-8 h-8 nixcon-bg-primary/10 mr-3">
                      <FileText className="nixcon-text-primary" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium nixcon-text-secondary">Extrato Bancário - Maio/2025</p>
                      <p className="text-xs text-gray-500">Recebido em: 17/05/2025</p>
                    </div>
                    <span className="text-xs text-gray-500">Comércio Beta</span>
                  </div>
                </li>
              </ul>
            ) : (
              <div className="nixcon-flex nixcon-flex-col nixcon-items-center nixcon-justify-center py-4">
                <FileText className="nixcon-text-primary mb-2" size={32} />
                <p className="text-sm text-gray-500">Nenhum documento novo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NIXCONDashboard;