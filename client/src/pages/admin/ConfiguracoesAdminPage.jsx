import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Users, 
  Building, 
  FileText, 
  ShieldCheck, 
  DollarSign,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';

import GerenciamentoPlanosPage from './GerenciamentoPlanosPage';
import PermissoesPanel from '@/components/admin/PermissoesPanel';
import PermissaoAdmin from '@/components/admin/PermissaoAdmin';
import PerfilVisualizacaoConfig from '@/components/admin/PerfilVisualizacaoConfig';
import { useViewMode, VIEW_MODES } from '@/contexts/ViewModeContext';

/**
 * Página principal de configurações administrativas do sistema
 * Integra todas as configurações relacionadas a planos, permissões e empresas usuárias
 */
const ConfiguracoesAdminPage = () => {
  const [activeTab, setActiveTab] = useState('planos');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center text-foreground">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Configurações Administrativas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie planos, permissões e configurações do sistema
          </p>
        </div>
        
        <Badge 
          variant="outline" 
          className="mt-2 md:mt-0 bg-primary/10 text-primary border-primary/20"
        >
          Acesso Administrador
        </Badge>
      </div>

      <Tabs 
        defaultValue="planos" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="overflow-x-auto">
          <TabsList className="mb-6 flex flex-wrap h-auto p-1 overflow-visible">
            <TabsTrigger 
              value="planos" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Planos e Assinaturas
            </TabsTrigger>
            <TabsTrigger 
              value="permissoes" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Permissões e Acessos
            </TabsTrigger>
            <TabsTrigger 
              value="visualizacoes" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualização e Perfis
            </TabsTrigger>
            <TabsTrigger 
              value="empresas" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <Building className="mr-2 h-4 w-4" />
              Empresas Usuárias
            </TabsTrigger>
            <TabsTrigger 
              value="usuarios" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger 
              value="modulos" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <Layers className="mr-2 h-4 w-4" />
              Módulos
            </TabsTrigger>
            <TabsTrigger 
              value="configuracoes" 
              className="flex items-center rounded-md data-[state=active]:shadow-md"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações Gerais
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="planos" className="mt-0">
          <GerenciamentoPlanosPage />
        </TabsContent>
        
        <TabsContent value="permissoes" className="mt-0">
          <PermissaoAdmin />
        </TabsContent>

        <TabsContent value="visualizacoes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-primary" />
                Gerenciamento de Visualizações e Perfis
              </CardTitle>
              <CardDescription>
                Configure as visualizações do sistema e crie perfis personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerfilVisualizacaoConfig />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="empresas" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-primary" />
                Gerenciamento de Empresas Usuárias
              </CardTitle>
              <CardDescription>
                Gerencie o cadastro de empresas usuárias do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-semibold mb-2">Empresas Ativas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="bg-white hover:bg-gray-50 cursor-pointer border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">Comércio ABC</h4>
                            <p className="text-xs text-muted-foreground">CNPJ: 12.345.678/0001-90</p>
                            <p className="text-xs mt-2">Plano: Premium</p>
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Ativo
                          </span>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="ghost" size="sm" className="text-xs" asChild>
                            <a href="/admin/configuracoes-empresa">Gerenciar</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white hover:bg-gray-50 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">Grupo Aurora</h4>
                            <p className="text-xs text-muted-foreground">CNPJ: 09.876.543/0001-21</p>
                            <p className="text-xs mt-2">Plano: Básico</p>
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Ativo
                          </span>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="ghost" size="sm" className="text-xs">
                            Gerenciar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white hover:bg-gray-50 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">Holding XYZ</h4>
                            <p className="text-xs text-muted-foreground">CNPJ: 65.432.109/0001-87</p>
                            <p className="text-xs mt-2">Plano: Enterprise</p>
                          </div>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Pendente
                          </span>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="ghost" size="sm" className="text-xs">
                            Gerenciar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Building className="mr-2 h-4 w-4" />
                    Adicionar Nova Empresa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usuarios" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie os usuários do sistema e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lista de usuários - será substituída com dados reais da API */}
                  <Card className="bg-white hover:bg-gray-50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">José Silva</h4>
                          <p className="text-xs text-muted-foreground">jose.silva@exemplo.com</p>
                          <div className="flex gap-1 mt-2">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              Admin
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Ativo
                        </span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white hover:bg-gray-50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">Ana Oliveira</h4>
                          <p className="text-xs text-muted-foreground">ana.oliveira@exemplo.com</p>
                          <div className="flex gap-1 mt-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Contador
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Ativo
                        </span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white hover:bg-gray-50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">Carlos Pereira</h4>
                          <p className="text-xs text-muted-foreground">carlos.pereira@exemplo.com</p>
                          <div className="flex gap-1 mt-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Cliente
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Inativo
                        </span>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Convidar Usuário
                  </Button>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50 mt-8">
                  <h3 className="text-lg font-semibold mb-2">Gestão de Permissões</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    As permissões de usuários agora são gerenciadas através do sistema de papéis (roles).
                    Para atribuir permissões a um usuário, acesse a aba "Permissões e Acessos".
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('permissoes')}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Ir para Gestão de Papéis e Permissões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modulos" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                Configuração de Módulos
              </CardTitle>
              <CardDescription>
                Gerencie os módulos disponíveis e suas configurações
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
              <p className="text-muted-foreground text-center max-w-md">
                A configuração avançada de módulos está em fase de implementação.
                Aguarde as próximas atualizações.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuracoes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-primary" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações globais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
              <p className="text-muted-foreground text-center max-w-md">
                As configurações gerais do sistema estão em fase de implementação.
                Aguarde as próximas atualizações.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesAdminPage;