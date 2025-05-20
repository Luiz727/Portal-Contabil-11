import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Building, ShieldCheck, FileDigit, FileText, Calculator, BookText, Settings, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Componente de Card para configurações
const ConfigCard = ({ title, icon: Icon, description, status, isActive, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Card className={`h-full bg-card hover:shadow-md transition-shadow duration-300 cursor-pointer ${isActive ? 'border-primary' : 'border-border'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center">
            <Icon className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {status && (
            <Badge className={status === "Configurado" 
              ? "bg-green-500/20 text-green-600" 
              : "bg-amber-500/20 text-amber-600"
            }>
              {status === "Configurado" 
                ? <CheckCircle className="h-3 w-3 mr-1" /> 
                : <AlertTriangle className="h-3 w-3 mr-1" />
              }
              {status}
            </Badge>
          )}
        </div>
        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <p>Última atualização: 15/05/2025</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button size="sm" className="w-full">Configurar</Button>
      </CardFooter>
    </Card>
  </motion.div>
);

// Componente principal
const FiscalAjustesPanel = () => {
  const [activeTab, setActiveTab] = useState('geral');
  const [activeConfig, setActiveConfig] = useState('empresa');

  // Dados de exemplo para as configurações
  const generalConfigs = [
    {
      id: 'empresa',
      title: 'Configurações da Empresa',
      description: 'Dados cadastrais e endereço',
      icon: Building,
      status: 'Configurado'
    },
    {
      id: 'certificado',
      title: 'Certificado Digital',
      description: 'Gerenciamento do certificado A1/A3',
      icon: ShieldCheck,
      status: 'Configurado'
    },
    {
      id: 'fiscais',
      title: 'Configurações Fiscais',
      description: 'Parametrizações fiscais gerais',
      icon: FileDigit,
      status: 'Pendente'
    }
  ];

  const documentConfigs = [
    {
      id: 'nfe',
      title: 'NF-e',
      description: 'Configurações da Nota Fiscal Eletrônica',
      icon: FileText,
      status: 'Configurado'
    },
    {
      id: 'nfce',
      title: 'NFC-e',
      description: 'Configurações da Nota Fiscal de Consumidor',
      icon: ShoppingCart,
      status: 'Pendente'
    },
    {
      id: 'nfse',
      title: 'NFS-e',
      description: 'Configurações da Nota Fiscal de Serviços',
      icon: FileText,
      status: 'Configurado'
    },
    {
      id: 'matriz-fiscal',
      title: 'Matriz Fiscal',
      description: 'Configuração da matriz de impostos',
      icon: Calculator,
      status: 'Pendente'
    },
    {
      id: 'natureza-operacao',
      title: 'Natureza de Operação',
      description: 'Configuração das naturezas de operação',
      icon: BookText,
      status: 'Configurado'
    }
  ];

  const systemConfigs = [
    {
      id: 'email',
      title: 'E-mail',
      description: 'Configurações de envio de e-mails',
      icon: Settings,
      status: 'Configurado'
    },
    {
      id: 'integracao',
      title: 'Integrações',
      description: 'Integrações com outros sistemas',
      icon: Settings,
      status: 'Pendente'
    },
    {
      id: 'backup',
      title: 'Backup',
      description: 'Configurações de backup automático',
      icon: Settings,
      status: 'Pendente'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            Configurações do Sistema
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie todas as configurações do sistema fiscal
          </p>
        </div>
      </div>

      <Tabs defaultValue="geral" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generalConfigs.map((config, index) => (
              <ConfigCard 
                key={config.id} 
                title={config.title} 
                description={config.description} 
                icon={config.icon} 
                status={config.status}
                isActive={activeConfig === config.id}
                delay={index * 0.1}
                onClick={() => setActiveConfig(config.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="documentos">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentConfigs.map((config, index) => (
              <ConfigCard 
                key={config.id} 
                title={config.title} 
                description={config.description} 
                icon={config.icon} 
                status={config.status}
                isActive={activeConfig === config.id}
                delay={index * 0.1}
                onClick={() => setActiveConfig(config.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sistema">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemConfigs.map((config, index) => (
              <ConfigCard 
                key={config.id} 
                title={config.title} 
                description={config.description} 
                icon={config.icon} 
                status={config.status}
                isActive={activeConfig === config.id}
                delay={index * 0.1}
                onClick={() => setActiveConfig(config.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Área de detalhes da configuração selecionada */}
      <Card className="mt-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Detalhes da Configuração</CardTitle>
          <CardDescription>
            Selecione uma configuração acima para ver e editar seus detalhes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Selecione uma configuração para visualizar seus detalhes
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiscalAjustesPanel;