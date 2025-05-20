import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/dashboard/StatCard";
import TaskItem from "@/components/dashboard/TaskItem";
import DocumentItem from "@/components/dashboard/DocumentItem";
import Calendar from "@/components/dashboard/Calendar";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import FileUpload from "@/components/FileUpload";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const { toast } = useToast();
  
  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });
  
  // Fetch pending tasks
  const { data: pendingTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["/api/tasks/pending"],
  });
  
  // Fetch recent documents
  const { data: recentDocuments, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["/api/documents"],
  });
  
  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/events/upcoming"],
  });
  
  // Handle document download
  const handleDownloadDocument = (id: number) => {
    window.open(`/api/documents/download/${id}`, '_blank');
  };
  
  // Example calendar events data (would be fetched from API)
  const calendarEvents = [
    {
      id: 1,
      title: "Entrega DARF - Empresa ABC",
      startDate: "2023-06-20T09:00:00",
      type: "obligation" as const,
    },
    {
      id: 2,
      title: "Reunião com Cliente - Holding XYZ",
      startDate: "2023-06-22T14:30:00",
      type: "meeting" as const,
    },
    {
      id: 3,
      title: "Prazo GIA - Tech Solutions",
      startDate: "2023-06-25T18:00:00",
      type: "obligation" as const,
    },
  ];
  
  // Example financial data (would be fetched from API)
  const financialData = {
    revenueData: {
      amount: 187450,
      percentChange: 12,
      isPositive: true,
    },
    expensesData: {
      amount: 124890,
      percentChange: 5,
      isPositive: false,
    },
    balanceData: {
      amount: 62560,
      percentChange: 8,
      isPositive: true,
    },
    chartData: [
      { month: "Jan", receitas: 140000, despesas: 95000 },
      { month: "Fev", receitas: 155000, despesas: 105000 },
      { month: "Mar", receitas: 162000, despesas: 112000 },
      { month: "Abr", receitas: 170000, despesas: 118000 },
      { month: "Mai", receitas: 187450, despesas: 124890 },
    ],
    accountsReceivable: [
      { name: "TechSolutions", amount: 7500 },
      { name: "Grupo Aurora", amount: 5280 },
      { name: "Holding XYZ", amount: 3840 },
      { name: "Agro Solutions", amount: 1920 },
    ],
    accountsPayable: [
      { name: "Aluguel", amount: 4500 },
      { name: "Folha de Pagamento", amount: 32740 },
      { name: "Fornecedores", amount: 3650 },
      { name: "Serviços Terceirizados", amount: 2180 },
    ],
  };
  
  // Create a new task
  const handleCreateTask = () => {
    // Would show task creation dialog/modal
    toast({
      title: "Criar Nova Tarefa",
      description: "Funcionalidade de criar tarefa seria aberta aqui.",
    });
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Dashboard</h2>
          <p className="mt-1 text-sm text-neutral-500">Visão geral das atividades do escritório</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Select
            value={selectedCompany}
            onValueChange={setSelectedCompany}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Empresas</SelectItem>
              <SelectItem value="group1">Grupo Aurora</SelectItem>
              <SelectItem value="group2">Holding XYZ</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateTask}>
            <span className="material-icons text-sm mr-1">add</span>
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      {/* Principais Módulos - Botões de Acesso Rápido */}
      <div className="bg-white shadow-sm rounded-lg p-4 my-6">
        <h3 className="text-sm font-medium text-neutral-600 mb-3">Acesso Rápido</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/clients'}
          >
            <span className="material-icons mb-2 text-2xl">people</span>
            <span className="text-xs">Clientes</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/documents'}
          >
            <span className="material-icons mb-2 text-2xl">description</span>
            <span className="text-xs">Documentos</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/tasks'}
          >
            <span className="material-icons mb-2 text-2xl">check_circle</span>
            <span className="text-xs">Tarefas</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/financial'}
          >
            <span className="material-icons mb-2 text-2xl">account_balance</span>
            <span className="text-xs">Financeiro</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/invoices'}
          >
            <span className="material-icons mb-2 text-2xl">receipt</span>
            <span className="text-xs">Notas Fiscais</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 bg-blue-50 border-blue-100 text-blue-600"
            onClick={() => window.location.href = '/fiscal'}
          >
            <span className="material-icons mb-2 text-2xl">receipt_long</span>
            <span className="text-xs">Módulo Fiscal</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/whatsapp'}
          >
            <span className="material-icons mb-2 text-2xl">chat</span>
            <span className="text-xs">WhatsApp</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            onClick={() => window.location.href = '/integrations'}
          >
            <span className="material-icons mb-2 text-2xl">sync</span>
            <span className="text-xs">Integrações</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 mt-6">
        <StatCard
          icon="assignment"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          title="Tarefas Pendentes"
          value={isLoadingStats ? "..." : dashboardStats?.pendingTasks}
          change={{
            value: "12%",
            type: "increase"
          }}
          linkText="Ver detalhes"
          linkHref="/tasks"
        />
        
        <StatCard
          icon="description"
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          title="Documentos Novos"
          value={isLoadingStats ? "..." : dashboardStats?.newDocuments}
          change={{
            value: "8%",
            type: "decrease"
          }}
          linkText="Ver detalhes"
          linkHref="/documents"
        />
        
        <StatCard
          icon="event"
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          title="Obrigações Próximas"
          value={isLoadingStats ? "..." : dashboardStats?.upcomingEvents}
          change={{
            value: "4%",
            type: "increase"
          }}
          linkText="Ver calendário"
          linkHref="/calendar"
        />
        
        <StatCard
          icon="attach_money"
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
          title="Contas a Receber"
          value={isLoadingStats ? "..." : formatCurrency(dashboardStats?.accountsReceivable)}
          change={{
            value: "15%",
            type: "increase"
          }}
          linkText="Ver financeiro"
          linkHref="/financial"
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Tarefas Recentes</h3>
            <a href="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
              Ver todas
            </a>
          </div>

          <div className="p-6">
            {isLoadingTasks ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : pendingTasks && pendingTasks.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {pendingTasks.slice(0, 4).map((task: any) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    priority={task.priority}
                    dueDate={task.dueDate}
                    status={task.status}
                  />
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <span className="material-icons text-gray-400 text-3xl mb-2">assignment_turned_in</span>
                <p>Nenhuma tarefa pendente encontrada</p>
              </div>
            )}

            <div className="mt-5">
              <Button
                className="w-full justify-center bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                onClick={handleCreateTask}
              >
                <span className="material-icons mr-2 text-sm">add</span>
                Adicionar Nova Tarefa
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar & Upcoming Events */}
        <Calendar events={upcomingEvents || calendarEvents} />
      </div>

      {/* Recent Documents & Financial Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Documents */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Documentos Recentes</h3>
            <a href="/documents" className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
              Ver todos
            </a>
          </div>

          <div className="p-6">
            {isLoadingDocuments ? (
              <div className="py-10 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : recentDocuments && recentDocuments.length > 0 ? (
              <ul className="space-y-3">
                {recentDocuments.slice(0, 4).map((doc: any) => (
                  <DocumentItem
                    key={doc.id}
                    id={doc.id}
                    name={doc.name}
                    fileType={doc.fileType}
                    uploadedBy="Usuário"
                    uploadDate={new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                    onDownload={handleDownloadDocument}
                  />
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <span className="material-icons text-gray-400 text-3xl mb-2">folder_open</span>
                <p>Nenhum documento encontrado</p>
              </div>
            )}

            <div className="mt-5">
              <FileUpload
                allowedTypes={["pdf", "doc", "docx", "xls", "xlsx", "xml"]}
                maxSizeMB={10}
              />
            </div>
          </div>
        </div>

        {/* Financial Dashboard */}
        <FinancialSummary {...financialData} />
      </div>
    </div>
  );
}
