import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function Reports() {
  const [period, setPeriod] = useState("month");
  const [clientFilter, setClientFilter] = useState("all");
  const [reportType, setReportType] = useState("financial");

  // Fetch clients for filter
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Monthly financial data (placeholder)
  const monthlyFinancialData = [
    { month: "Jan", receitas: 140000, despesas: 95000, lucro: 45000 },
    { month: "Fev", receitas: 155000, despesas: 105000, lucro: 50000 },
    { month: "Mar", receitas: 162000, despesas: 112000, lucro: 50000 },
    { month: "Abr", receitas: 170000, despesas: 118000, lucro: 52000 },
    { month: "Mai", receitas: 187450, despesas: 124890, lucro: 62560 },
    { month: "Jun", receitas: 192000, despesas: 128000, lucro: 64000 },
  ];

  // Task completion data (placeholder)
  const taskCompletionData = [
    { month: "Jan", concluidas: 87, atrasadas: 12, total: 99 },
    { month: "Fev", concluidas: 92, atrasadas: 8, total: 100 },
    { month: "Mar", concluidas: 88, atrasadas: 15, total: 103 },
    { month: "Abr", concluidas: 95, atrasadas: 10, total: 105 },
    { month: "Mai", concluidas: 93, atrasadas: 7, total: 100 },
    { month: "Jun", concluidas: 96, atrasadas: 5, total: 101 },
  ];

  // Client distribution data (placeholder)
  const clientDistributionData = [
    { name: "Pequenas Empresas", value: 45 },
    { name: "Médias Empresas", value: 30 },
    { name: "Grandes Empresas", value: 15 },
    { name: "Autônomos", value: 10 },
  ];

  // Document type data (placeholder)
  const documentTypeData = [
    { name: "Fiscal", value: 40 },
    { name: "Contábil", value: 25 },
    { name: "Financeiro", value: 20 },
    { name: "Administrativo", value: 10 },
    { name: "Jurídico", value: 5 },
  ];

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Relatórios</h2>
          <p className="mt-1 text-sm text-neutral-500">Análises, gráficos e indicadores de desempenho</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <span className="material-icons text-sm mr-1">print</span>
            Imprimir
          </Button>
          <Button>
            <span className="material-icons text-sm mr-1">download</span>
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Período</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mensal</SelectItem>
                <SelectItem value="quarter">Trimestral</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Cliente</label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {!isLoadingClients && clients?.map((client: any) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo de Relatório</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="tasks">Tarefas</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="documents">Documentos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="px-6 py-4 border-b border-neutral-200">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Receita Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-green-600">{formatCurrency(1006450)}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="material-icons text-xs mr-1">arrow_upward</span>
                    <span>12% em relação ao período anterior</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Despesa Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-red-600">{formatCurrency(682890)}</p>
                  <p className="text-xs text-red-600 flex items-center">
                    <span className="material-icons text-xs mr-1">arrow_upward</span>
                    <span>8% em relação ao período anterior</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Lucro Líquido</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-blue-600">{formatCurrency(323560)}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="material-icons text-xs mr-1">arrow_upward</span>
                    <span>15% em relação ao período anterior</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">Tarefas Concluídas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-neutral-800">551</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="material-icons text-xs mr-1">arrow_upward</span>
                    <span>5% em relação ao período anterior</span>
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas vs. Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyFinancialData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="receitas" name="Receitas" fill="hsl(var(--chart-1))" />
                        <Bar dataKey="despesas" name="Despesas" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Lucro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyFinancialData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="lucro" 
                          name="Lucro" 
                          stroke="hsl(var(--chart-3))" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pie Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {clientDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={documentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {documentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Financial Charts */}
              {reportType === "financial" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Receitas e Despesas Mensais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyFinancialData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="receitas" name="Receitas" fill="hsl(var(--chart-1))" />
                            <Bar dataKey="despesas" name="Despesas" fill="hsl(var(--chart-2))" />
                            <Bar dataKey="lucro" name="Lucro" fill="hsl(var(--chart-3))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução Financeira</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={monthlyFinancialData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="receitas" 
                              name="Receitas" 
                              stroke="hsl(var(--chart-1))" 
                              strokeWidth={2} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="despesas" 
                              name="Despesas" 
                              stroke="hsl(var(--chart-2))" 
                              strokeWidth={2} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="lucro" 
                              name="Lucro" 
                              stroke="hsl(var(--chart-3))" 
                              strokeWidth={3} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Task Charts */}
              {reportType === "tasks" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Conclusão de Tarefas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={taskCompletionData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="concluidas" name="Tarefas Concluídas" fill="hsl(var(--chart-1))" />
                            <Bar dataKey="atrasadas" name="Tarefas Atrasadas" fill="hsl(var(--chart-2))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Taxa de Conclusão de Tarefas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={taskCompletionData.map(item => ({
                              ...item,
                              taxa: Math.round((item.concluidas / item.total) * 100)
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="taxa" 
                              name="Taxa de Conclusão" 
                              stroke="hsl(var(--chart-3))" 
                              strokeWidth={2} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Client Charts */}
              {reportType === "clients" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={clientDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {clientDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Faturamento por Cliente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              { name: "Empresa ABC", valor: 250000 },
                              { name: "Grupo XYZ", valor: 180000 },
                              { name: "Tech Solutions", valor: 120000 },
                              { name: "Agro Industries", valor: 95000 },
                              { name: "Outros Clientes", valor: 75000 },
                            ]}
                            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ formatter: (value) => formatCurrency(value) }} />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Bar dataKey="valor" name="Faturamento" fill="hsl(var(--chart-1))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Document Charts */}
              {reportType === "documents" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tipos de Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={documentTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {documentTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos por Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: "Jan", documentos: 120 },
                              { month: "Fev", documentos: 150 },
                              { month: "Mar", documentos: 180 },
                              { month: "Abr", documentos: 145 },
                              { month: "Mai", documentos: 190 },
                              { month: "Jun", documentos: 210 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="documentos" name="Documentos" fill="hsl(var(--chart-1))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>KPIs Financeiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Margem de Lucro</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">32.15%</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>2.4% em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Ticket Médio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">{formatCurrency(5240)}</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>3.8% em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">ROI</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">176%</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>8.5% em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>KPIs Operacionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Taxa de Conclusão de Tarefas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">92.8%</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>1.5% em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Tempo Médio de Atendimento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">2.4 dias</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_downward</span>
                          <span>0.3 dias em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Satisfação do Cliente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">4.8/5</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>0.2 em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>KPIs de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Taxa de Retenção</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">95%</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>2% em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Novos Clientes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">12</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>3 em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Lifetime Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-blue-600">{formatCurrency(185000)}</p>
                        <p className="text-xs text-green-600 flex items-center">
                          <span className="material-icons text-xs mr-1">arrow_upward</span>
                          <span>5.2% em relação ao período anterior</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
