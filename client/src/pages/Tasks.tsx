import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "@/components/tasks/TaskForm";
import { formatDaysRemaining, getPriorityClass } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { user } = useAuth();

  // Fetch all tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // Fetch users for assignee filter
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      // This is just a placeholder since we don't have a users endpoint yet
      return [
        { id: "1", firstName: "João", lastName: "Silva" },
        { id: "2", firstName: "Maria", lastName: "Santos" },
        { id: "3", firstName: "Carlos", lastName: "Ferreira" }
      ];
    }
  });

  // Filter tasks
  const filteredTasks = tasks?.filter((task: any) => {
    // Text search
    const matchesSearch = 
      searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    // Assignee filter
    const matchesAssignee = assigneeFilter === "all" || task.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const groupTasksByStatus = (tasks: any[] = []) => {
    const grouped = {
      pending: tasks.filter(task => task.status === "pending"),
      in_progress: tasks.filter(task => task.status === "in_progress"),
      completed: tasks.filter(task => task.status === "completed"),
    };
    return grouped;
  };

  const groupedTasks = groupTasksByStatus(filteredTasks);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Gestão de Tarefas</h2>
          <p className="mt-1 text-sm text-neutral-500">Gerencie todas as tarefas e atividades da equipe</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">add</span>
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onSuccess={() => setIsTaskFormOpen(false)}
                userId={user?.id}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Responsáveis</SelectItem>
                {!isLoadingUsers && users?.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 py-4 border-b border-neutral-200">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredTasks?.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {filteredTasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">assignment</span>
                <p className="mt-2 text-neutral-500">Nenhuma tarefa encontrada</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : groupedTasks.pending?.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {groupedTasks.pending.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">check_circle</span>
                <p className="mt-2 text-neutral-500">Nenhuma tarefa pendente</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : groupedTasks.in_progress?.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {groupedTasks.in_progress.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">hourglass_empty</span>
                <p className="mt-2 text-neutral-500">Nenhuma tarefa em andamento</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : groupedTasks.completed?.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {groupedTasks.completed.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">upcoming</span>
                <p className="mt-2 text-neutral-500">Nenhuma tarefa concluída</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const priorityClass = getPriorityClass(task.priority);
  
  return (
    <div className="py-4">
      <div className="flex items-start">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${priorityClass.bgColor} flex items-center justify-center ${priorityClass.textColor}`}>
          <span className="material-icons">assignment</span>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-neutral-800">{task.title}</h3>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClass.bgColor} ${priorityClass.textColor}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <span className="material-icons">more_vert</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                  </DialogHeader>
                  <TaskForm 
                    taskId={task.id} 
                    defaultValues={task}
                    isEditing
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-neutral-600">{task.description}</p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center text-sm text-neutral-500 gap-4">
            <div className="flex items-center">
              <span className="material-icons text-sm mr-1">calendar_today</span>
              <span>{formatDaysRemaining(task.dueDate)}</span>
            </div>
            
            {task.clientId && (
              <div className="flex items-center">
                <span className="material-icons text-sm mr-1">business</span>
                <span>Empresa ABC</span> {/* Would fetch from client data */}
              </div>
            )}
            
            {task.assignedTo && (
              <div className="flex items-center">
                <span className="material-icons text-sm mr-1">person</span>
                <span>João Silva</span> {/* Would fetch from user data */}
              </div>
            )}
            
            <div className="flex items-center">
              <span className="material-icons text-sm mr-1">flag</span>
              <span>
                {task.status === "pending" ? "Pendente" : 
                 task.status === "in_progress" ? "Em Andamento" : 
                 task.status === "completed" ? "Concluído" : 
                 task.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
