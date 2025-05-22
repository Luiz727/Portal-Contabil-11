import React from 'react';
import { Link } from 'wouter';
import { 
  Building2, 
  Users, 
  Settings,
  Shield,
  BarChart2,
  FileText,
  Package,
  CreditCard,
  Layers,
  Lock,
  Database,
  Server
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage: React.FC = () => {
  // Categorias administrativas
  const adminCategories = [
    {
      id: 'users',
      title: 'Usuários e Empresas',
      description: 'Gerencie usuários e empresas do sistema',
      items: [
        {
          id: 'empresas',
          title: 'Empresas Usuárias',
          description: 'Gerencie as empresas cadastradas no sistema',
          icon: <Building2 className="h-5 w-5 text-blue-600" />,
          path: '/admin/empresas-usuarias',
          count: '24'
        },
        {
          id: 'usuarios',
          title: 'Usuários',
          description: 'Gerencie os usuários do sistema e suas permissões',
          icon: <Users className="h-5 w-5 text-purple-600" />,
          path: '/admin/usuarios',
          count: '86'
        },
        {
          id: 'permissoes',
          title: 'Permissões',
          description: 'Configure perfis e permissões de acesso',
          icon: <Lock className="h-5 w-5 text-amber-600" />,
          path: '/admin/permissoes',
          count: '12'
        }
      ]
    },
    {
      id: 'configuracoes',
      title: 'Configurações do Sistema',
      description: 'Ajuste configurações e preferências',
      items: [
        {
          id: 'configuracoes-gerais',
          title: 'Configurações Gerais',
          description: 'Ajuste as configurações globais do sistema',
          icon: <Settings className="h-5 w-5 text-gray-600" />,
          path: '/admin/configuracoes',
          count: '8'
        },
        {
          id: 'planos',
          title: 'Planos e Assinaturas',
          description: 'Gerencie os planos disponíveis no sistema',
          icon: <CreditCard className="h-5 w-5 text-green-600" />,
          path: '/admin/planos',
          count: '4'
        },
        {
          id: 'logs',
          title: 'Logs e Atividades',
          description: 'Visualize registros de atividades do sistema',
          icon: <FileText className="h-5 w-5 text-indigo-600" />,
          path: '/admin/logs',
          count: '1,256'
        }
      ]
    },
    {
      id: 'conteudo',
      title: 'Conteúdo e Dados',
      description: 'Gerencie o conteúdo e dados do sistema',
      items: [
        {
          id: 'produtos-universais',
          title: 'Produtos Universais',
          description: 'Gerencie o catálogo global de produtos',
          icon: <Package className="h-5 w-5 text-emerald-600" />,
          path: '/admin/produtos-universais',
          count: '328'
        },
        {
          id: 'modulos',
          title: 'Módulos do Sistema',
          description: 'Configuração e personalização de módulos',
          icon: <Layers className="h-5 w-5 text-rose-600" />,
          path: '/admin/modulos',
          count: '15'
        },
        {
          id: 'database',
          title: 'Gerenciamento de Dados',
          description: 'Backup, exportação e importação de dados',
          icon: <Database className="h-5 w-5 text-cyan-600" />,
          path: '/admin/dados',
          count: '6'
        }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-amber-100 flex items-center justify-center rounded-lg">
          <Shield size={24} className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Painel Administrativo</h1>
          <p className="text-gray-500">Gerencie usuários, empresas e configurações do sistema</p>
        </div>
      </div>

      <div className="mb-4">
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
          Acesso Administrador
        </Badge>
      </div>

      <div className="mb-8">
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Bem-vindo ao Painel Administrativo</h3>
                <p className="text-sm text-gray-500">
                  Este é o centro de controle para configurar e gerenciar todos os aspectos do seu sistema NIXCON
                </p>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white" size="sm">
                <Server className="h-4 w-4 mr-2" />
                Status do Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="users">Usuários e Empresas</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo e Dados</TabsTrigger>
        </TabsList>

        {adminCategories.map(category => (
          <TabsContent value={category.id} key={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.items.map(item => (
                <Link href={item.path} key={item.id}>
                  <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-50">
                          {item.icon}
                        </div>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                      <CardTitle className="mt-3 text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" className="text-sm">
                        Acessar {item.title}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Atalhos Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-xs font-medium">Usuários</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-medium">Empresas</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="text-xs font-medium">Configurações</span>
          </Button>
          <Button variant="outline" className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2">
            <BarChart2 className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium">Relatórios</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;