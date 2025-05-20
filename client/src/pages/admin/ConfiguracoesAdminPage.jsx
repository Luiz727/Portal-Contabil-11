import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Building, 
  FileText, 
  ShieldCheck, 
  DollarSign,
  Layers,
  HelpCircle
} from 'lucide-react';

import GerenciamentoPlanosPage from './GerenciamentoPlanosPage';
import PermissoesPanel from '@/components/admin/PermissoesPanel';

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
          <PermissoesPanel />
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
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
              <p className="text-muted-foreground text-center max-w-md">
                O gerenciamento de empresas usuárias está em fase de implementação.
                Aguarde as próximas atualizações.
              </p>
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
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HelpCircle className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
              <p className="text-muted-foreground text-center max-w-md">
                O gerenciamento avançado de usuários está em fase de implementação.
                Aguarde as próximas atualizações.
              </p>
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