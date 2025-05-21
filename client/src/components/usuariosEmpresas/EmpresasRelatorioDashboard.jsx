import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

// Cores para os status
const statusColors = {
  'Ativo': '#10b981',
  'Inativo': '#ef4444',
  'Movimento': '#3b82f6',
  'Pendente': '#f59e0b',
  'Integrado': '#8b5cf6'
};

// Cores para os regimes
const regimeColors = {
  'Simples Nacional': '#3b82f6',
  'Lucro Presumido': '#8b5cf6',
  'Lucro Real': '#ec4899',
  'MEI': '#10b981'
};

export default function EmpresasRelatorioDashboard() {
  const [periodoFilter, setPeriodoFilter] = useState('todos');
  
  // Buscar todas as empresas
  const { 
    data: empresas,
    isLoading: isLoadingEmpresas,
    isError: isErrorEmpresas,
    error: errorEmpresas
  } = useQuery({
    queryKey: ['/api/empresas-usuarias'],
    retry: 1
  });

  // Filtrar empresas por período, se necessário
  const filteredEmpresas = React.useMemo(() => {
    if (!empresas) return [];
    
    if (periodoFilter === 'todos') {
      return empresas;
    } else if (periodoFilter === 'ultimos30dias') {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);
      return empresas.filter(empresa => new Date(empresa.createdAt) >= dataLimite);
    } else if (periodoFilter === 'ultimos90dias') {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 90);
      return empresas.filter(empresa => new Date(empresa.createdAt) >= dataLimite);
    } else if (periodoFilter === 'esseAno') {
      const anoAtual = new Date().getFullYear();
      return empresas.filter(empresa => new Date(empresa.createdAt).getFullYear() === anoAtual);
    }
    
    return empresas;
  }, [empresas, periodoFilter]);

  // Dados para o gráfico de status
  const statusData = React.useMemo(() => {
    if (!filteredEmpresas?.length) return [];
    
    const statusCount = {};
    
    filteredEmpresas.forEach(empresa => {
      if (!statusCount[empresa.status]) {
        statusCount[empresa.status] = 0;
      }
      statusCount[empresa.status]++;
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
  }, [filteredEmpresas]);

  // Dados para o gráfico de regime tributário
  const regimeData = React.useMemo(() => {
    if (!filteredEmpresas?.length) return [];
    
    const regimeCount = {};
    
    filteredEmpresas.forEach(empresa => {
      const regime = empresa.regime || 'Não definido';
      if (!regimeCount[regime]) {
        regimeCount[regime] = 0;
      }
      regimeCount[regime]++;
    });
    
    return Object.keys(regimeCount).map(regime => ({
      name: regime,
      value: regimeCount[regime]
    }));
  }, [filteredEmpresas]);

  // Dados para o gráfico de honorários
  const honorariosData = React.useMemo(() => {
    if (!filteredEmpresas?.length) return [];
    
    // Criar faixas de honorários
    const faixas = {
      '0-500': { name: '0-500', count: 0 },
      '501-1000': { name: '501-1000', count: 0 },
      '1001-2000': { name: '1001-2000', count: 0 },
      '2001-3000': { name: '2001-3000', count: 0 },
      '3001+': { name: '3001+', count: 0 }
    };
    
    filteredEmpresas.forEach(empresa => {
      const honorario = Number(empresa.honorarios);
      
      if (isNaN(honorario) || honorario === null) {
        // Ignorar valores inválidos
        return;
      }
      
      if (honorario <= 500) {
        faixas['0-500'].count++;
      } else if (honorario <= 1000) {
        faixas['501-1000'].count++;
      } else if (honorario <= 2000) {
        faixas['1001-2000'].count++;
      } else if (honorario <= 3000) {
        faixas['2001-3000'].count++;
      } else {
        faixas['3001+'].count++;
      }
    });
    
    return Object.values(faixas);
  }, [filteredEmpresas]);

  // Dados para o gráfico de data de vencimento
  const vencimentoData = React.useMemo(() => {
    if (!filteredEmpresas?.length) return [];
    
    const vencimentoCounts = {};
    
    // Inicializar contadores para cada dia do mês
    for (let i = 1; i <= 31; i++) {
      vencimentoCounts[i] = 0;
    }
    
    filteredEmpresas.forEach(empresa => {
      const vencimento = Number(empresa.vencimento);
      
      if (!isNaN(vencimento) && vencimento >= 1 && vencimento <= 31) {
        vencimentoCounts[vencimento]++;
      }
    });
    
    return Object.keys(vencimentoCounts).map(dia => ({
      name: dia,
      quantidade: vencimentoCounts[dia]
    }));
  }, [filteredEmpresas]);

  // Componente para renderizar o gráfico de pizza
  const renderPieChart = (data, colors, title) => {
    if (!data.length) {
      return (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          Não há dados disponíveis para o período selecionado.
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => {
                const colorKey = entry.name;
                const color = colors[colorKey] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Componente para renderizar o gráfico de barras
  const renderBarChart = (data, dataKey, title) => {
    if (!data.length) {
      return (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          Não há dados disponíveis para o período selecionado.
        </div>
      );
    }

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey || 'value'} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (isLoadingEmpresas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Empresas</CardTitle>
          <CardDescription>
            Análise e estatísticas das empresas usuárias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados das empresas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isErrorEmpresas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Empresas</CardTitle>
          <CardDescription>
            Análise e estatísticas das empresas usuárias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar empresas: {errorEmpresas?.message || 'Ocorreu um erro desconhecido'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Relatório de Empresas</CardTitle>
            <CardDescription>
              Análise e estatísticas das empresas usuárias
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={periodoFilter}
              onValueChange={setPeriodoFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="ultimos90dias">Últimos 90 dias</SelectItem>
                <SelectItem value="esseAno">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Total de Empresas
                </div>
                <div className="text-2xl font-bold">
                  {filteredEmpresas?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Empresas Ativas
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredEmpresas?.filter(e => e.status === 'Ativo').length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Honorários Médios
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {filteredEmpresas?.length 
                    ? `R$ ${(filteredEmpresas.reduce((sum, empresa) => 
                        sum + (Number(empresa.honorarios) || 0), 0) / 
                        filteredEmpresas.filter(e => Number(e.honorarios) > 0).length || 0
                      ).toFixed(2).replace('.', ',')}`
                    : 'R$ 0,00'
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Receita Mensal
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {`R$ ${(filteredEmpresas?.reduce((sum, empresa) => 
                      sum + (Number(empresa.honorarios) || 0), 0) || 0
                    ).toFixed(2).replace('.', ',')}`
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="status" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Status
            </TabsTrigger>
            <TabsTrigger value="regime" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Regimes
            </TabsTrigger>
            <TabsTrigger value="honorarios" className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Honorários
            </TabsTrigger>
            <TabsTrigger value="vencimento" className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Vencimentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Status</CardTitle>
                <CardDescription>
                  Análise da distribuição de empresas por status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderPieChart(statusData, statusColors, 'Status')}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(statusColors).map(status => (
                    <Badge key={status} className="bg-muted text-foreground">
                      <div 
                        className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: statusColors[status] }}
                      />
                      {status}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="regime">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Regime Tributário</CardTitle>
                <CardDescription>
                  Análise da distribuição de empresas por regime tributário
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderPieChart(regimeData, regimeColors, 'Regime')}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(regimeColors).map(regime => (
                    <Badge key={regime} className="bg-muted text-foreground">
                      <div 
                        className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: regimeColors[regime] }}
                      />
                      {regime}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="honorarios">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Faixa de Honorários</CardTitle>
                <CardDescription>
                  Análise da distribuição de empresas por faixa de honorários (R$)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(honorariosData, 'count', 'Honorários')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vencimento">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Dia de Vencimento</CardTitle>
                <CardDescription>
                  Análise da distribuição de empresas por dia de vencimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderBarChart(vencimentoData, 'quantidade', 'Vencimento')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}