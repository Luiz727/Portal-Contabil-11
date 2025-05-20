import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  Download,
  PlusCircle
} from 'lucide-react';

const ResponsiveFiscalDashboard = () => {
  const [periodo, setPeriodo] = useState('maio2025');
  const [competencia, setCompetencia] = useState('maio2025');

  // Dados simulados para o dashboard
  const dashboardData = {
    totalEmitido: 'R$ 87.450,25',
    qtdDocumentos: '123',
    ticketMedio: 'R$ 710,98',
    produtosAtivos: '458',
    
    variacaoTotal: '+12,5%',
    variacaoQtd: '+8,3%',
    variacaoTicket: '-2,1%',
    variacaoProdutos: '+5,7%',
    
    recentes: [
      { id: 1, numero: '001247', tipo: 'NFe', cliente: 'Empresa Alpha Ltda.', valor: 'R$ 1.548,50', data: '18/05/2025', status: 'Autorizada' },
      { id: 2, numero: '000342', tipo: 'NFSe', cliente: 'Comércio Beta S.A.', valor: 'R$ 3.100,00', data: '17/05/2025', status: 'Autorizada' },
      { id: 3, numero: '001246', tipo: 'NFe', cliente: 'Distribuidora Gama', valor: 'R$ 2.873,35', data: '16/05/2025', status: 'Autorizada' }
    ],
    
    proxVencimentos: [
      { id: 1, nome: 'DARF PIS/COFINS', data: '25/05/2025', status: 'Pendente' },
      { id: 2, nome: 'SPED Fiscal', data: '20/05/2025', status: 'Pendente' },
      { id: 3, nome: 'GFIP', data: '20/05/2025', status: 'Pendente' }
    ]
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Título da página */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
            <BarChart2 className="mr-2 h-7 w-7 text-primary" /> Dashboard Fiscal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral das operações fiscais e vendas
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-1 rounded-md bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="maio2025">Últimos 7 dias</option>
            <option value="abril2025">Últimos 30 dias</option>
            <option value="marco2025">Este mês</option>
            <option value="fevereiro2025">Mês anterior</option>
          </select>
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
              <div className="text-2xl font-bold">{dashboardData.totalEmitido}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`flex items-center ${dashboardData.variacaoTotal.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {dashboardData.variacaoTotal.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {dashboardData.variacaoTotal}
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
              <div className="text-2xl font-bold">{dashboardData.qtdDocumentos}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`flex items-center ${dashboardData.variacaoQtd.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {dashboardData.variacaoQtd.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {dashboardData.variacaoQtd}
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
              <div className="text-2xl font-bold">{dashboardData.ticketMedio}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`flex items-center ${dashboardData.variacaoTicket.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {dashboardData.variacaoTicket.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {dashboardData.variacaoTicket}
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
                <DollarSign className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.produtosAtivos}</div>
              <div className="flex items-center mt-1 text-xs">
                <span className={`flex items-center ${dashboardData.variacaoProdutos.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {dashboardData.variacaoProdutos.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {dashboardData.variacaoProdutos}
                </span>
                <span className="text-muted-foreground ml-2">em relação ao período anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Seção de documentos recentes e obrigações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="bg-card border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Documentos Recentes</CardTitle>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Filter className="h-3.5 w-3.5 mr-1" /> Filtrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentes.map(doc => (
                  <div key={doc.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-primary mr-2" />
                        <div>
                          <span className="font-medium text-sm">{doc.numero}</span>
                          <span className="text-xs text-muted-foreground ml-2">{doc.tipo}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{doc.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Cliente: <span className="text-foreground">{doc.cliente}</span></div>
                      <div>Valor: <span className="text-foreground">{doc.valor}</span></div>
                      <div>Data: <span className="text-foreground">{doc.data}</span></div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-primary mt-2">
                  Ver todos os documentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="bg-card border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Próximos Vencimentos</CardTitle>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Calendar className="h-3.5 w-3.5 mr-1" /> Calendário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.proxVencimentos.map(obrigacao => (
                  <div key={obrigacao.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="font-medium text-sm">{obrigacao.nome}</span>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">
                        {obrigacao.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Vencimento: <span className="text-foreground">{obrigacao.data}</span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-primary mt-2">
                  Ver todas as obrigações
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Seção de ações rápidas */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, delay: 0.7 }}
        className="mt-6"
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Button className="flex flex-col items-center justify-center h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
                <FileText className="h-8 w-8 mb-2" />
                <span className="text-xs">Emitir NF-e</span>
              </Button>
              <Button className="flex flex-col items-center justify-center h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
                <Download className="h-8 w-8 mb-2" />
                <span className="text-xs">Importar XML</span>
              </Button>
              <Button className="flex flex-col items-center justify-center h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
                <PlusCircle className="h-8 w-8 mb-2" />
                <span className="text-xs">Novo Produto</span>
              </Button>
              <Button className="flex flex-col items-center justify-center h-24 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
                <BarChart2 className="h-8 w-8 mb-2" />
                <span className="text-xs">Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResponsiveFiscalDashboard;