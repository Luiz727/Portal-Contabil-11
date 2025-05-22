import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Download,
  Upload,
  Users,
  Info
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
// import { apiRequest } from '@/lib/queryClient';

// Interface para Empresa
interface Empresa {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  groupId?: number;
  responsible: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface para os campos do formulário
interface EmpresaFormData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  groupId?: number;
  responsible: string;
  active: boolean;
}

const EmpresasUsuariasPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState<EmpresaFormData>({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    responsible: '',
    active: true
  });

  // Query para buscar empresas
  const { data: empresas, isLoading, error } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Falha ao buscar empresas');
        return await response.json();
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
      }
    }
  });

  // Mutation para criar empresa
  const createEmpresaMutation = useMutation({
    mutationFn: async (data: EmpresaFormData) => {
      try {
        const response = await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Falha ao criar empresa');
        return await response.json();
      } catch (error) {
        console.error('Erro ao criar empresa:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Empresa criada com sucesso!',
        description: 'A nova empresa foi adicionada ao sistema.',
        variant: 'default',
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar empresa',
        description: 'Ocorreu um erro ao tentar criar a empresa. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  // Mutation para atualizar empresa
  const updateEmpresaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: EmpresaFormData }) => {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Falha ao atualizar empresa');
        return await response.json();
      } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Empresa atualizada com sucesso!',
        description: 'Os dados da empresa foram atualizados.',
        variant: 'default',
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar empresa',
        description: 'Ocorreu um erro ao tentar atualizar a empresa. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  // Mutation para excluir empresa
  const deleteEmpresaMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) throw new Error('Falha ao excluir empresa');
        return await response.json();
      } catch (error) {
        console.error('Erro ao excluir empresa:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Empresa excluída com sucesso!',
        description: 'A empresa foi removida do sistema.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir empresa',
        description: 'Ocorreu um erro ao tentar excluir a empresa. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  // Função para abrir o modal de edição
  const handleEdit = (empresa: Empresa) => {
    setCurrentEmpresa(empresa);
    setFormData({
      name: empresa.name,
      cnpj: empresa.cnpj,
      email: empresa.email || '',
      phone: empresa.phone || '',
      address: empresa.address || '',
      city: empresa.city || '',
      state: empresa.state || '',
      postalCode: empresa.postalCode || '',
      groupId: empresa.groupId,
      responsible: empresa.responsible || '',
      active: empresa.active
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Função para abrir o modal de criação
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentEmpresa(null);
    resetForm();
    setDialogOpen(true);
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      responsible: '',
      active: true
    });
  };

  // Função para lidar com a mudança nos campos do formulário
  const handleChange = (field: keyof EmpresaFormData, value: string | boolean | number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentEmpresa) {
      updateEmpresaMutation.mutate({ id: currentEmpresa.id, data: formData });
    } else {
      createEmpresaMutation.mutate(formData);
    }
  };

  // Função para confirmar exclusão
  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.')) {
      deleteEmpresaMutation.mutate(id);
    }
  };

  // Filtrar empresas baseado na busca
  const filteredEmpresas = empresas?.filter((empresa: Empresa) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      empresa.name.toLowerCase().includes(searchTerms) ||
      empresa.cnpj.includes(searchTerms) ||
      (empresa.email && empresa.email.toLowerCase().includes(searchTerms)) ||
      (empresa.city && empresa.city.toLowerCase().includes(searchTerms)) ||
      (empresa.state && empresa.state.toLowerCase().includes(searchTerms))
    );
  }) || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-lg">
          <Building2 size={24} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Empresas Usuárias</h1>
          <p className="text-gray-500">Gerencie as empresas cadastradas no sistema</p>
        </div>
      </div>

      <div className="mb-4">
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
          Acesso Administrador
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Gerenciamento de Empresas</CardTitle>
          <CardDescription>
            Adicione, edite e gerencie empresas usuárias do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar empresas..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Opções</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar dados
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar dados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              Erro ao carregar empresas. Tente novamente.
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {searchQuery ? 'Nenhuma empresa encontrada com os filtros atuais.' : 'Nenhuma empresa cadastrada.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmpresas.map((empresa: Empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell className="font-medium">{empresa.name}</TableCell>
                      <TableCell>{empresa.cnpj}</TableCell>
                      <TableCell>
                        {empresa.city && empresa.state
                          ? `${empresa.city}/${empresa.state}`
                          : '-'}
                      </TableCell>
                      <TableCell>{empresa.responsible || '-'}</TableCell>
                      <TableCell>
                        {empresa.active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(empresa)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(empresa.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Gerenciar Usuários
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-gray-500">
            Total: {filteredEmpresas.length} empresas
          </div>
        </CardFooter>
      </Card>

      {/* Modal de Criação/Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Altere os dados da empresa conforme necessário.'
                : 'Preencha os dados para cadastrar uma nova empresa no sistema.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="geral" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Empresa *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsável</Label>
                    <Input
                      id="responsible"
                      value={formData.responsible}
                      onChange={(e) => handleChange('responsible', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleChange('state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">CEP</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="configuracoes" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="active">Status da Empresa</Label>
                      <div className="text-sm text-gray-500">
                        Defina se a empresa está ativa no sistema
                      </div>
                    </div>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleChange('active', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupId">Grupo Empresarial</Label>
                    <Select
                      value={formData.groupId?.toString()}
                      onValueChange={(value) => handleChange('groupId', value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum grupo</SelectItem>
                        <SelectItem value="1">Grupo Econômico 1</SelectItem>
                        <SelectItem value="2">Grupo Econômico 2</SelectItem>
                        <SelectItem value="3">Holding Empresarial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createEmpresaMutation.isPending || updateEmpresaMutation.isPending}>
                {createEmpresaMutation.isPending || updateEmpresaMutation.isPending ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Salvando...
                  </>
                ) : isEditing ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmpresasUsuariasPage;