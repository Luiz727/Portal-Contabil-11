import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart2, FileText, FileBarChart2, ArrowUpRight, ArrowDownRight,
  DollarSign, TrendingUp, PlusCircle, Package, Users, Calendar,
  Filter, Search, Download, Clock, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import FiscalMenuWrapper from '@/components/fiscal/FiscalMenuWrapper';

// Componente de cartão para notas fiscais em telas pequenas
const InvoiceCard = ({ nota, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm transition-colors"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <div>
          <span className="font-medium text-foreground">{nota.numero}</span>
          <span className="text-xs text-muted-foreground ml-2">{nota.serie}</span>
        </div>
      </div>
      <Badge className={
        nota.status === 'autorizado' ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" :
        nota.status === 'cancelado' ? "bg-red-500/20 text-red-600 hover:bg-red-500/30" :
        nota.status === 'processando' ? "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30" :
        "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
      }>
        {nota.status === 'autorizado' ? 'Autorizada' : 
         nota.status === 'cancelado' ? 'Cancelada' : 
         nota.status === 'processando' ? 'Processando' : 'Pendente'}
      </Badge>
    </div>
    <div className="text-xs text-muted-foreground space-y-1">
      <div className="flex justify-between">
        <span>Cliente:</span>
        <span className="text-foreground truncate max-w-[160px]">{nota.cliente}</span>
      </div>
      <div className="flex justify-between">
        <span>Emissão:</span>
        <span className="text-foreground">{nota.emissao}</span>
      </div>
      <div className="flex justify-between">
        <span>Valor:</span>
        <span className="text-foreground font-medium">
          {nota.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>
    </div>
    <div className="mt-3 flex justify-end gap-2">
      <Button variant="ghost" size="sm" className="text-primary h-8 px-2 text-xs">Visualizar</Button>
      <Button variant="ghost" size="sm" className="text-amber-600 h-8 px-2 text-xs">DANFE</Button>
    </div>
  </motion.div>
);

// Componente de alerta responsivo
const AlertCard = ({ alerta, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={`p-3 rounded-md ${
      alerta.urgencia === 'alta' ? 'bg-red-500/10 border border-red-200' : 
      alerta.urgencia === 'media' ? 'bg-amber-500/10 border border-amber-200' : 
      'bg-blue-500/10 border border-blue-200'
    }`}
  >
    <div className="flex justify-between items-start">
      <p className={`text-sm font-medium ${
        alerta.urgencia === 'alta' ? 'text-red-700' : 
        alerta.urgencia === 'media' ? 'text-amber-700' : 
        'text-blue-700'
      }`}>{alerta.mensagem}</p>
      <Badge variant="outline" className="text-xs">{alerta.tipo}</Badge>
    </div>
    <p className="text-xs text-muted-foreground mt-1">{alerta.data}</p>
  </motion.div>
);

const FiscalDashboard = () => {
  const [periodoFiltro, setPeriodoFiltro] = useState('7d');
  
  // Dados simulados para o dashboard
  const ultimasNotasFiscais = [
    { id: 1, numero: '000001234', serie: '1', emissao: '15/05/2025', cliente: 'Cliente Exemplo LTDA', valor: 1250.75, status: 'autorizado' },
    { id: 2, numero: '000001235', serie: '1', emissao: '16/05/2025', cliente: 'Comércio Silva ME', valor: 890.50, status: 'autorizado' },
    { id: 3, numero: '000001236', serie: '1', emissao: '16/05/2025', cliente: 'Distribuidora Santos SA', valor: 3450.00, status: 'processando' },
    { id: 4, numero: '000001237', serie: '1', emissao: '17/05/2025', cliente: 'Indústria Nacional LTDA', valor: 5670.25, status: 'pendente' },
  ];

  const alertas = [
    { id: 1, tipo: 'estoque', mensagem: 'Produto "Notebook Dell Inspiron" com estoque baixo (2 unidades)', data: '17/05/2025', urgencia: 'alta' },
    { id: 2, tipo: 'fiscal', mensagem: 'Certificado Digital expira em 15 dias', data: '17/05/2025', urgencia: 'alta' },
    { id: 3, tipo: 'sistema', mensagem: 'Backup automático não realizado nos últimos 3 dias', data: '16/05/2025', urgencia: 'media' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'autorizado':
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Autorizado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
      case 'processando':
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"><Clock className="h-3 w-3 mr-1" />Processando</Badge>;
      case 'pendente':
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"><AlertTriangle className="h-3 w-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-600 hover:bg-gray-500/30"><Clock className="h-3 w-3 mr-1" />{status}</Badge>;
    }
  };

  return (
    <FiscalMenuWrapper activeSection="dashboard">
      <div className="w-full px-3 sm:px-6 py-4 space-y-6">
        {/* Título da página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
              <BarChart2 className="mr-2 h-7 w-7 text-primary" /> Dashboard Fiscal
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visão geral das operações fiscais e vendas
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <select
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="px-3 py-1 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="hoje">Hoje</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="mes">Este mês</option>
              <option value="ano">Este ano</option>
            </select>
            <Button className="w-full xs:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Emissão
            </Button>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  <span>Total Emitido (Mês)</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 87.450,25</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12,5%
                  </span>
                  <span className="text-muted-foreground ml-2">em relação ao período anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  <span>Qtd. Documentos (Mês)</span>
                  <FileText className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">123</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +8,3%
                  </span>
                  <span className="text-muted-foreground ml-2">em relação ao período anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  <span>Ticket Médio</span>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 710,98</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-red-500">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -2,1%
                  </span>
                  <span className="text-muted-foreground ml-2">em relação ao período anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                  <span>Produtos Ativos</span>
                  <Package className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">458</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +5,7%
                  </span>
                  <span className="text-muted-foreground ml-2">em relação ao período anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Documentos recentes e alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Últimas Notas Fiscais
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs h-8 w-full xs:w-auto">
                    <Filter className="h-3.5 w-3.5 mr-1" /> Filtrar
                  </Button>
                </div>
                <CardDescription className="mt-1">Documentos fiscais recentemente emitidos</CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Vista em tabela para telas maiores */}
                <div className="hidden sm:block rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">Número</th>
                        <th className="px-4 py-2 text-left font-medium">Emissão</th>
                        <th className="px-4 py-2 text-left font-medium hidden md:table-cell">Cliente</th>
                        <th className="px-4 py-2 text-left font-medium">Valor</th>
                        <th className="px-4 py-2 text-center font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasNotasFiscais.map(nota => (
                        <tr key={nota.id} className="border-t hover:bg-muted/50">
                          <td className="px-4 py-2 text-left font-medium">{nota.numero}</td>
                          <td className="px-4 py-2 text-left">{nota.emissao}</td>
                          <td className="px-4 py-2 text-left hidden md:table-cell">{nota.cliente}</td>
                          <td className="px-4 py-2 text-left">
                            {nota.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {getStatusBadge(nota.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Vista em cartões para telas pequenas */}
                <div className="grid gap-3 sm:hidden">
                  {ultimasNotasFiscais.map((nota, index) => (
                    <InvoiceCard 
                      key={nota.id} 
                      nota={nota} 
                      delay={0.1 * index} 
                    />
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Link href="/fiscal/emissor/consultar">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Ver todos os documentos
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                    Alertas
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs h-8 w-full xs:w-auto">
                    <Calendar className="h-3.5 w-3.5 mr-1" /> Calendário
                  </Button>
                </div>
                <CardDescription className="mt-1">Notificações importantes do sistema</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {alertas.map((alerta, index) => (
                    <AlertCard 
                      key={alerta.id} 
                      alerta={alerta} 
                      delay={0.1 * index}
                    />
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Ver todos os alertas
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Ações Rápidas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.7 }}
          className="mt-6"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <Link href="/fiscal/emissor/nfe">
                  <Button className="flex flex-col items-center justify-center h-20 sm:h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 w-full">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-xs">Emitir NF-e</span>
                  </Button>
                </Link>
                <Link href="/fiscal/emissor/nfse">
                  <Button className="flex flex-col items-center justify-center h-20 sm:h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 w-full">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-xs">Emitir NFS-e</span>
                  </Button>
                </Link>
                <Link href="/fiscal/cadastros/produtos">
                  <Button className="flex flex-col items-center justify-center h-20 sm:h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 w-full">
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-xs">Novo Produto</span>
                  </Button>
                </Link>
                <Link href="/fiscal/relatorios">
                  <Button className="flex flex-col items-center justify-center h-20 sm:h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 w-full">
                    <FileBarChart2 className="h-6 w-6 mb-2" />
                    <span className="text-xs">Relatórios</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </FiscalMenuWrapper>
  );
};

export default FiscalDashboard;