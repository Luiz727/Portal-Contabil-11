import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCurrency, formatDate } from "@/lib/utils";

// Definição do schema de validação de honorários
const honorarioSchema = z.object({
  clientId: z.number().min(1, "Cliente é obrigatório"),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.string().min(1, "Valor é obrigatório"),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  tipoServico: z.string().min(1, "Tipo de serviço é obrigatório"),
  status: z.string().default("pendente"),
  observacoes: z.string().optional(),
  gerarNfse: z.boolean().default(false)
});

type Honorario = {
  id: number;
  clientId: number;
  clientName: string;
  descricao: string;
  valor: string;
  vencimento: string;
  tipoServico: string;
  status: "pendente" | "pago" | "atrasado" | "cancelado";
  observacoes?: string;
  nfseId?: number;
  createdAt: string;
  updatedAt: string;
};

export default function Honorarios() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [clientFilter, setClientFilter] = useState<string>("todos");
  const [openNovoHonorario, setOpenNovoHonorario] = useState(false);
  const [selectedHonorario, setSelectedHonorario] = useState<Honorario | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Verificar se o usuário é do escritório de contabilidade (admin ou contador)
  const isEscritorioUser = user?.role === "admin" || user?.role === "accountant";

  // Form para novo honorário
  const form = useForm<z.infer<typeof honorarioSchema>>({
    resolver: zodResolver(honorarioSchema),
    defaultValues: {
      descricao: "",
      valor: "",
      vencimento: new Date().toISOString().split("T")[0],
      tipoServico: "",
      status: "pendente",
      observacoes: "",
      gerarNfse: false
    },
  });

  // Buscar clientes
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Buscar honorários
  const { data: honorarios = [], isLoading } = useQuery({
    queryKey: ["/api/honorarios"],
    select: (data) => {
      // Filtrar por status se necessário
      let filtered = data;
      if (statusFilter !== "todos") {
        filtered = filtered.filter((h: Honorario) => h.status === statusFilter);
      }
      // Filtrar por cliente se necessário
      if (clientFilter !== "todos") {
        filtered = filtered.filter((h: Honorario) => 
          h.clientId === parseInt(clientFilter)
        );
      }
      return filtered;
    },
  });

  // Mutation para criar novo honorário
  const { mutate: createHonorario, isPending: isCreating } = useMutation({
    mutationFn: async (values: z.infer<typeof honorarioSchema>) => {
      return apiRequest("/api/honorarios", {
        method: "POST",
        data: values,
      });
    },
    onSuccess: () => {
      toast({
        title: "Honorário registrado com sucesso",
        description: "O novo honorário foi registrado no sistema.",
      });
      setOpenNovoHonorario(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/honorarios"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar honorário",
        description: "Ocorreu um erro ao registrar o honorário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar status de honorário
  const { mutate: updateHonorarioStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "pendente" | "pago" | "atrasado" | "cancelado";
    }) => {
      return apiRequest(`/api/honorarios/${id}/status`, {
        method: "PATCH",
        data: { status },
      });
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do honorário foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/honorarios"] });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do honorário.",
        variant: "destructive",
      });
    },
  });

  // Mutation para gerar NFSe a partir do honorário
  const { mutate: gerarNfse } = useMutation({
    mutationFn: async (honorarioId: number) => {
      return apiRequest(`/api/honorarios/${honorarioId}/gerar-nfse`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "NFS-e gerada com sucesso",
        description: `A Nota Fiscal de Serviço Eletrônica foi gerada com o número ${data.numero}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/honorarios"] });
    },
    onError: () => {
      toast({
        title: "Erro ao gerar NFS-e",
        description: "Não foi possível gerar a Nota Fiscal de Serviço.",
        variant: "destructive",
      });
    },
  });

  // Lidar com o envio do formulário
  const onSubmit = (values: z.infer<typeof honorarioSchema>) => {
    createHonorario(values);
  };

  // Cor de fundo baseada no status
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "pago":
        return "bg-green-100 text-green-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      case "cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Verifica se o honorário já tem NFSe gerada
  const hasNfse = (honorario: Honorario) => {
    return !!honorario.nfseId;
  };

  // Apenas usuários do escritório podem visualizar esta página
  if (!isEscritorioUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)]">
        <span className="material-icons text-red-500 text-6xl mb-4">block</span>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Acesso Restrito</h2>
        <p className="text-neutral-600 text-center max-w-md">
          Esta área é exclusiva para funcionários do escritório de contabilidade.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Controle de Honorários</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Gerencie os honorários dos clientes do escritório
          </p>
        </div>

        <Dialog open={openNovoHonorario} onOpenChange={setOpenNovoHonorario}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <span className="material-icons text-sm mr-1">add</span>
              Novo Honorário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Registrar Novo Honorário</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client: any) => (
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
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Honorários de contabilidade - Mensal" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vencimento"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tipoServico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="contabilidade_mensal">Contabilidade Mensal</SelectItem>
                          <SelectItem value="folha_pagamento">Folha de Pagamento</SelectItem>
                          <SelectItem value="consultoria_tributaria">Consultoria Tributária</SelectItem>
                          <SelectItem value="auditoria">Auditoria</SelectItem>
                          <SelectItem value="abertura_empresa">Abertura de Empresa</SelectItem>
                          <SelectItem value="consultoria_financeira">Consultoria Financeira</SelectItem>
                          <SelectItem value="consultoria_fiscal">Consultoria Fiscal</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Observações adicionais (opcional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gerarNfse"
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
                        <FormLabel>Gerar NFS-e automaticamente</FormLabel>
                        <p className="text-sm text-gray-500">
                          Emite automaticamente a Nota Fiscal de Serviço Eletrônica após o registro
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Registrando...
                      </>
                    ) : (
                      "Registrar Honorário"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="pago">Pagos</SelectItem>
              <SelectItem value="atrasado">Atrasados</SelectItem>
              <SelectItem value="cancelado">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Cliente</label>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Clientes</SelectItem>
              {clients.map((client: any) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de Honorários */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>NFS-e</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : honorarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-icons text-neutral-400 text-5xl mb-2">
                        request_quote
                      </span>
                      <p className="text-neutral-500">Nenhum honorário encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                honorarios.map((honorario: Honorario) => (
                  <TableRow key={honorario.id}>
                    <TableCell className="font-medium">{honorario.clientName}</TableCell>
                    <TableCell>{honorario.descricao}</TableCell>
                    <TableCell>{formatCurrency(parseFloat(honorario.valor))}</TableCell>
                    <TableCell>{formatDate(honorario.vencimento)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(
                          honorario.status
                        )}`}
                      >
                        {honorario.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {hasNfse(honorario) ? (
                        <a
                          href={`/invoices/${honorario.nfseId}`}
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          <span className="material-icons text-sm mr-1">receipt</span>
                          Ver NFS-e
                        </a>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => gerarNfse(honorario.id)}
                          disabled={honorario.status === "cancelado"}
                        >
                          <span className="material-icons text-sm mr-1">add_circle</span>
                          Gerar NFS-e
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {honorario.status !== "pago" && honorario.status !== "cancelado" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateHonorarioStatus({
                                id: honorario.id,
                                status: "pago",
                              })
                            }
                          >
                            <span className="material-icons text-green-600 text-sm">check_circle</span>
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="material-icons text-neutral-600 text-sm">more_vert</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Ações para Honorário</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-2 py-4">
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() =>
                                  updateHonorarioStatus({
                                    id: honorario.id,
                                    status: "pendente",
                                  })
                                }
                              >
                                <span className="material-icons text-yellow-600 text-sm mr-2">pending</span>
                                Marcar como Pendente
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() =>
                                  updateHonorarioStatus({
                                    id: honorario.id,
                                    status: "pago",
                                  })
                                }
                              >
                                <span className="material-icons text-green-600 text-sm mr-2">check_circle</span>
                                Marcar como Pago
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() =>
                                  updateHonorarioStatus({
                                    id: honorario.id,
                                    status: "atrasado",
                                  })
                                }
                              >
                                <span className="material-icons text-red-600 text-sm mr-2">warning</span>
                                Marcar como Atrasado
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() =>
                                  updateHonorarioStatus({
                                    id: honorario.id,
                                    status: "cancelado",
                                  })
                                }
                              >
                                <span className="material-icons text-neutral-600 text-sm mr-2">cancel</span>
                                Cancelar Honorário
                              </Button>
                              {!hasNfse(honorario) && (
                                <Button
                                  className="w-full justify-start"
                                  onClick={() => gerarNfse(honorario.id)}
                                  disabled={honorario.status === "cancelado"}
                                >
                                  <span className="material-icons text-sm mr-2">receipt</span>
                                  Gerar NFS-e
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}