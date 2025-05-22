import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield,
  Download,
  Upload,
  User,
  Mail,
  Key,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
// import { apiRequest } from '@/lib/queryClient';

// Interface para Usuário
interface Usuario {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para os campos do formulário
interface UsuarioFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  active: boolean;
}

// Interface para dados de permissão
interface UserPermission {
  id: number;
  name: string;
  description: string;
  checked: boolean;
}

// Interface para dados de empresa associada
interface UserCompany {
  id: number;
  name: string;
  cnpj: string;
  accessLevel?: string;
}

const UsuariosPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<UsuarioFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'client',
    active: true
  });
  
  // Dados de exemplo para permissões
  const [permissions, setPermissions] = useState<UserPermission[]>([
    { id: 1, name: 'Acesso ao Módulo Fiscal', description: 'Permite acesso ao módulo fiscal', checked: false },
    { id: 2, name: 'Acesso ao Módulo Financeiro', description: 'Permite acesso ao módulo financeiro', checked: false },
    { id: 3, name: 'Emissão de Documentos', description: 'Permite emitir notas fiscais e outros documentos', checked: false },
    { id: 4, name: 'Gerenciar Usuários', description: 'Permite gerenciar usuários do sistema', checked: false },
    { id: 5, name: 'Acesso Administrativo', description: 'Permite acesso às funções administrativas', checked: false },
  ]);
  
  // Dados de exemplo para empresas associadas
  const [userCompanies, setUserCompanies] = useState<UserCompany[]>([
    { id: 1, name: 'Empresa Teste LTDA', cnpj: '12.345.678/0001-90', accessLevel: 'admin' },
    { id: 2, name: 'Comércio ABC', cnpj: '98.765.432/0001-10', accessLevel: 'basic' },
  ]);

  // Query para buscar usuários
  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Falha ao buscar usuários');
        return await response.json();
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
    }
  });

  // Mutation para criar usuário
  const createUsuarioMutation = useMutation({
    mutationFn: async (data: UsuarioFormData) => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Falha ao criar usuário');
        return await response.json();
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'Usuário criado com sucesso!',
        description: 'O novo usuário foi adicionado ao sistema.',
        variant: 'default',
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar usuário',
        description: 'Ocorreu um erro ao tentar criar o usuário. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  // Mutation para atualizar usuário
  const updateUsuarioMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UsuarioFormData }) => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Falha ao atualizar usuário');
        return await response.json();
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'Usuário atualizado com sucesso!',
        description: 'Os dados do usuário foram atualizados.',
        variant: 'default',
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar usuário',
        description: 'Ocorreu um erro ao tentar atualizar o usuário. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  // Mutation para excluir usuário
  const deleteUsuarioMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(`/api/users/${id}`, {
        method: 'DELETE'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'Usuário excluído com sucesso!',
        description: 'O usuário foi removido do sistema.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir usuário',
        description: 'Ocorreu um erro ao tentar excluir o usuário. Tente novamente.',
        variant: 'destructive',
      });
    }
  });

  // Função para abrir o modal de edição
  const handleEdit = (usuario: Usuario) => {
    setCurrentUsuario(usuario);
    setFormData({
      email: usuario.email,
      firstName: usuario.firstName || '',
      lastName: usuario.lastName || '',
      role: usuario.role,
      active: usuario.active
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Função para abrir o modal de criação
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentUsuario(null);
    resetForm();
    setDialogOpen(true);
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'client',
      active: true
    });
  };

  // Função para lidar com a mudança nos campos do formulário
  const handleChange = (field: keyof UsuarioFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Função para alternar permissão
  const togglePermission = (id: number) => {
    setPermissions(permissions.map(perm => 
      perm.id === id ? { ...perm, checked: !perm.checked } : perm
    ));
  };

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentUsuario) {
      updateUsuarioMutation.mutate({ id: currentUsuario.id, data: formData });
    } else {
      createUsuarioMutation.mutate(formData);
    }
  };

  // Função para confirmar exclusão
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      deleteUsuarioMutation.mutate(id);
    }
  };

  // Função para adicionar empresa ao usuário
  const handleAddCompany = () => {
    // Implementação futura para adicionar empresa ao usuário
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A associação de empresas será implementada em breve.',
      variant: 'default',
    });
  };

  // Função para remover empresa do usuário
  const handleRemoveCompany = (companyId: number) => {
    setUserCompanies(userCompanies.filter(company => company.id !== companyId));
    toast({
      title: 'Empresa removida',
      description: 'A empresa foi desvinculada do usuário.',
      variant: 'default',
    });
  };

  // Filtrar usuários baseado na busca
  const filteredUsuarios = usuarios?.filter((usuario: Usuario) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      usuario.email.toLowerCase().includes(searchTerms) ||
      (usuario.firstName && usuario.firstName.toLowerCase().includes(searchTerms)) ||
      (usuario.lastName && usuario.lastName.toLowerCase().includes(searchTerms)) ||
      usuario.role.toLowerCase().includes(searchTerms)
    );
  }) || [];

  // Função para obter label do papel do usuário
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrador', color: 'bg-red-100 text-red-800' };
      case 'accountant':
        return { label: 'Contador', color: 'bg-blue-100 text-blue-800' };
      case 'client':
        return { label: 'Cliente', color: 'bg-green-100 text-green-800' };
      default:
        return { label: role, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Função para obter iniciais do nome
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-purple-100 flex items-center justify-center rounded-lg">
          <Users size={24} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Usuários do Sistema</h1>
          <p className="text-gray-500">Gerencie os usuários e suas permissões</p>
        </div>
      </div>

      <div className="mb-4">
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
          Acesso Administrador
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Adicione, edite e gerencie usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              Erro ao carregar usuários. Tente novamente.
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {searchQuery ? 'Nenhum usuário encontrado com os filtros atuais.' : 'Nenhum usuário cadastrado.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario: Usuario) => {
                    const roleInfo = getRoleLabel(usuario.role);
                    const fullName = `${usuario.firstName || ''} ${usuario.lastName || ''}`.trim();
                    
                    return (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={usuario.profileImageUrl} />
                              <AvatarFallback className="bg-purple-100 text-purple-700">
                                {getInitials(usuario.firstName, usuario.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{fullName || 'Usuário sem nome'}</div>
                              <div className="text-xs text-gray-500">ID: {usuario.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge className={`${roleInfo.color} hover:${roleInfo.color}`}>
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {usuario.active ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {usuario.lastLogin ? new Date(usuario.lastLogin).toLocaleDateString() : 'Nunca acessou'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(usuario.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Permissões
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-gray-500">
            Total: {filteredUsuarios.length} usuários
          </div>
        </CardFooter>
      </Card>

      {/* Modal de Criação/Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Altere os dados do usuário conforme necessário.'
                : 'Preencha os dados para cadastrar um novo usuário no sistema.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="geral" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
                <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                <TabsTrigger value="empresas">Empresas</TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Perfil de Acesso *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="accountant">Contador</SelectItem>
                        <SelectItem value="client">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active">Status</Label>
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => handleChange('active', checked)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {formData.active ? 'Usuário ativo no sistema' : 'Usuário inativo no sistema'}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissoes" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium">Permissões do Usuário</h4>
                      <p className="text-xs text-gray-500">
                        Defina as permissões que este usuário terá no sistema
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{permission.name}</div>
                            <div className="text-xs text-gray-500">{permission.description}</div>
                          </div>
                          <Switch
                            id={`permission-${permission.id}`}
                            checked={permission.checked}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="empresas" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Empresas Vinculadas</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddCompany}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Vincular Empresa
                    </Button>
                  </div>
                  
                  {userCompanies.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 border rounded-md">
                      Nenhuma empresa vinculada a este usuário.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userCompanies.map(company => (
                        <div key={company.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-xs text-gray-500">CNPJ: {company.cnpj}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {company.accessLevel === 'admin' ? 'Administrador' : 'Usuário Básico'}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveCompany(company.id)}
                            >
                              <UserMinus className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
              <Button type="submit" disabled={createUsuarioMutation.isPending || updateUsuarioMutation.isPending}>
                {createUsuarioMutation.isPending || updateUsuarioMutation.isPending ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Salvando...
                  </>
                ) : isEditing ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsuariosPage;