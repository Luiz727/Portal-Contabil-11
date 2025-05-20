import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Upload, Download, FileUp, FileDown, CheckCircle, AlertTriangle, Clock, ExternalLink, Table } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Componente do Histórico de Importações
const ImportHistoryItem = ({ item, index }) => {
  const statusColor = {
    'Concluído': 'bg-green-500/20 text-green-600 hover:bg-green-500/30',
    'Em Processamento': 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30',
    'Falha': 'bg-red-500/20 text-red-600 hover:bg-red-500/30',
    'Pendente': 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30'
  };

  const statusIcon = {
    'Concluído': <CheckCircle className="h-4 w-4 mr-1" />,
    'Em Processamento': <Clock className="h-4 w-4 mr-1" />,
    'Falha': <AlertTriangle className="h-4 w-4 mr-1" />,
    'Pendente': <Clock className="h-4 w-4 mr-1" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h3 className="font-medium flex items-center text-foreground">
            {item.filename}
            <Badge variant="outline" className="ml-2 text-xs">{item.type}</Badge>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Importado em {item.date} por {item.user}
          </p>
        </div>
        <Badge className={statusColor[item.status]}>
          {statusIcon[item.status]}
          {item.status}
        </Badge>
      </div>
      
      {item.status === "Em Processamento" && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso</span>
            <span>{item.progress}%</span>
          </div>
          <Progress value={item.progress} className="h-2" />
        </div>
      )}
      
      {item.status === "Falha" && (
        <div className="mt-2">
          <p className="text-xs text-red-500">{item.errorMessage}</p>
        </div>
      )}
      
      {item.status === "Concluído" && (
        <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
          <span>{item.records} registros processados</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary">
            Ver Detalhes
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// Componente principal do módulo de importação/exportação
const FiscalImportacaoPanel = () => {
  const [activeTab, setActiveTab] = useState('importacao');
  
  // Dados de exemplo para histórico de importações
  const importHistory = [
    { 
      id: 1, 
      filename: 'produtos_atacado.csv', 
      type: 'Produtos', 
      date: '18/05/2025 14:30', 
      user: 'Ana Silva', 
      status: 'Concluído',
      records: 254
    },
    { 
      id: 2, 
      filename: 'clientes_maio2025.xlsx', 
      type: 'Clientes', 
      date: '17/05/2025 09:15', 
      user: 'João Pereira', 
      status: 'Em Processamento',
      progress: 68
    },
    { 
      id: 3, 
      filename: 'fornecedores_nordeste.csv', 
      type: 'Fornecedores', 
      date: '16/05/2025 16:45', 
      user: 'Ana Silva', 
      status: 'Concluído',
      records: 42
    },
    { 
      id: 4, 
      filename: 'precos_maio2025.xlsx', 
      type: 'Preços', 
      date: '15/05/2025 11:20', 
      user: 'Carlos Oliveira', 
      status: 'Falha',
      errorMessage: 'Formato de arquivo inválido na linha 128'
    },
  ];
  
  // Dados de exemplo para histórico de exportações
  const exportHistory = [
    { 
      id: 1, 
      filename: 'relatorio_vendas_abril2025.xlsx', 
      type: 'Relatório de Vendas', 
      date: '01/05/2025 10:15', 
      user: 'Ana Silva', 
      status: 'Concluído',
      records: 542
    },
    { 
      id: 2, 
      filename: 'inventario_estoque.xlsx', 
      type: 'Inventário', 
      date: '28/04/2025 14:30', 
      user: 'João Pereira', 
      status: 'Concluído',
      records: 1253
    },
    { 
      id: 3, 
      filename: 'clientes_ativos.csv', 
      type: 'Clientes', 
      date: '25/04/2025 09:45', 
      user: 'Ana Silva', 
      status: 'Concluído',
      records: 154
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="importacao" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="importacao" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" /> Importação
          </TabsTrigger>
          <TabsTrigger value="exportacao" className="flex items-center">
            <Download className="h-4 w-4 mr-2" /> Exportação
          </TabsTrigger>
        </TabsList>
        
        {/* Aba de Importação */}
        <TabsContent value="importacao" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <FileUp className="mr-2 h-5 w-5 text-primary" />
                Importação de Dados
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Importe dados para o sistema a partir de arquivos CSV, Excel ou XML
              </p>
            </div>
            <Button className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" /> Nova Importação
            </Button>
          </div>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Importar Dados</CardTitle>
              <CardDescription>
                Selecione o tipo de dados e o arquivo para importação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <Table className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Produtos</h3>
                  <p className="text-xs text-muted-foreground">
                    Importar cadastro de produtos
                  </p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <Upload className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">XML Fiscal</h3>
                  <p className="text-xs text-muted-foreground">
                    Importar XMLs de documentos fiscais
                  </p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <Table className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Clientes</h3>
                  <p className="text-xs text-muted-foreground">
                    Importar cadastro de clientes
                  </p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <ExternalLink className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">API</h3>
                  <p className="text-xs text-muted-foreground">
                    Importar dados via API externa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Histórico de Importações</h3>
            <div className="space-y-3">
              {importHistory.map((item, index) => (
                <ImportHistoryItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Aba de Exportação */}
        <TabsContent value="exportacao" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center">
                <FileDown className="mr-2 h-5 w-5 text-primary" />
                Exportação de Dados
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Exporte dados do sistema para arquivos CSV, Excel ou XML
              </p>
            </div>
            <Button className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Nova Exportação
            </Button>
          </div>
          
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Exportar Dados</CardTitle>
              <CardDescription>
                Selecione o tipo de dados e o formato para exportação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <Table className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Produtos</h3>
                  <p className="text-xs text-muted-foreground">
                    Exportar cadastro de produtos
                  </p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <FileDown className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Vendas</h3>
                  <p className="text-xs text-muted-foreground">
                    Exportar relatório de vendas
                  </p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <Table className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Clientes</h3>
                  <p className="text-xs text-muted-foreground">
                    Exportar cadastro de clientes
                  </p>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors cursor-pointer border border-dashed border-border text-center">
                  <FileDown className="h-10 w-10 mx-auto text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Estoque</h3>
                  <p className="text-xs text-muted-foreground">
                    Exportar relatório de estoque
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Histórico de Exportações</h3>
            <div className="space-y-3">
              {exportHistory.map((item, index) => (
                <ImportHistoryItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FiscalImportacaoPanel;