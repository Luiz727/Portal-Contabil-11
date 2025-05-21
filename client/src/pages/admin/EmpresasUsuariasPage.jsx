import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Search, Plus, Edit, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiRequest } from "@/lib/queryClient";

const statusColors = {
  'Ativo': 'bg-green-500',
  'Movimento': 'bg-blue-500',
  'Inativo': 'bg-gray-500',
  'Suspenso': 'bg-yellow-500',
  'Baixado': 'bg-red-500'
};

const regimeTributario = [
  'Simples Nacional',
  'Lucro Presumido',
  'Lucro Real',
  'MEI'
];

export default function EmpresasUsuariasPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    contato: '',
    status: 'Ativo',
    regime: '',
    honorarios: '',
    vencimento: '',
    inicioContrato: null,
    fimContrato: null,
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cpfResponsavel: ''
  });

  // Buscar todas as empresas
  const { data: empresas, isLoading, isError, error } = useQuery({ 
    queryKey: ['/api/empresas-usuarias'],
    retry: 1
  });

  // Mutação para criar empresa
  const createMutation = useMutation({
    mutationFn: (newEmpresa) => {
      return apiRequest('/api/empresas-usuarias', {
        method: 'POST',
        data: newEmpresa
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empresas-usuarias'] });
      toast({
        title: 'Sucesso',
        description: 'Empresa cadastrada com sucesso!',
        variant: 'success'
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Erro ao criar empresa:', error);
      toast({
        title: 'Erro',
        description: `Erro ao cadastrar empresa: ${error.message || 'Verifique os dados e tente novamente'}`,
        variant: 'destructive'
      });
    }
  });

  // Mutação para atualizar empresa
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return apiRequest(`/api/empresas-usuarias/${id}`, {
        method: 'PATCH',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empresas-usuarias'] });
      toast({
        title: 'Sucesso',
        description: 'Empresa atualizada com sucesso!',
        variant: 'success'
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: 'Erro',
        description: `Erro ao atualizar empresa: ${error.message || 'Verifique os dados e tente novamente'}`,
        variant: 'destructive'
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      contato: '',
      status: 'Ativo',
      regime: '',
      honorarios: '',
      vencimento: '',
      inicioContrato: null,
      fimContrato: null,
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cpfResponsavel: ''
    });
    setIsEditing(false);
    setSelectedEmpresa(null);
  };

  const openNewEmpresaDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditEmpresaDialog = (empresa) => {
    setIsEditing(true);
    setSelectedEmpresa(empresa);
    
    // Converter valores para o formato esperado pelo formulário
    const inicioContrato = empresa.inicioContrato ? new Date(empresa.inicioContrato) : null;
    const fimContrato = empresa.fimContrato ? new Date(empresa.fimContrato) : null;
    
    setFormData({
      id: empresa.id,
      nome: empresa.nome || '',
      cnpj: empresa.cnpj || '',
      email: empresa.email || '',
      telefone: empresa.telefone || '',
      contato: empresa.contato || '',
      status: empresa.status || 'Ativo',
      regime: empresa.regime || '',
      honorarios: empresa.honorarios?.toString() || '',
      vencimento: empresa.vencimento?.toString() || '',
      inicioContrato,
      fimContrato,
      cep: empresa.cep || '',
      logradouro: empresa.logradouro || '',
      numero: empresa.numero || '',
      complemento: empresa.complemento || '',
      bairro: empresa.bairro || '',
      cidade: empresa.cidade || '',
      estado: empresa.estado || '',
      cpfResponsavel: empresa.cpfResponsavel || ''
    });
    
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar os dados para envio
    const empresaData = {
      ...formData,
      honorarios: formData.honorarios ? parseFloat(formData.honorarios) : null,
      vencimento: formData.vencimento ? parseInt(formData.vencimento) : null
    };
    
    if (isEditing) {
      updateMutation.mutate({ id: selectedEmpresa.id, data: empresaData });
    } else {
      createMutation.mutate(empresaData);
    }
  };

  const filteredEmpresas = empresas ? empresas.filter(empresa => 
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    (empresa.email && empresa.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Empresas Usuárias</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Erro ao carregar empresas: {error?.message || 'Ocorreu um erro desconhecido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empresas Usuárias</h1>
        <Button onClick={openNewEmpresaDialog} className="flex items-center gap-2">
          <Plus size={16} /> Nova Empresa
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CNPJ ou email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando empresas...</span>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Regime</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas.length > 0 ? (
                filteredEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>{empresa.id}</TableCell>
                    <TableCell className="font-medium">{empresa.nome}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>{empresa.email || '-'}</TableCell>
                    <TableCell>{empresa.contato || '-'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[empresa.status] || 'bg-gray-500'}>
                        {empresa.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{empresa.regime || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditEmpresaDialog(empresa)}
                        title="Editar empresa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Nenhuma empresa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo para criar/editar empresa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Atualize os dados da empresa conforme necessário.' 
                : 'Preencha os dados para cadastrar uma nova empresa.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="geral" className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
              </TabsList>

              {/* Tab Dados Gerais */}
              <TabsContent value="geral" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Código</Label>
                    <Input
                      id="id"
                      name="id"
                      placeholder="Código/ID da empresa"
                      value={formData.id}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Código da empresa no sistema Domínio</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Movimento">Movimento</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Suspenso">Suspenso</SelectItem>
                        <SelectItem value="Baixado">Baixado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Nome completo da empresa"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    placeholder="CNPJ (somente números)"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email principal da empresa"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="Telefone de contato"
                      value={formData.telefone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contato">Nome do Contato</Label>
                    <Input
                      id="contato"
                      name="contato"
                      placeholder="Nome da pessoa de contato"
                      value={formData.contato}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpfResponsavel">CPF do Responsável</Label>
                    <Input
                      id="cpfResponsavel"
                      name="cpfResponsavel"
                      placeholder="CPF do responsável legal"
                      value={formData.cpfResponsavel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regime">Regime Tributário</Label>
                  <Select
                    value={formData.regime}
                    onValueChange={(value) => handleSelectChange('regime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o regime tributário" />
                    </SelectTrigger>
                    <SelectContent>
                      {regimeTributario.map(regime => (
                        <SelectItem key={regime} value={regime}>{regime}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Tab Financeiro */}
              <TabsContent value="financeiro" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="honorarios">Honorários (R$)</Label>
                    <Input
                      id="honorarios"
                      name="honorarios"
                      type="number"
                      step="0.01"
                      placeholder="Valor dos honorários"
                      value={formData.honorarios}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vencimento">Dia do Vencimento</Label>
                    <Input
                      id="vencimento"
                      name="vencimento"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Dia do vencimento dos honorários"
                      value={formData.vencimento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Início do Contrato</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.inicioContrato ? (
                            format(formData.inicioContrato, 'PP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.inicioContrato}
                          onSelect={(date) => handleDateChange('inicioContrato', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Fim do Contrato</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.fimContrato ? (
                            format(formData.fimContrato, 'PP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.fimContrato}
                          onSelect={(date) => handleDateChange('fimContrato', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Endereço */}
              <TabsContent value="endereco" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    name="logradouro"
                    placeholder="Rua, Avenida, etc."
                    value={formData.logradouro}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      name="numero"
                      placeholder="Número"
                      value={formData.numero}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      name="complemento"
                      placeholder="Complemento"
                      value={formData.complemento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      name="estado"
                      placeholder="Estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}