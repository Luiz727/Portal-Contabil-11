import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, Calendar, AlertCircle, ReceiptText, Building, CreditCard, Calculator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/layouts/MainLayout';

/**
 * Dashboard principal do sistema NIXCON
 * Exibe indicadores e acesso rápido às principais funções
 * Os painéis são adaptados de acordo com o nível de acesso do usuário
 */
const Dashboard = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'superadmin';
  
  // Dados simulados para o dashboard
  const stats = {
    pendingTasks: 5,
    newDocuments: 12,
    upcomingEvents: 3,
    activeClients: 24,
    pendingInvoices: 8,
    expiringCertificates: 2,
    unresolvedIssues: 3,
    pendingApprovals: 4
  };

  // Componente de estatística simples
  const StatCard = ({ title, value, icon, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema NIXCON. Aqui está um resumo das suas atividades.
          </p>
        </div>

        {/* Cartões de estatísticas - visíveis para todos os usuários */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tarefas Pendentes"
            value={stats.pendingTasks}
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            description={stats.pendingTasks > 0 ? '+2 desde ontem' : 'Nenhuma tarefa pendente'}
          />
          
          <StatCard
            title="Documentos Novos"
            value={stats.newDocuments}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            description={stats.newDocuments > 0 ? 'Precisam de análise' : 'Todos documentos analisados'}
          />
          
          <StatCard
            title="Eventos Próximos"
            value={stats.upcomingEvents}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            description="Nos próximos 7 dias"
          />
          
          {(userRole === 'superadmin' || userRole === 'admin' || userRole === 'escritorio') && (
            <StatCard
              title="Clientes Ativos"
              value={stats.activeClients}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description="+2 novos este mês"
            />
          )}
          
          {(userRole === 'empresa' || userRole === 'cliente') && (
            <StatCard
              title="Notas Fiscais Pendentes"
              value={stats.pendingInvoices}
              icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
              description="Aguardando processamento"
            />
          )}
        </div>

        {/* Alertas e Notificações - visíveis para todos */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(userRole === 'superadmin' || userRole === 'admin' || userRole === 'escritorio') && (
                <>
                  <li className="text-sm flex items-start">
                    <span className="bg-red-500 rounded-full h-2 w-2 mt-1.5 mr-2"></span>
                    <span>Existem 2 declarações fiscais com prazo próximo ao vencimento</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-red-500 rounded-full h-2 w-2 mt-1.5 mr-2"></span>
                    <span>5 notas fiscais pendentes de validação no XML Vault</span>
                  </li>
                </>
              )}
              
              {(userRole === 'empresa' || userRole === 'cliente') && (
                <>
                  <li className="text-sm flex items-start">
                    <span className="bg-red-500 rounded-full h-2 w-2 mt-1.5 mr-2"></span>
                    <span>Seu certificado digital vence em 15 dias</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-red-500 rounded-full h-2 w-2 mt-1.5 mr-2"></span>
                    <span>3 documentos necessitam de sua revisão</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Seção específica para superadmin */}
        {userRole === 'superadmin' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Status do Sistema</CardTitle>
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
                <CardTitle className="text-lg font-medium">Ações Rápidas (Admin)</CardTitle>
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
        )}
        
        {/* Seção específica para escritórios contábeis */}
        {userRole === 'escritorio' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Empresas que Precisam de Atenção</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Empresa ABC Ltda</span>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">DIFAL Pendente</span>
                  </li>
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>XYZ Comércio S.A.</span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Guias Atrasadas</span>
                  </li>
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Indústria Inovação Ltda</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Certificado Expirando</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Fluxo de Honorários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Total Mensal</span>
                    <span className="text-sm font-bold">R$ 45.850,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recebidos</span>
                    <span className="text-sm text-green-600">R$ 32.150,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">A Receber</span>
                    <span className="text-sm text-yellow-600">R$ 10.800,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Atrasados</span>
                    <span className="text-sm text-red-600">R$ 2.900,00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Seção específica para empresas usuárias */}
        {userRole === 'empresa' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Fiscal e Tributário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <ReceiptText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Notas Fiscais Emitidas (mês)</span>
                    </div>
                    <span className="text-sm font-bold">42</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Valor Total de Vendas</span>
                    </div>
                    <span className="text-sm font-bold">R$ 67.890,00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <Calculator className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Impostos Previstos</span>
                    </div>
                    <span className="text-sm font-bold">R$ 8.940,00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Próximos Vencimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>ICMS</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Em 5 dias</span>
                      <span className="text-xs font-bold mt-1">R$ 3.450,00</span>
                    </div>
                  </li>
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Simples Nacional</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Em 12 dias</span>
                      <span className="text-xs font-bold mt-1">R$ 2.820,00</span>
                    </div>
                  </li>
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Honorários</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Em 15 dias</span>
                      <span className="text-xs font-bold mt-1">R$ 1.200,00</span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Seção específica para clientes */}
        {userRole === 'cliente' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Minhas Compras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <ReceiptText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Compras Recentes</span>
                    </div>
                    <span className="text-sm font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Valor Total</span>
                    </div>
                    <span className="text-sm font-bold">R$ 3.890,00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <Calculator className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Impostos Inclusos</span>
                    </div>
                    <span className="text-sm font-bold">R$ 732,00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Documentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Nota Fiscal #1234</span>
                    </div>
                    <span className="text-xs text-muted-foreground">15/05/2025</span>
                  </li>
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Recibo #5678</span>
                    </div>
                    <span className="text-xs text-muted-foreground">12/05/2025</span>
                  </li>
                  <li className="text-sm flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Contrato #9012</span>
                    </div>
                    <span className="text-xs text-muted-foreground">05/05/2025</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;