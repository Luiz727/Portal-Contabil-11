import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { BarChart2, FileText, FileBarChart2, Package, Users, Box, ShoppingCart, ScrollText, Filter, Download, Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reports = [
  { 
    id: 'vendas', 
    title: 'Relatório de Vendas', 
    icon: ShoppingCart, 
    description: 'Análise detalhada de vendas por período, cliente e produto',
    lastRun: '18/05/2025',
    type: 'fiscal',
    format: ['PDF', 'Excel', 'CSV']
  },
  { 
    id: 'estoque', 
    title: 'Posição de Estoque', 
    icon: Box, 
    description: 'Situação atual do estoque, movimentações e valorização',
    lastRun: '17/05/2025',
    type: 'gerencial',
    format: ['PDF', 'Excel']
  },
  { 
    id: 'clientes', 
    title: 'Análise de Clientes', 
    icon: Users, 
    description: 'Análise de vendas por cliente, histórico e performance',
    lastRun: '15/05/2025',
    type: 'gerencial',
    format: ['PDF', 'Excel', 'CSV']
  },
  { 
    id: 'produtos', 
    title: 'Análise de Produtos', 
    icon: Package, 
    description: 'Análise de vendas e rentabilidade por produto',
    lastRun: '16/05/2025',
    type: 'gerencial',
    format: ['PDF', 'Excel']
  },
  { 
    id: 'tributario', 
    title: 'Apuração Fiscal', 
    icon: FileText, 
    description: 'Apuração de impostos e obrigações fiscais',
    lastRun: '10/05/2025',
    type: 'fiscal',
    format: ['PDF', 'XML']
  },
  { 
    id: 'financeiro', 
    title: 'Relatório Financeiro', 
    icon: BarChart2, 
    description: 'Análise financeira de faturamento, custos e lucros',
    lastRun: '12/05/2025',
    type: 'gerencial',
    format: ['PDF', 'Excel']
  },
  { 
    id: 'sped', 
    title: 'SPED Fiscal', 
    icon: FileBarChart2, 
    description: 'Geração de arquivo SPED Fiscal para entrega à Receita',
    lastRun: '01/05/2025',
    type: 'fiscal',
    format: ['TXT', 'XML']
  },
  { 
    id: 'compras', 
    title: 'Relatório de Compras', 
    icon: ScrollText, 
    description: 'Análise detalhada das compras e aquisições',
    lastRun: '14/05/2025',
    type: 'gerencial',
    format: ['PDF', 'Excel', 'CSV']
  },
];

const ReportCard = ({ report, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Card className="h-full bg-card hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center">
            <report.icon className="mr-2 h-5 w-5 text-primary" />
            {report.title}
          </CardTitle>
          <span className="text-xs px-2 py-1 bg-muted rounded-full">{report.type}</span>
        </div>
        <CardDescription className="text-muted-foreground">{report.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <div className="flex justify-between mb-2">
          <span>Última execução:</span>
          <span className="text-foreground">{report.lastRun}</span>
        </div>
        <div className="flex justify-between">
          <span>Formatos disponíveis:</span>
          <span className="text-foreground">{report.format.join(', ')}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Calendar className="mr-1 h-3 w-3" /> Agendar
        </Button>
        <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground">
          <Download className="mr-1 h-3 w-3" /> Gerar
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const FiscalRelatoriosPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [formatFilter, setFormatFilter] = useState('todos');

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'todos' || report.type === activeTab;
    const matchesFormat = formatFilter === 'todos' || report.format.includes(formatFilter);
    return matchesSearch && matchesTab && matchesFormat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Central de Relatórios
          </h2>
          <p className="text-sm text-muted-foreground">
            Gere e agende relatórios para análise de dados fiscais e gerenciais
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" /> Novo Relatório Personalizado
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar relatórios..."
            className="pl-9 bg-input border-border text-foreground focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
              <TabsTrigger value="gerencial">Gerencial</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="bg-input border-border text-foreground focus:border-primary text-xs sm:text-sm w-full sm:w-36">
              <SelectValue placeholder="Formato" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="todos">Todos Formatos</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="Excel">Excel</SelectItem>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="XML">XML</SelectItem>
              <SelectItem value="TXT">TXT</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report, index) => (
          <ReportCard 
            key={report.id}
            report={report}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

export default FiscalRelatoriosPanel;