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
    <li className="py-4 flex items-start">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        className={cn(
          "flex-shrink-0 h-5 w-5 rounded-full border-2 mt-0.5",
          isCompleted ? `${priorityClass.bgColor} border-transparent` : `border-${priorityClass.borderColor} bg-white`
        )}
      />
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p 
            className={cn(
              "text-sm font-medium",
              isCompleted ? "text-neutral-500 line-through" : "text-neutral-800"
            )}
          >
            {title}
          </p>
          <span className={`${priorityClass.bgColor} ${priorityClass.textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        </div>
        <div className="mt-1 flex items-center text-sm text-neutral-500">
          <span className="material-icons text-sm mr-1">calendar_today</span>
          <span>{formatDaysRemaining(dueDate)}</span>
        </div>
      </div>
    </li>
  );
}
