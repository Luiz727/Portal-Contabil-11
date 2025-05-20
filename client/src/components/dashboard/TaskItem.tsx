import { useState } from "react";
import { cn, formatDaysRemaining, getPriorityClass } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type TaskItemProps = {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  status: string;
};

export default function TaskItem({ id, title, priority, dueDate, status }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const priorityClass = getPriorityClass(priority);
  const isCompleted = status === "completed";

  // Mapeamento de cores para prioridades
  const priorityClasses = {
    high: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-400"
    },
    medium: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-400"
    },
    low: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-400"
    }
  };

  const priorityClass2 = priorityClasses[priority as keyof typeof priorityClasses] || priorityClasses.medium;

  const handleStatusChange = async (checked: boolean) => {
    if (isCompleting) return;

    try {
      setIsCompleting(true);
      await apiRequest("PATCH", `/api/tasks/${id}`, {
        status: checked ? "completed" : "pending",
        completedAt: checked ? new Date().toISOString() : null,
      });

      // Invalidate tasks queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });

      toast({
        title: checked ? "Tarefa concluída" : "Tarefa reaberta",
        description: checked 
          ? "A tarefa foi marcada como concluída com sucesso." 
          : "A tarefa foi marcada como pendente novamente.",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <li className="py-4 flex items-start group hover:bg-gray-50 px-2 rounded-md -mx-2 transition-colors duration-200">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        className={cn(
          "flex-shrink-0 h-5 w-5 rounded-full border-2 mt-0.5",
          isCompleted 
            ? priorityClass2.bg + " border-transparent" 
            : "bg-white " + priorityClass2.border
        )}
      />
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p 
            className={cn(
              "text-sm font-medium",
              isCompleted ? "text-gray-400 line-through" : "text-gray-800"
            )}
          >
            {title}
          </p>
          <span className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full",
            priorityClass2.bg,
            priorityClass2.text
          )}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <span className="material-icons text-sm mr-1">calendar_today</span>
          <span>{formatDaysRemaining(dueDate)}</span>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex items-center">
        <button className="text-gray-400 hover:text-gray-600">
          <span className="material-icons text-sm">edit</span>
        </button>
      </div>
    </li>
  );
}
