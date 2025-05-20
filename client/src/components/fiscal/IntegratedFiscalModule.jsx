import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, 
  FileText, 
  Database, 
  Settings, 
  FileSpreadsheet, 
  ArrowUpDown,
  PlusCircle,
  Search,
  Download
} from 'lucide-react';

// Importar componentes dos diferentes módulos fiscais
import FiscalDashboardPanel from './FiscalDashboardPanel';
import FiscalEmissorPanel from './FiscalEmissorPanel';
import FiscalCadastrosPanel from './FiscalCadastrosPanel';
import FiscalAjustesPanel from './FiscalAjustesPanel';
import FiscalRelatoriosPanel from './FiscalRelatoriosPanel';
import FiscalImportacaoPanel from './FiscalImportacaoPanel';

/**
 * Componente que integra todas as funcionalidades do módulo fiscal
 * em um único layout usando tabs para navegação
 */
const IntegratedFiscalModule = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Configuração para o ícone de cada tab
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'dashboard': return <BarChart2 className="h-4 w-4 mr-2" />;
      case 'emissor': return <FileText className="h-4 w-4 mr-2" />;
      case 'cadastros': return <Database className="h-4 w-4 mr-2" />;
      case 'relatorios': return <FileSpreadsheet className="h-4 w-4 mr-2" />;
      case 'importacao': return <ArrowUpDown className="h-4 w-4 mr-2" />;
      case 'ajustes': return <Settings className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="w-full p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Módulo Fiscal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerenciamento completo de documentos e obrigações fiscais
          </p>
        </div>
        
        <div className="w-full sm:w-auto flex gap-2">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Emissão
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" /> Consultar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            {getTabIcon('dashboard')} Dashboard
          </TabsTrigger>
          <TabsTrigger value="emissor" className="flex items-center">
            {getTabIcon('emissor')} Emissor
          </TabsTrigger>
          <TabsTrigger value="cadastros" className="flex items-center">
            {getTabIcon('cadastros')} Cadastros
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center">
            {getTabIcon('relatorios')} Relatórios
          </TabsTrigger>
          <TabsTrigger value="importacao" className="flex items-center">
            {getTabIcon('importacao')} Import./Export.
          </TabsTrigger>
          <TabsTrigger value="ajustes" className="flex items-center">
            {getTabIcon('ajustes')} Ajustes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">
          <FiscalDashboardPanel />
        </TabsContent>
        
        <TabsContent value="emissor" className="mt-0">
          <FiscalEmissorPanel />
        </TabsContent>
        
        <TabsContent value="cadastros" className="mt-0">
          <FiscalCadastrosPanel />
        </TabsContent>
        
        <TabsContent value="relatorios" className="mt-0">
          <FiscalRelatoriosPanel />
        </TabsContent>
        
        <TabsContent value="importacao" className="mt-0">
          <FiscalImportacaoPanel />
        </TabsContent>
        
        <TabsContent value="ajustes" className="mt-0">
          <FiscalAjustesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedFiscalModule;