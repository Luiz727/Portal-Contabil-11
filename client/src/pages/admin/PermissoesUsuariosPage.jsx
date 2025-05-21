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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Search, Plus, Trash2, Users, Shield, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Cores por nível de permissão
const permissionLevelColors = {
  'admin': 'bg-red-500',
  'editor': 'bg-blue-500',
  'viewer': 'bg-green-500'
};

export default function PermissoesUsuariosPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVinculoDialogOpen, setIsVinculoDialogOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionLevel, setPermissionLevel] = useState('viewer');
  const [tabValue, setTabValue] = useState('empresas');

  // Buscar todas as empresas
  const { 
    data: empresas,
    isLoading: isLoadingEmpresas,
    isError: isErrorEmpresas,
    error: errorEmpresas
  } = useQuery({
    queryKey: ['/api/empresas-usuarias'],
    retry: 1
  });

  // Buscar todos os usuários
  const {
    data: usuarios,
    isLoading: isLoadingUsuarios,
    isError: isErrorUsuarios,
    error: errorUsuarios
  } = useQuery({
    queryKey: ['/api/users'],
    retry: 1
  });

  // Vincular usuário a empresa
  const vincularMutation = useMutation({
    mutationFn: (data) => {
      return apiRequest('/api/usuarios-empresas', {
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      toast({
        title: 'Sucesso',
        description: 'Usuário vinculado à empresa com sucesso!',
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: [`/api/empresas/${selectedEmpresa.id}/usuarios`] });
      setIsVinculoDialogOpen(false);
      setPermissionLevel('viewer');
    },
    onError: (error) => {
      console.error('Erro ao vincular usuário:', error);
      toast({
        title: 'Erro',
        description: `Erro ao vincular usuário: ${error?.message || 'Tente novamente mais tarde'}`,
        variant: 'destructive'
      });
    }
  });

  // Desvincular usuário da empresa
  const desvincularMutation = useMutation({
    mutationFn: ({ userId, empresaId }) => {
      return apiRequest(`/api/usuarios-empresas/${userId}/${empresaId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: (_, variables) => {
      const { empresaId } = variables;
      toast({
        title: 'Sucesso',
        description: 'Usuário desvinculado da empresa com sucesso!',
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: [`/api/empresas/${empresaId}/usuarios`] });
    },
    onError: (error) => {
      console.error('Erro ao desvincular usuário:', error);
      toast({
        title: 'Erro',
        description: `Erro ao desvincular usuário: ${error?.message || 'Tente novamente mais tarde'}`,
        variant: 'destructive'
      });
    }
  });

  // Atualizar permissão de usuário
  const atualizarPermissaoMutation = useMutation({
    mutationFn: ({ userId, empresaId, permissionLevel }) => {
      return apiRequest(`/api/usuarios-empresas/${userId}/${empresaId}`, {
        method: 'PATCH',
        data: { permissionLevel }
      });
    },
    onSuccess: (_, variables) => {
      const { empresaId } = variables;
      toast({
        title: 'Sucesso',
        description: 'Permissão atualizada com sucesso!',
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: [`/api/empresas/${empresaId}/usuarios`] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar permissão:', error);
      toast({
        title: 'Erro',
        description: `Erro ao atualizar permissão: ${error?.message || 'Tente novamente mais tarde'}`,
        variant: 'destructive'
      });
    }
  });

  // Componente para gerenciar usuários de uma empresa
  const EmpresaUsuarios = ({ empresa }) => {
    const {
      data: usuariosEmpresa,
      isLoading,
      isError,
      error
    } = useQuery({
      queryKey: [`/api/empresas/${empresa.id}/usuarios`],
      enabled: !!empresa?.id,
      retry: 1
    });

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando usuários...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Erro ao carregar usuários: {error?.message || 'Ocorreu um erro desconhecido'}</p>
        </div>
      );
    }

    const handleDesvincular = (userId) => {
      if (window.confirm('Tem certeza que deseja remover o acesso deste usuário à empresa?')) {
        desvincularMutation.mutate({
          userId,
          empresaId: empresa.id
        });
      }
    };

    const handleChangePermission = (userId, newPermissionLevel) => {
      atualizarPermissaoMutation.mutate({
        userId,
        empresaId: empresa.id,
        permissionLevel: newPermissionLevel
      });
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Usuários com acesso a {empresa.nome}</h3>
          <div className="flex items-center space-x-2">
            <Dialog open={isVinculoDialogOpen} onOpenChange={setIsVinculoDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedEmpresa(empresa);
                    setIsVinculoDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vincular Usuário à Empresa</DialogTitle>
                  <DialogDescription>
                    Selecione um usuário e o nível de permissão para vinculá-lo à empresa {empresa.nome}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="user" className="text-sm font-medium">Usuário</label>
                    <Select
                      value={selectedUser?.id || ''}
                      onValueChange={(value) => {
                        const user = usuarios?.find(u => u.id === value);
                        setSelectedUser(user);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {usuarios?.map(usuario => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.firstName || usuario.email || usuario.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="permissionLevel" className="text-sm font-medium">Nível de Permissão</label>
                    <Select
                      value={permissionLevel}
                      onValueChange={setPermissionLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível de permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsVinculoDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedUser) {
                        toast({
                          title: 'Atenção',
                          description: 'Selecione um usuário para continuar',
                          variant: 'warning'
                        });
                        return;
                      }
                      
                      vincularMutation.mutate({
                        userId: selectedUser.id,
                        empresaId: empresa.id,
                        permissionLevel
                      });
                    }}
                    disabled={vincularMutation.isPending}
                  >
                    {vincularMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Vincular
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {usuariosEmpresa?.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nível de Permissão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosEmpresa.map(({user, permissionLevel}) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName || user.id}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={permissionLevelColors[permissionLevel] || 'bg-gray-500'}>
                        {permissionLevel === 'admin' && 'Administrador'}
                        {permissionLevel === 'editor' && 'Editor'}
                        {permissionLevel === 'viewer' && 'Visualizador'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select
                          defaultValue={permissionLevel}
                          onValueChange={(value) => handleChangePermission(user.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Alterar permissão" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDesvincular(user.id)}
                          title="Remover acesso"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground border rounded-md">
            Nenhum usuário vinculado a esta empresa.
          </div>
        )}
      </div>
    );
  };

  // Componente para mostrar as empresas de um usuário
  const UsuarioEmpresas = ({ usuario }) => {
    const {
      data: empresasUsuario,
      isLoading,
      isError,
      error
    } = useQuery({
      queryKey: [`/api/usuarios/${usuario.id}/empresas`],
      enabled: !!usuario?.id,
      retry: 1
    });

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando empresas...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Erro ao carregar empresas: {error?.message || 'Ocorreu um erro desconhecido'}</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Empresas acessíveis para {usuario.firstName || usuario.email || usuario.id}</h3>
        </div>
        
        {empresasUsuario?.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresasUsuario.map(empresa => (
                  <TableRow key={empresa.id}>
                    <TableCell>{empresa.id}</TableCell>
                    <TableCell className="font-medium">{empresa.nome}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>
                      <Badge className={
                        empresa.status === 'Ativo' ? 'bg-green-500' :
                        empresa.status === 'Inativo' ? 'bg-red-500' :
                        empresa.status === 'Movimento' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }>
                        {empresa.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground border rounded-md">
            Nenhuma empresa vinculada a este usuário.
          </div>
        )}
      </div>
    );
  };
  
  // Filtra as empresas com base na busca
  const filteredEmpresas = empresas?.filter(empresa => 
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    (empresa.email && empresa.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];
  
  // Filtra os usuários com base na busca
  const filteredUsuarios = usuarios?.filter(usuario => 
    (usuario.firstName && usuario.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.lastName && usuario.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.id && usuario.id.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  if (isErrorEmpresas || isErrorUsuarios) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Permissões de Usuários</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            {isErrorEmpresas && `Erro ao carregar empresas: ${errorEmpresas?.message || 'Ocorreu um erro desconhecido'}`}
            {isErrorUsuarios && `Erro ao carregar usuários: ${errorUsuarios?.message || 'Ocorreu um erro desconhecido'}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Permissões de Usuários</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gerenciamento de Acessos</CardTitle>
          <CardDescription>
            Gerencie quais usuários têm acesso a quais empresas e seus níveis de permissão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, CNPJ..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="empresas" className="mt-4" value={tabValue} onValueChange={setTabValue}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="empresas" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Por Empresa
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Por Usuário
              </TabsTrigger>
            </TabsList>

            <TabsContent value="empresas">
              {isLoadingEmpresas ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Carregando empresas...</span>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredEmpresas.length > 0 ? (
                    filteredEmpresas.map(empresa => (
                      <Card key={empresa.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg flex items-center">
                                {empresa.nome}
                                <Badge className="ml-2" variant={
                                  empresa.status === 'Ativo' ? 'success' :
                                  empresa.status === 'Inativo' ? 'destructive' :
                                  'secondary'
                                }>
                                  {empresa.status}
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                CNPJ: {empresa.cnpj} | ID: {empresa.id}
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={`/admin/empresas-usuarias?id=${empresa.id}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" /> Ver Empresa
                              </a>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <EmpresaUsuarios empresa={empresa} />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground border rounded-md">
                      Nenhuma empresa encontrada com o termo de busca.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="usuarios">
              {isLoadingUsuarios ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Carregando usuários...</span>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map(usuario => (
                      <Card key={usuario.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg">{usuario.firstName} {usuario.lastName}</CardTitle>
                              <CardDescription>
                                Email: {usuario.email || 'N/A'} | ID: {usuario.id}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <UsuarioEmpresas usuario={usuario} />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground border rounded-md">
                      Nenhum usuário encontrado com o termo de busca.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}