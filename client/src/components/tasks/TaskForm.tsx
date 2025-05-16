import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Create a task schema
const taskSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  clientId: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.string(),
  status: z.string(),
  dueDate: z.string(),
  isRecurring: z.boolean().optional(),
  recurringPattern: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = {
  taskId?: number;
  defaultValues?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
  userId?: string;
};

export default function TaskForm({ 
  taskId, 
  defaultValues, 
  isEditing = false, 
  onSuccess,
  userId,
}: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch clients for dropdown
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch users for assignee dropdown
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

  // Set up form with default values
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      clientId: defaultValues.clientId ? defaultValues.clientId.toString() : "",
      dueDate: defaultValues.dueDate ? new Date(defaultValues.dueDate).toISOString().substring(0, 10) : "",
    } : {
      title: "",
      description: "",
      clientId: "",
      assignedTo: userId || "",
      priority: "normal",
      status: "pending",
      dueDate: new Date().toISOString().substring(0, 10),
      isRecurring: false,
      recurringPattern: "",
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true);

      // Convert clientId to number if provided
      const formattedData = {
        ...data,
        clientId: data.clientId ? parseInt(data.clientId) : null,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      if (isEditing && taskId) {
        // Update existing task
        await apiRequest("PATCH", `/api/tasks/${taskId}`, formattedData);
        toast({
          title: "Tarefa atualizada",
          description: "A tarefa foi atualizada com sucesso.",
        });
      } else {
        // Create new task
        await apiRequest("POST", "/api/tasks", formattedData);
        toast({
          title: "Tarefa criada",
          description: "A tarefa foi criada com sucesso.",
        });
      }

      // Invalidate tasks queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });

      if (onSuccess) {
        onSuccess();
      }
      
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite uma descrição detalhada da tarefa" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum cliente selecionado</SelectItem>
                    {!isLoadingClients && clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Sem responsável</SelectItem>
                    {!isLoadingUsers && users?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Tarefa Recorrente</FormLabel>
                <p className="text-sm text-neutral-500">
                  Marque esta opção se a tarefa se repete regularmente
                </p>
              </div>
            </FormItem>
          )}
        />

        {form.watch("isRecurring") && (
          <FormField
            control={form.control}
            name="recurringPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Padrão de Recorrência</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o padrão de recorrência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4 space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                Salvando...
              </span>
            ) : isEditing ? "Atualizar Tarefa" : "Criar Tarefa"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
