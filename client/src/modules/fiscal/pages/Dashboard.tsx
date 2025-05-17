import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart2, Banknote, FileText, ShoppingCart, ArrowUp, ArrowDown, 
  Package, TrendingUp, Clock, Calendar, Users, 
  FileBarChart2, AlertTriangle, CheckCircle2, XCircle, PlusCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import FiscalLayout from '../components/FiscalLayout';

const Dashboard = () => {
  const [periodoFiltro, setPeriodoFiltro] = useState('7d');
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'autorizado':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Autorizado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
      case 'processando':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"><Clock className="h-3 w-3 mr-1" />Processando</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"><AlertTriangle className="h-3 w-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"><Clock className="h-3 w-3 mr-1" />{status}</Badge>;
    }
  };

  const ultimasNotasFiscais = [
    { id: 1, numero: '000001234', serie: '1', emissao: '15/05/2023', cliente: 'Cliente Exemplo LTDA', valor: 1250.75, status: 'autorizado' },
    { id: 2, numero: '000001235', serie: '1', emissao: '16/05/2023', cliente: 'Comércio Silva ME', valor: 890.50, status: 'autorizado' },
    { id: 3, numero: '000001236', serie: '1', emissao: '16/05/2023', cliente: 'Distribuidora Santos SA', valor: 3450.00, status: 'processando' },
    { id: 4, numero: '000001237', serie: '1', emissao: '17/05/2023', cliente: 'Indústria Nacional LTDA', valor: 5670.25, status: 'pendente' },
    { id: 5, numero: '000001238', serie: '1', emissao: '17/05/2023', cliente: 'Comércio Oliveira EIRELI', valor: 1890.35, status: 'cancelado' },
  ];

  const produtosMaisVendidos = [
    { id: 1, nome: 'Notebook Dell Inspiron', quantidade: 15, valor: 29500.00 },
    { id: 2, nome: 'Monitor LG 24"', quantidade: 12, valor: 7500.00 },
    { id: 3, nome: 'Teclado Mecânico', quantidade: 10, valor: 3450.00 },
    { id: 4, nome: 'Mouse sem Fio', quantidade: 8, valor: 650.00 },
    { id: 5, nome: 'SSD Kingston 480GB', quantidade: 7, valor: 1580.00 }
  ];

  const vendasPorUF = [
    { uf: 'SP', quantidade: 45, valor: 35000.00, percentual: 40 },
    { uf: 'RJ', quantidade: 25, valor: 19500.00, percentual: 22 },
    { uf: 'MG', quantidade: 18, valor: 15800.00, percentual: 18 },
    { uf: 'PR', quantidade: 12, valor: 9500.00, percentual: 12 },
    { uf: 'SC', quantidade: 8, valor: 7200.00, percentual: 8 }
  ];

  const alertas = [
    { id: 1, tipo: 'estoque', mensagem: 'Produto "Notebook Dell Inspiron" com estoque baixo (2 unidades)', data: '17/05/2023', urgencia: 'alta' },
    { id: 2, tipo: 'fiscal', mensagem: 'Certificado Digital expira em 15 dias', data: '17/05/2023', urgencia: 'alta' },
    { id: 3, tipo: 'sistema', mensagem: 'Backup automático não realizado nos últimos 3 dias', data: '16/05/2023', urgencia: 'media' },
    { id: 4, tipo: 'fiscal', mensagem: 'Notas pendentes de envio para o contador', data: '15/05/2023', urgencia: 'baixa' }
  ];

  const statCardsData = [
    { 
      title: 'Total Emitido (Mês)', 
      value: 'R$ 87.450,25', 
      change: '+12,5%', 
      trend: 'up',
      icon: <Banknote className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    { 
      title: 'Qtd. Documentos (Mês)', 
      value: '123', 
      change: '+8,3%', 
      trend: 'up',
      icon: <FileText className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    },
    { 
      title: 'Ticket Médio', 
      value: 'R$ 710,98', 
      change: '-2,1%', 
      trend: 'down',
      icon: <ShoppingCart className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200'
    },
    { 
      title: 'Produtos Ativos', 
      value: '458', 
      change: '+5,7%', 
      trend: 'up',
      icon: <Package className="h-8 w-8 text-amber-500" />,
      color: 'bg-amber-50 border-amber-200'
    }
  ];

  return (
    <FiscalLayout activeSection="dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Fiscal</h1>
            <p className="text-muted-foreground">
              Visão geral das operações fiscais e vendas
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="mes">Este mês</SelectItem>
                <SelectItem value="ano">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Emissão
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCardsData.map((card, index) => (
            <Card key={index} className={`${card.color}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {card.trend === 'up' ? 
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" /> : 
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />}
                  {card.change} em relação ao período anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Últimas Notas Fiscais */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Últimas Notas Fiscais
              </CardTitle>
              <CardDescription>Documentos fiscais recentemente emitidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium">Número</th>
                      <th className="px-4 py-2 text-left font-medium">Emissão</th>
                      <th className="px-4 py-2 text-left font-medium">Cliente</th>
                      <th className="px-4 py-2 text-left font-medium">Valor</th>
                      <th className="px-4 py-2 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimasNotasFiscais.map(nota => (
                      <tr key={nota.id} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-2 text-left font-medium">{nota.numero}</td>
                        <td className="px-4 py-2 text-left">{nota.emissao}</td>
                        <td className="px-4 py-2 text-left">{nota.cliente}</td>
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
            </CardContent>
            <CardFooter>
              <Link href="/fiscal/emissor/consultar">
                <Button variant="outline" size="sm">Ver todos os documentos</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alertas
              </CardTitle>
              <CardDescription>Notificações importantes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertas.map(alerta => (
                  <div key={alerta.id} className={`p-3 rounded-md ${
                    alerta.urgencia === 'alta' ? 'bg-red-50 border border-red-200' : 
                    alerta.urgencia === 'media' ? 'bg-amber-50 border border-amber-200' : 
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${
                        alerta.urgencia === 'alta' ? 'text-red-800' : 
                        alerta.urgencia === 'media' ? 'text-amber-800' : 
                        'text-blue-800'
                      }`}>{alerta.mensagem}</p>
                      <Badge variant="outline" className="text-xs">{alerta.tipo}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alerta.data}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Ver todos os alertas</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Produtos Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription>Top produtos por volume de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium">Produto</th>
                      <th className="px-4 py-2 text-center font-medium">Qtd.</th>
                      <th className="px-4 py-2 text-right font-medium">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosMaisVendidos.map(produto => (
                      <tr key={produto.id} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-2 text-left">{produto.nome}</td>
                        <td className="px-4 py-2 text-center">{produto.quantidade}</td>
                        <td className="px-4 py-2 text-right">
                          {produto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/fiscal/relatorios/produtos">
                <Button variant="outline" size="sm">Ver relatório completo</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Vendas por UF */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <FileBarChart2 className="mr-2 h-5 w-5" />
                Vendas por Estado
              </CardTitle>
              <CardDescription>Distribuição geográfica das vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendasPorUF.map(uf => (
                  <div key={uf.uf}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Badge className="mr-2">{uf.uf}</Badge>
                        <span className="text-sm">{uf.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{uf.quantidade} vendas</span>
                    </div>
                    <Progress value={uf.percentual} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/fiscal/relatorios/vendas">
                <Button variant="outline" size="sm">Ver relatório completo</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/fiscal/emissor/nfe">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Emitir NF-e</span>
                </Button>
              </Link>
              <Link href="/fiscal/emissor/nfse">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Emitir NFS-e</span>
                </Button>
              </Link>
              <Link href="/fiscal/cadastros/produtos">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col">
                  <Package className="h-6 w-6 mb-2" />
                  <span>Cadastrar Produto</span>
                </Button>
              </Link>
              <Link href="/fiscal/cadastros/clientes">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Cadastrar Cliente</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </FiscalLayout>
  );
};

export default Dashboard;