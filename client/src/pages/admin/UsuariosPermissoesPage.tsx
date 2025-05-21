import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, 
  UserPlus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCog, 
  Shield, 
  Key, 
  Check, 
  X, 
  Search 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Interface para usuários
interface Usuario {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Funções simuladas de API
const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrador";
    case "accountant":
      return "Contador";
    case "client":
      return "Cliente";
    default:
      return "Desconhecido";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 border-red-200";
    case "accountant":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "client":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Formulário de criação/edição de usuário
const userFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  firstName: z.string().min(1, { message: "Nome é obrigatório" }),
  lastName: z.string().optional(),
  role: z.string({ required_error: "Selecione um perfil" })
});

export default function UsuariosPermissoesPage() {
  const { user, isAdmin } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("usuarios");

  // Lista de usuários
  const { data: usuarios, isLoading } = useQuery<Usuario[]>({
    queryKey: ["/api/usuarios"],
    // Desabilitar temporariamente para usar dados simulados
    enabled: false
  });

  // Dados simulados para demonstração
  const usuariosSimulados: Usuario[] = [
    {
      id: "1",
      email: "admin@nixcon.com.br",
      firstName: "Administrador",
      lastName: "Sistema",
      profileImageUrl: null,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      email: "contador@nixcon.com.br",
      firstName: "João",
      lastName: "Silva",
      profileImageUrl: null,
      role: "accountant",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      email: "maria@empresaabc.com",
      firstName: "Maria",
      lastName: "Santos",
      profileImageUrl: null,
      role: "client",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      email: "pedro@empresaabc.com",
      firstName: "Pedro",
      lastName: "Oliveira",
      profileImageUrl: null,
      role: "client",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Filtrar usuários com base na pesquisa
  const usuariosFiltrados = usuariosSimulados.filter(
    (usuario) =>
      usuario.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formulário para criação/edição de usuário
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "client"
    }
  });

  // Configurar valores iniciais quando estiver editando
  useEffect(() => {
    if (editingUser) {
      form.reset({
        email: editingUser.email || "",
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        role: editingUser.role
      });
    }
  }, [editingUser, form]);

  // Manipular envio do formulário
  function onSubmit(values: z.infer<typeof userFormSchema>) {
    if (editingUser) {
      // Lógica para atualizar usuário
      toast({
        title: "Usuário atualizado",
        description: `Usuário ${values.firstName} (${values.email}) foi atualizado com sucesso.`
      });
    } else {
      // Lógica para criar usuário
      toast({
        title: "Usuário criado",
        description: `Usuário ${values.firstName} (${values.email}) foi criado com sucesso.`
      });
    }
    
    resetForm();
  }

  // Limpar formulário
  const resetForm = () => {
    form.reset({
      email: "",
      firstName: "",
      lastName: "",
      role: "client"
    });
    setEditingUser(null);
    setIsCreating(false);
  };

  // Permissões - apenas admins podem gerenciar usuários
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acesso Restrito</CardTitle>
            <CardDescription className="text-center">
              Você não tem permissão para acessar esta área. Esta página é exclusiva para administradores do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.history.back()}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Usuários e Permissões</h1>
          <p className="text-gray-500">Gerencie usuários, perfis e permissões do sistema</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-[#d9bb42] hover:bg-[#c2a73b] text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha as informações para criar um novo usuário no sistema.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="accountant">Contador</SelectItem>
                          <SelectItem value="client">Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O perfil determina quais funcionalidades o usuário terá acesso.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#d9bb42] hover:bg-[#c2a73b] text-white">
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog para edição de usuário */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Altere as informações do usuário.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="accountant">Contador</SelectItem>
                          <SelectItem value="client">Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O perfil determina quais funcionalidades o usuário terá acesso.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingUser(null)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#d9bb42] hover:bg-[#c2a73b] text-white">
                    Atualizar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="usuarios" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="usuarios" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="perfis" className="flex items-center">
            <UserCog className="mr-2 h-4 w-4" />
            Perfis
          </TabsTrigger>
          <TabsTrigger value="permissoes" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Permissões
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Usuários</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {usuario.profileImageUrl ? (
                              <img 
                                src={usuario.profileImageUrl} 
                                alt={usuario.firstName || ""} 
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {usuario.firstName} {usuario.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(usuario.role)}>
                          {getRoleLabel(usuario.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> Ativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingUser(usuario)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfis">
          <Card>
            <CardHeader>
              <CardTitle>Perfis do Sistema</CardTitle>
              <CardDescription>
                Configure os perfis disponíveis no sistema e suas permissões associadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Administrador
                      </Badge>
                      <span className="text-sm text-gray-500">
                        (Acesso total ao sistema)
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Configurar
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Usuários com este perfil possuem acesso completo a todas as funcionalidades do sistema, incluindo configurações administrativas, gerenciamento de usuários e permissões.
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Contador
                      </Badge>
                      <span className="text-sm text-gray-500">
                        (Acesso às funcionalidades do escritório)
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Configurar
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Usuários com este perfil possuem acesso às funcionalidades do escritório de contabilidade, como gerenciamento de clientes, documentos, e produtividade.
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Cliente
                      </Badge>
                      <span className="text-sm text-gray-500">
                        (Acesso às funcionalidades da empresa)
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-3 w-3" />
                      Configurar
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Usuários com este perfil possuem acesso às funcionalidades específicas de suas empresas, como documentos, notas fiscais e relatórios.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissoes">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Permissões</CardTitle>
              <CardDescription>
                Configure as permissões específicas para cada perfil do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionalidade</TableHead>
                    <TableHead className="text-center">Administrador</TableHead>
                    <TableHead className="text-center">Contador</TableHead>
                    <TableHead className="text-center">Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Painel Administrativo</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gerenciamento de Usuários</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Empresas Usuárias</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gestão de Documentos</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emissão de Notas Fiscais</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Módulo Financeiro</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Controle de Estoque</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Relatórios Avançados</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Configurações do Sistema</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Integrações</TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><Check className="mx-auto h-4 w-4 text-green-600" /></TableCell>
                    <TableCell className="text-center"><X className="mx-auto h-4 w-4 text-red-600" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}