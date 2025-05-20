import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, Calendar, AlertCircle } from 'lucide-react';

/**
 * Dashboard principal do sistema NIXCON
 * Exibe indicadores e acesso rápido às principais funções
 */
const Dashboard = () => {
  // Dados simulados para o dashboard
  const stats = {
    pendingTasks: 5,
    newDocuments: 12,
    upcomingEvents: 3,
    activeClients: 24,
    alerts: 2
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema NIXCON. Aqui está um resumo das suas atividades.
        </p>
      </div>

      {/* Cartões de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTasks > 0 ? '+2 desde ontem' : 'Nenhuma tarefa pendente'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documentos Novos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newDocuments > 0 ? 'Precisam de análise' : 'Todos documentos analisados'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eventos Próximos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Nos próximos 7 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="text-sm flex items-start">
              <span className="bg-red-500 rounded-full h-2 w-2 mt-1.5 mr-2"></span>
              <span>Existem 2 declarações fiscais com prazo próximo ao vencimento</span>
            </li>
            <li className="text-sm flex items-start">
              <span className="bg-red-500 rounded-full h-2 w-2 mt-1.5 mr-2"></span>
              <span>5 notas fiscais pendentes de validação no XML Vault</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Seção específica para superadmin */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Status do Sistema (Superadmin)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Versão do Sistema</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Banco de Dados</span>
                <span className="text-sm text-green-500">Conectado (Supabase)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de Usuários</span>
                <span className="text-sm">35</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Integração Fiscal</span>
                <span className="text-sm text-green-500">Ativa</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 px-4 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                Gerenciar Usuários
              </button>
              <button className="py-2 px-4 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                Configurações
              </button>
              <button className="py-2 px-4 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                Backup do Sistema
              </button>
              <button className="py-2 px-4 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                Logs do Sistema
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;