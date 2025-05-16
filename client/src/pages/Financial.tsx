import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import FinancialAccountCard from "@/components/financial/FinancialAccountCard";

export default function Financial() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  // Fetch financial transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/financial/transactions"],
  });

  // Fetch clients for filter
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch financial accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["/api/financial/accounts"],
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      return [
        { id: 1, name: "Conta Bancária Principal", type: "checking", bankName: "Banco do Brasil", currentBalance: 45000, clientId: 1 },
        { id: 2, name: "Conta Poupança", type: "savings", bankName: "Caixa Econômica", currentBalance: 75000, clientId: 1 },
        { id: 3, name: "Conta Cartão de Crédito", type: "credit_card", bankName: "Nubank", currentBalance: -2500, clientId: 1 },
      ];
    }
  });

  // Filter transactions
  const filteredTransactions = transactions?.filter((transaction: any) => {
    // Text search
    const matchesSearch = 
      searchQuery === "" || 
      (transaction.description && transaction.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type filter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    // Date filter (placeholder logic)
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = new Date(transaction.date).toDateString() === new Date().toDateString();
    } else if (dateFilter === "thisWeek") {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      matchesDate = new Date(transaction.date) >= weekStart;
    } else if (dateFilter === "thisMonth") {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      matchesDate = new Date(transaction.date) >= monthStart;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Calculate totals
  const calculateTotals = () => {
    if (!filteredTransactions) return { income: 0, expense: 0, balance: 0 };
    
    const income = filteredTransactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + t.amount, 0);
      
    const expense = filteredTransactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + t.amount, 0);
      
    return {
      income,
      expense,
      balance: income - expense
    };
  };

  const totals = calculateTotals();

  // Example chart data
  const chartData = [
    { month: "Jan", receitas: 45000, despesas: 35000 },
    { month: "Fev", receitas: 48000, despesas: 36000 },
    { month: "Mar", receitas: 52000, despesas: 38000 },
    { month: "Abr", receitas: 49000, despesas: 37000 },
    { month: "Mai", receitas: 53000, despesas: 39000 },
    { month: "Jun", receitas: 57000, despesas: 41000 },
  ];
  
  const pieData = [
    { name: "Serviços", value: 40 },
    { name: "Produtos", value: 30 },
    { name: "Consultoria", value: 20 },
    { name: "Outros", value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Controle Financeiro</h2>
          <p className="mt-1 text-sm text-neutral-500">Gerenciamento de contas a pagar, receber e fluxo de caixa</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">add</span>
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Transação</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Tipo</label>
                      <Select defaultValue="income">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                          <SelectItem value="transfer">Transferência</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Conta</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a conta" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account: any) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                              {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Descrição</label>
                    <Input placeholder="Descrição da transação" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Valor</label>
                      <Input placeholder="0,00" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Data</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Categoria</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Vendas</SelectItem>
                        <SelectItem value="services">Serviços</SelectItem>
                        <SelectItem value="salary">Salário</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                        <SelectItem value="utilities">Serviços Públicos</SelectItem>
                        <SelectItem value="food">Alimentação</SelectItem>
                        <SelectItem value="travel">Viagem</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Status</label>
                      <Select defaultValue="pending">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Cliente</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sem cliente</SelectItem>
                          {clients?.map((client: any) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsAddTransactionOpen(false)}>
                  Salvar Transação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">{formatCurrency(totals.income)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expense)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${totals.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(totals.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <h3 className="text-lg font-medium mb-4">Contas Financeiras</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isLoadingAccounts ? (
          <div className="col-span-3 flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : accounts?.length > 0 ? (
          accounts.map((account: any) => (
            <FinancialAccountCard key={account.id} account={account} />
          ))
        ) : (
          <div className="col-span-3 text-center py-10 bg-white rounded-lg shadow">
            <span className="material-icons text-neutral-400 text-4xl">account_balance_wallet</span>
            <p className="mt-2 text-neutral-500">Nenhuma conta financeira encontrada</p>
          </div>
        )}
        
        <Card className="flex items-center justify-center p-6 border-dashed border-2 border-neutral-300 bg-neutral-50">
          <Button variant="outline">
            <span className="material-icons text-sm mr-1">add</span>
            Adicionar Nova Conta
          </Button>
        </Card>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs defaultValue="transactions" className="w-full">
          <div className="px-6 py-4 border-b border-neutral-200">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions" className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar transações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo o Período</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="thisWeek">Esta Semana</SelectItem>
                    <SelectItem value="thisMonth">Este Mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Transactions Table */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredTransactions?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category || "Não categorizado"}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === "completed" ? "success" : 
                            transaction.status === "pending" ? "outline" : 
                            "destructive"
                          }
                        >
                          {transaction.status === "completed" ? "Concluído" : 
                           transaction.status === "pending" ? "Pendente" : 
                           "Cancelado"}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        transaction.type === "income" ? "text-green-600" : 
                        transaction.type === "expense" ? "text-red-600" : 
                        "text-blue-600"
                      }`}>
                        {transaction.type === "expense" ? "-" : ""}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <span className="material-icons text-sm">edit</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <span className="material-icons text-sm">more_vert</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">account_balance_wallet</span>
                <p className="mt-2 text-neutral-500">Nenhuma transação encontrada</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddTransactionOpen(true)}
                >
                  <span className="material-icons text-sm mr-1">add</span>
                  Adicionar Transação
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cashflow" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas vs. Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="receitas" name="Receitas" fill="#10b981" />
                        <Bar dataKey="despesas" name="Despesas" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Saldo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData.map(item => ({
                          ...item,
                          saldo: item.receitas - item.despesas
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Projeção Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-neutral-500 mb-2">Selecione o período:</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Próximos 30 dias</Button>
                    <Button variant="outline" size="sm">Próximos 60 dias</Button>
                    <Button variant="outline" size="sm">Próximos 90 dias</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-500">A Receber</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold text-green-600">{formatCurrency(75000)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-500">A Pagar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold text-red-600">{formatCurrency(55000)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-500">Saldo Projetado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold text-blue-600">{formatCurrency(20000)}</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Receitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Principais Categorias de Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { name: "Salários", value: 25000 },
                          { name: "Aluguel", value: 12000 },
                          { name: "Serviços", value: 8000 },
                          { name: "Impostos", value: 7500 },
                          { name: "Equipamentos", value: 5000 },
                        ]}
                        margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ formatter: (value) => formatCurrency(value) }} />
                        <YAxis type="category" dataKey="name" width={70} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="value" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="material-icons mb-2">receipt_long</span>
                      <span>DRE</span>
                      <span className="text-xs text-neutral-500 mt-1">Demonstrativo de Resultados</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="material-icons mb-2">account_balance</span>
                      <span>Balanço Patrimonial</span>
                      <span className="text-xs text-neutral-500 mt-1">Ativos e Passivos</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="material-icons mb-2">trending_up</span>
                      <span>Fluxo de Caixa</span>
                      <span className="text-xs text-neutral-500 mt-1">Detalhado por Período</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="material-icons mb-2">account_balance_wallet</span>
                      <span>Contas a Receber</span>
                      <span className="text-xs text-neutral-500 mt-1">Análise de Recebíveis</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="material-icons mb-2">payments</span>
                      <span>Contas a Pagar</span>
                      <span className="text-xs text-neutral-500 mt-1">Obrigações Financeiras</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="material-icons mb-2">summarize</span>
                      <span>Relatório Customizado</span>
                      <span className="text-xs text-neutral-500 mt-1">Crie seu próprio relatório</span>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <span className="material-icons text-sm mr-1">download</span>
                    Exportar Relatórios
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
