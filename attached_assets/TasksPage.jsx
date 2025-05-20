import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialTasks = [
  { id: 1, title: "Preparar IRPF Cliente A", responsible: "Ana Silva", priority: "Alta", dueDate: "2025-05-20", completed: false, client: "Cliente A" },
  { id: 2, title: "Enviar Balancete Cliente B", responsible: "Carlos Souza", priority: "Média", dueDate: "2025-05-25", completed: false, client: "Cliente B" },
  { id: 3, title: "Revisar Documentação Cliente C", responsible: "Ana Silva", priority: "Baixa", dueDate: "2025-06-01", completed: true, client: "Cliente C" },
  { id: 4, title: "Calcular Folha de Pagamento Cliente D", responsible: "João Pereira", priority: "Alta", dueDate: "2025-05-18", completed: false, client: "Cliente D" },
];

const TaskItem = ({ task, onToggleComplete, delay }) => {
  const priorityColor = {
    "Alta": "border-red-500",
    "Média": "border-yellow-500",
    "Baixa": "border-green-500",
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`p-4 rounded-lg bg-slate-800/70 border-l-4 ${priorityColor[task.priority]} ${task.completed ? 'opacity-60' : ''} shadow-md hover:shadow-purple-500/20 transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
          <Label htmlFor={`task-${task.id}`} className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
            {task.title}
          </Label>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          task.priority === "Alta" ? "bg-red-500/30 text-red-300" :
          task.priority === "Média" ? "bg-yellow-500/30 text-yellow-300" :
          "bg-green-500/30 text-green-300"
        }`}>
          {task.priority}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-400 space-y-1">
        <p>Responsável: <span className="font-semibold text-gray-300">{task.responsible}</span></p>
        <p>Cliente: <span className="font-semibold text-gray-300">{task.client}</span></p>
        <p>Prazo: <span className="font-semibold text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</span></p>
      </div>
    </motion.div>
  );
};

const TasksPage = () => {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    responsible: [],
    priority: [],
    status: "all", 
  });

  const responsibles = [...new Set(initialTasks.map(task => task.responsible))];
  const priorities = ["Alta", "Média", "Baixa"];

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (type === "status") {
        return { ...prev, status: value };
      }
      const currentValues = prev[type] || [];
      if (currentValues.includes(value)) {
        return { ...prev, [type]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentValues, value] };
      }
    });
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResponsible = filters.responsible.length === 0 || filters.responsible.includes(task.responsible);
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);
    const matchesStatus = filters.status === "all" || (filters.status === "completed" && task.completed) || (filters.status === "pending" && !task.completed);
    
    return matchesSearch && matchesResponsible && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-4xl font-bold gradient-text">Gerenciador de Tarefas</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Nova Tarefa
        </Button>
      </motion.div>

      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-200">Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text"
              placeholder="Buscar tarefas por título ou cliente..."
              className="pl-10 bg-slate-700/50 border-slate-600 text-gray-200 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-gray-300">
                  <Filter className="mr-2 h-4 w-4" /> Responsável
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-gray-200">
                <DropdownMenuLabel>Filtrar por Responsável</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {responsibles.map(resp => (
                  <DropdownMenuCheckboxItem
                    key={resp}
                    checked={filters.responsible.includes(resp)}
                    onCheckedChange={() => handleFilterChange("responsible", resp)}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {resp}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-gray-300">
                  <Filter className="mr-2 h-4 w-4" /> Prioridade
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-gray-200">
                <DropdownMenuLabel>Filtrar por Prioridade</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {priorities.map(prio => (
                  <DropdownMenuCheckboxItem
                    key={prio}
                    checked={filters.priority.includes(prio)}
                    onCheckedChange={() => handleFilterChange("priority", prio)}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {prio}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-gray-300">
                  <Filter className="mr-2 h-4 w-4" /> Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-gray-200">
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                {[{label: "Todas", value: "all"}, {label: "Pendentes", value: "pending"}, {label: "Concluídas", value: "completed"}].map(statusOption => (
                  <DropdownMenuCheckboxItem
                    key={statusOption.value}
                    checked={filters.status === statusOption.value}
                    onCheckedChange={() => handleFilterChange("status", statusOption.value)}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {statusOption.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <TaskItem key={task.id} task={task} onToggleComplete={handleToggleComplete} delay={index * 0.05} />
          ))
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8 text-lg"
          >
            Nenhuma tarefa encontrada com os filtros selecionados.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default TasksPage;