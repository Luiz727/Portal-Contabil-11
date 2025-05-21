import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Check, Save, Trash2, UserPlus, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PermissaoAdmin = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  // Estado para as abas
  const [activeTab, setActiveTab] = useState('roles');
  
  // Estados para formulários
  const [novoRole, setNovoRole] = useState({ name: '', description: '', isSystem: false });
  const [novaPermissao, setNovaPermissao] = useState({ code: '', name: '', description: '', module: 'fiscal' });
  const [roleAtual, setRoleAtual] = useState(null);
  const [permissaoSelecionada, setPermissaoSelecionada] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [roleSelecionado, setRoleSelecionado] = useState(null);
  
  // Consultas React Query
  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ['/api/admin/roles'],
    enabled: isAdmin || isSuperAdmin,
  });
  
  const { data: permissoes, isLoading: loadingPermissoes } = useQuery({
    queryKey: ['/api/admin/permissions'],
    enabled: isAdmin || isSuperAdmin,
  });
  
  const { data: usuarios, isLoading: loadingUsuarios } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isAdmin || isSuperAdmin,
  });
  
  // Carregar permissões de um papel específico
  const { data: permissoesRole, isLoading: loadingPermissoesRole } = useQuery({
    queryKey: ['/api/admin/roles', roleAtual?.id, 'permissions'],
    enabled: !!roleAtual?.id,
  });
  
  // Carregar papéis de um usuário específico
  const { data: rolesUsuario, isLoading: loadingRolesUsuario } = useQuery({
    queryKey: ['/api/admin/users', usuarioSelecionado?.id, 'roles'],
    enabled: !!usuarioSelecionado?.id,
  });
  
  // Mutações
  const criarRole = useMutation({
    mutationFn: async (roleData) => {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar papel');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
      setNovoRole({ name: '', description: '', isSystem: false });
      toast({
        title: 'Papel criado com sucesso',
        description: 'O novo papel foi adicionado ao sistema',
        status: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar papel',
        description: error.message,
        status: 'error'
      });
    }
  });
  
  const criarPermissao = useMutation({
    mutationFn: async (permissionData) => {
      const response = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissionData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar permissão');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/permissions'] });
      setNovaPermissao({ code: '', name: '', description: '', module: 'fiscal' });
      toast({
        title: 'Permissão criada com sucesso',
        description: 'A nova permissão foi adicionada ao sistema',
        status: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar permissão',
        description: error.message,
        status: 'error'
      });
    }
  });
  
  const adicionarPermissaoAoPapel = useMutation({
    mutationFn: async ({ roleId, permissionId }) => {
      const response = await fetch(`/api/admin/roles/${roleId}/permissions/${permissionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao adicionar permissão ao papel');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles', roleAtual?.id, 'permissions'] });
      setPermissaoSelecionada(null);
      toast({
        title: 'Permissão adicionada com sucesso',
        description: 'A permissão foi adicionada ao papel',
        status: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar permissão',
        description: error.message,
        status: 'error'
      });
    }
  });
  
  const removerPermissaoDoPapel = useMutation({
    mutationFn: async ({ roleId, permissionId }) => {
      const response = await fetch(`/api/admin/roles/${roleId}/permissions/${permissionId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok && response.status !== 204) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao remover permissão do papel');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles', roleAtual?.id, 'permissions'] });
      toast({
        title: 'Permissão removida com sucesso',
        description: 'A permissão foi removida do papel',
        status: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover permissão',
        description: error.message,
        status: 'error'
      });
    }
  });
  
  const adicionarPapelAoUsuario = useMutation({
    mutationFn: async ({ userId, roleId }) => {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao adicionar papel ao usuário');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users', usuarioSelecionado?.id, 'roles'] });
      setRoleSelecionado(null);
      toast({
        title: 'Papel adicionado com sucesso',
        description: 'O papel foi adicionado ao usuário',
        status: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar papel',
        description: error.message,
        status: 'error'
      });
    }
  });
  
  const removerPapelDoUsuario = useMutation({
    mutationFn: async ({ userId, roleId }) => {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok && response.status !== 204) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao remover papel do usuário');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users', usuarioSelecionado?.id, 'roles'] });
      toast({
        title: 'Papel removido com sucesso',
        description: 'O papel foi removido do usuário',
        status: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover papel',
        description: error.message,
        status: 'error'
      });
    }
  });
  
  // Handlers
  const handleSubmitRole = (e) => {
    e.preventDefault();
    criarRole.mutate(novoRole);
  };
  
  const handleSubmitPermissao = (e) => {
    e.preventDefault();
    criarPermissao.mutate(novaPermissao);
  };
  
  const handleAdicionarPermissao = () => {
    if (roleAtual && permissaoSelecionada) {
      adicionarPermissaoAoPapel.mutate({
        roleId: roleAtual.id,
        permissionId: permissaoSelecionada.id
      });
    }
  };
  
  const handleRemoverPermissao = (permissionId) => {
    if (roleAtual) {
      removerPermissaoDoPapel.mutate({
        roleId: roleAtual.id,
        permissionId
      });
    }
  };
  
  const handleAdicionarPapel = () => {
    if (usuarioSelecionado && roleSelecionado) {
      adicionarPapelAoUsuario.mutate({
        userId: usuarioSelecionado.id,
        roleId: roleSelecionado.id
      });
    }
  };
  
  const handleRemoverPapel = (roleId) => {
    if (usuarioSelecionado) {
      removerPapelDoUsuario.mutate({
        userId: usuarioSelecionado.id,
        roleId
      });
    }
  };
  
  // Verificar se o papel já tem a permissão
  const temPermissao = (permissionId) => {
    return permissoesRole?.some(p => p.id === permissionId);
  };
  
  // Verificar se o usuário já tem o papel
  const temPapel = (roleId) => {
    return rolesUsuario?.some(r => r.id === roleId);
  };
  
  // Filtrar permissões que ainda não foram atribuídas ao papel
  const permissoesDisponiveis = permissoes?.filter(p => 
    !permissoesRole?.some(pr => pr.id === p.id)
  );
  
  // Filtrar papéis que ainda não foram atribuídos ao usuário
  const papeisDisponiveis = roles?.filter(r => 
    !rolesUsuario?.some(ru => ru.id === r.id)
  );
  
  if (!isAdmin && !isSuperAdmin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p>Você não tem permissão para acessar esta página.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Administração de Permissões
          </CardTitle>
          <CardDescription>
            Gerencie papéis, permissões e associações de usuários no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Papéis</TabsTrigger>
              <TabsTrigger value="permissions">Permissões</TabsTrigger>
              <TabsTrigger value="role-permissions">Atribuir Permissões</TabsTrigger>
              <TabsTrigger value="user-roles">Atribuir Papéis</TabsTrigger>
            </TabsList>
            
            {/* Aba de Papéis */}
            <TabsContent value="roles">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Novo Papel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitRole} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="role-name">Nome do Papel</Label>
                        <Input 
                          id="role-name" 
                          value={novoRole.name} 
                          onChange={(e) => setNovoRole({...novoRole, name: e.target.value})}
                          placeholder="Ex: Administrador" 
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role-description">Descrição</Label>
                        <Input 
                          id="role-description" 
                          value={novoRole.description} 
                          onChange={(e) => setNovoRole({...novoRole, description: e.target.value})}
                          placeholder="Ex: Papel com acesso completo ao sistema" 
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="role-system" 
                          checked={novoRole.isSystem}
                          onCheckedChange={(checked) => setNovoRole({...novoRole, isSystem: checked})}
                        />
                        <Label htmlFor="role-system">Papel do sistema</Label>
                      </div>
                      <Button type="submit" disabled={criarRole.isPending}>
                        {criarRole.isPending ? 'Criando...' : 'Criar Papel'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Papéis Existentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingRoles ? (
                      <div className="py-4 text-center">Carregando papéis...</div>
                    ) : (
                      <div className="space-y-4 py-2">
                        {roles?.length > 0 ? (
                          roles.map((role) => (
                            <div 
                              key={role.id} 
                              className="grid grid-cols-3 gap-4 items-center p-3 rounded-md border"
                            >
                              <div>
                                <p className="font-medium">{role.name}</p>
                                <p className="text-sm text-gray-500">{role.description || 'Sem descrição'}</p>
                              </div>
                              <div className="flex items-center">
                                {role.isSystem && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Sistema
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  disabled={role.isSystem}
                                  onClick={() => {/* Implementar edição */}}
                                >
                                  Editar
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">Nenhum papel encontrado</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Aba de Permissões */}
            <TabsContent value="permissions">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nova Permissão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitPermissao} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="permission-code">Código da Permissão</Label>
                        <Input 
                          id="permission-code" 
                          value={novaPermissao.code} 
                          onChange={(e) => setNovaPermissao({...novaPermissao, code: e.target.value})}
                          placeholder="Ex: admin_dashboard" 
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="permission-name">Nome</Label>
                        <Input 
                          id="permission-name" 
                          value={novaPermissao.name} 
                          onChange={(e) => setNovaPermissao({...novaPermissao, name: e.target.value})}
                          placeholder="Ex: Acessar Dashboard" 
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="permission-description">Descrição</Label>
                        <Input 
                          id="permission-description" 
                          value={novaPermissao.description} 
                          onChange={(e) => setNovaPermissao({...novaPermissao, description: e.target.value})}
                          placeholder="Ex: Permite acessar o dashboard administrativo" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="permission-module">Módulo</Label>
                        <Select 
                          value={novaPermissao.module} 
                          onValueChange={(value) => setNovaPermissao({...novaPermissao, module: value})}
                        >
                          <SelectTrigger id="permission-module">
                            <SelectValue placeholder="Selecione um módulo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fiscal">Fiscal</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                            <SelectItem value="admin">Administração</SelectItem>
                            <SelectItem value="documentos">Documentos</SelectItem>
                            <SelectItem value="estoque">Estoque</SelectItem>
                            <SelectItem value="relatorios">Relatórios</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" disabled={criarPermissao.isPending}>
                        {criarPermissao.isPending ? 'Criando...' : 'Criar Permissão'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Permissões Existentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingPermissoes ? (
                      <div className="py-4 text-center">Carregando permissões...</div>
                    ) : (
                      <div className="space-y-4 py-2">
                        {permissoes?.length > 0 ? (
                          permissoes.map((permission) => (
                            <div 
                              key={permission.id} 
                              className="grid grid-cols-4 gap-2 items-center p-3 rounded-md border"
                            >
                              <div>
                                <p className="font-medium">{permission.name}</p>
                                <p className="text-xs text-gray-500">{permission.code}</p>
                              </div>
                              <div>
                                <span className="text-sm">{permission.description || 'Sem descrição'}</span>
                              </div>
                              <div>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                  {permission.module}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {/* Implementar edição */}}
                                >
                                  Editar
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">Nenhuma permissão encontrada</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Aba de Atribuição de Permissões a Papéis */}
            <TabsContent value="role-permissions">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Atribuir Permissões a Papéis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Selecionar Papel */}
                      <div>
                        <Label htmlFor="select-role" className="mb-2 block">Selecionar Papel</Label>
                        <Select 
                          onValueChange={(value) => {
                            const selected = roles?.find(r => r.id === parseInt(value));
                            setRoleAtual(selected || null);
                          }}
                          value={roleAtual?.id?.toString() || ''}
                        >
                          <SelectTrigger id="select-role">
                            <SelectValue placeholder="Selecione um papel" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles?.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Lista de permissões do papel atual */}
                        {roleAtual && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">Permissões de {roleAtual.name}</h4>
                            
                            {loadingPermissoesRole ? (
                              <div className="py-2 text-center">Carregando permissões...</div>
                            ) : permissoesRole?.length > 0 ? (
                              <div className="max-h-80 overflow-y-auto border rounded-md divide-y">
                                {permissoesRole.map((permission) => (
                                  <div key={permission.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
                                    <div>
                                      <p className="font-medium">{permission.name}</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{permission.code}</span>
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                                          {permission.module}
                                        </span>
                                      </div>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleRemoverPermissao(permission.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 border rounded-md">
                                <p className="text-gray-500">Este papel não tem permissões</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Adicionar Permissão */}
                      {roleAtual && (
                        <div>
                          <Label htmlFor="select-permission" className="mb-2 block">Adicionar Permissão</Label>
                          <div className="flex space-x-2">
                            <Select 
                              onValueChange={(value) => {
                                const selected = permissoes?.find(p => p.id === parseInt(value));
                                setPermissaoSelecionada(selected || null);
                              }}
                              value={permissaoSelecionada?.id?.toString() || ''}
                            >
                              <SelectTrigger id="select-permission" className="flex-1">
                                <SelectValue placeholder="Selecione uma permissão" />
                              </SelectTrigger>
                              <SelectContent>
                                {permissoesDisponiveis?.map((permission) => (
                                  <SelectItem key={permission.id} value={permission.id.toString()}>
                                    {permission.name} - {permission.module}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              onClick={handleAdicionarPermissao}
                              disabled={!permissaoSelecionada || adicionarPermissaoAoPapel.isPending}
                            >
                              {adicionarPermissaoAoPapel.isPending ? 'Adicionando...' : 'Adicionar'}
                            </Button>
                          </div>
                          
                          {/* Preview da permissão selecionada */}
                          {permissaoSelecionada && (
                            <div className="mt-6 p-3 border rounded-md bg-gray-50">
                              <h4 className="font-semibold mb-2">Detalhes da Permissão</h4>
                              <p><span className="font-medium">Nome:</span> {permissaoSelecionada.name}</p>
                              <p><span className="font-medium">Código:</span> {permissaoSelecionada.code}</p>
                              <p><span className="font-medium">Módulo:</span> {permissaoSelecionada.module}</p>
                              <p><span className="font-medium">Descrição:</span> {permissaoSelecionada.description || 'Sem descrição'}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Aba de Atribuição de Papéis a Usuários */}
            <TabsContent value="user-roles">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Atribuir Papéis a Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Selecionar Usuário */}
                      <div>
                        <Label htmlFor="select-user" className="mb-2 block">Selecionar Usuário</Label>
                        <Select 
                          onValueChange={(value) => {
                            const selected = usuarios?.find(u => u.id === value);
                            setUsuarioSelecionado(selected || null);
                          }}
                          value={usuarioSelecionado?.id || ''}
                        >
                          <SelectTrigger id="select-user">
                            <SelectValue placeholder="Selecione um usuário" />
                          </SelectTrigger>
                          <SelectContent>
                            {usuarios?.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Lista de papéis do usuário */}
                        {usuarioSelecionado && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">
                              Papéis de {usuarioSelecionado.firstName} {usuarioSelecionado.lastName}
                            </h4>
                            
                            {loadingRolesUsuario ? (
                              <div className="py-2 text-center">Carregando papéis...</div>
                            ) : rolesUsuario?.length > 0 ? (
                              <div className="max-h-80 overflow-y-auto border rounded-md divide-y">
                                {rolesUsuario.map((role) => (
                                  <div key={role.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
                                    <div>
                                      <p className="font-medium">{role.name}</p>
                                      <p className="text-xs text-gray-500">{role.description || 'Sem descrição'}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      disabled={role.isSystem}
                                      onClick={() => handleRemoverPapel(role.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 border rounded-md">
                                <p className="text-gray-500">Este usuário não tem papéis</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Adicionar Papel */}
                      {usuarioSelecionado && (
                        <div>
                          <Label htmlFor="select-role-to-user" className="mb-2 block">Adicionar Papel</Label>
                          <div className="flex space-x-2">
                            <Select 
                              onValueChange={(value) => {
                                const selected = roles?.find(r => r.id === parseInt(value));
                                setRoleSelecionado(selected || null);
                              }}
                              value={roleSelecionado?.id?.toString() || ''}
                            >
                              <SelectTrigger id="select-role-to-user" className="flex-1">
                                <SelectValue placeholder="Selecione um papel" />
                              </SelectTrigger>
                              <SelectContent>
                                {papeisDisponiveis?.map((role) => (
                                  <SelectItem key={role.id} value={role.id.toString()}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              onClick={handleAdicionarPapel}
                              disabled={!roleSelecionado || adicionarPapelAoUsuario.isPending}
                            >
                              {adicionarPapelAoUsuario.isPending ? 'Adicionando...' : 'Adicionar'}
                            </Button>
                          </div>
                          
                          {/* Preview do papel selecionado */}
                          {roleSelecionado && (
                            <div className="mt-6 p-3 border rounded-md bg-gray-50">
                              <h4 className="font-semibold mb-2">Detalhes do Papel</h4>
                              <p><span className="font-medium">Nome:</span> {roleSelecionado.name}</p>
                              <p><span className="font-medium">Descrição:</span> {roleSelecionado.description || 'Sem descrição'}</p>
                              {roleSelecionado.isSystem && (
                                <p className="mt-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    Papel do Sistema
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissaoAdmin;