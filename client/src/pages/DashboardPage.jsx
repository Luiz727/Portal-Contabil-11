import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Briefcase, 
  FileText, 
  DollarSign, 
  BarChart2, 
  Users, 
  Settings, 
  AlertTriangle, 
  Loader2, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Componente para cards rápidos de acesso a módulos
const QuickAccessCard = ({ title, description, icon: Icon, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="h-full"
  >
    <Card className="bg-card hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full border-border">
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">{title}</CardTitle>
          {Icon && <Icon className="h-5 w-5 text-primary" />}
        </div>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4 flex-grow flex flex-col justify-end">
        <Button 
          asChild 
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-primary hover:bg-primary/5 text-xs sm:text-sm"
        >
          <Link to={link}>Acessar Módulo</Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

// Componente de card de estatística
const StatCard = ({ title, value, icon: Icon, description, colorClass = "text-primary", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  </motion.div>
);

// Componente de tarefa para a lista de tarefas pendentes
const TaskItem = ({ task, index }) => {
  const priorityColor = {
    alta: "text-red-500",
    media: "text-amber-500",
    baixa: "text-green-500"
  };
  
  const priorityBgColor = {
    alta: "bg-red-500/10",
    media: "bg-amber-500/10",
    baixa: "bg-green-500/10"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-3 border-b last:border-0 border-border hover:bg-accent/10 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">{task.title}</span>
            <Badge className={`${priorityBgColor[task.priority]} ${priorityColor[task.priority]} text-xs`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">Cliente: {task.client}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary hover:bg-primary/5 mt-1">
            Ver Detalhes
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente de evento para a agenda
const EventItem = ({ event, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="p-3 border-b last:border-0 border-border hover:bg-accent/10 transition-all"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-foreground truncate">{event.title}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {event.description || 'Sem descrição'}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(event.date).toLocaleDateString()} {event.time}
        </div>
      </div>
    </div>
  </motion.div>
);

// Definições para a página principal
const DashboardPage = () => {
  // Dados simulados
  const pendingTasks = [
    { id: 1, title: "Preparar IRPF Cliente A", client: "Empresa Alpha", priority: "alta", dueDate: "2025-05-20" },
    { id: 2, title: "Balancete Mensal", client: "Comércio Beta S.A.", priority: "media", dueDate: "2025-05-25" },
    { id: 3, title: "Revisar Documentação Fiscal", client: "Serviços Gama", priority: "baixa", dueDate: "2025-06-01" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Reunião com Cliente Alpha", description: "Discussão sobre planejamento tributário", date: "2025-05-22", time: "14:00" },
    { id: 2, title: "Prazo DARF", description: "Vencimento do DARF para todos os clientes", date: "2025-06-15", time: "23:59" },
  ];

  const quickAccessItems = [
    { title: 'Cadastros', description: 'Gerencie produtos, clientes e serviços', icon: Briefcase, link: '/registrations', delay: 0.1 },
    { title: 'Emissor Fiscal', description: 'Emita NF-e, NFS-e e outros documentos', icon: FileText, link: '/fiscal', delay: 0.2 },
    { title: 'Financeiro', description: 'Controle contas a pagar e receber', icon: DollarSign, link: '/financial', delay: 0.3 },
    { title: 'Relatórios', description: 'Visualize o desempenho do negócio', icon: BarChart2, link: '/reports', delay: 0.4 },
    { title: 'Usuários', description: 'Gerencie usuários e permissões', icon: Users, link: '/users', delay: 0.5 },
    { title: 'Configurações', description: 'Ajuste as preferências do sistema', icon: Settings, link: '/settings', delay: 0.6 },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Painel de Controle</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Bem-vindo ao sistema de gestão contábil. Visualize informações importantes e acesse os módulos rapidamente.
        </p>
      </motion.div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="Tarefas Pendentes" 
          value={pendingTasks.length.toString()} 
          icon={Clock} 
          description="Atividades a fazer" 
          colorClass="text-amber-500"
          delay={0.1}
        />
        <StatCard 
          title="Documentos Novos" 
          value="16" 
          icon={FileText} 
          description="Recebidos hoje" 
          colorClass="text-blue-500"
          delay={0.2}
        />
        <StatCard 
          title="Eventos Próximos" 
          value="2" 
          icon={Calendar} 
          description="Nos próximos 7 dias" 
          colorClass="text-purple-500"
          delay={0.3}
        />
        <StatCard 
          title="Contas a Receber" 
          value="R$ 8.750,00" 
          icon={DollarSign} 
          description="Próximos 30 dias" 
          colorClass="text-green-500"
          delay={0.4}
        />
      </div>

      {/* Acesso rápido aos módulos */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickAccessItems.map(item => (
            <QuickAccessCard key={item.title} {...item} />
          ))}
        </div>
      </div>

      {/* Seção combinada - Tarefas e Eventos */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" /> Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingTasks.length > 0 ? (
              <div>
                {pendingTasks.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
                <div className="p-3 flex justify-center">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                    Ver Todas as Tarefas
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p className="text-muted-foreground">Nenhuma tarefa pendente!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" /> Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingEvents.length > 0 ? (
              <div>
                {upcomingEvents.map((event, index) => (
                  <EventItem key={event.id} event={event} index={index} />
                ))}
                <div className="p-3 flex justify-center">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                    Ver Agenda Completa
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p className="text-muted-foreground">Nenhum evento agendado!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;