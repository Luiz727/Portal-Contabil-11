import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, FileText, PlusCircle, Filter, Download, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const accountsPayable = [
  { id: 1, description: "Aluguel Escritório", dueDate: "2025-06-05", amount: 2500.00, status: "Pendente" },
  { id: 2, description: "Software Contábil", dueDate: "2025-06-10", amount: 350.00, status: "Pendente" },
  { id: 3, description: "Energia Elétrica", dueDate: "2025-05-20", amount: 450.75, status: "Pago" },
];

const accountsReceivable = [
  { id: 1, client: "Empresa Alpha Ltda.", dueDate: "2025-06-01", amount: 1200.00, status: "Pendente" },
  { id: 2, client: "Comércio Beta S.A.", dueDate: "2025-05-28", amount: 850.00, status: "Recebido" },
  { id: 3, client: "Serviços Gama ME", dueDate: "2025-06-15", amount: 1500.00, status: "Pendente" },
];

const TransactionRow = ({ transaction, type, delay }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="hover:bg-accent/50 transition-colors"
  >
    <TableCell className="font-medium text-foreground">
      {type === 'payable' ? transaction.description : transaction.client}
    </TableCell>
    <TableCell className="text-muted-foreground hidden sm:table-cell">
      {new Date(transaction.dueDate).toLocaleDateString()}
    </TableCell>
    <TableCell className="text-foreground">
      R$ {transaction.amount.toFixed(2)}
    </TableCell>
    <TableCell>
      <Badge className={
        transaction.status === "Pendente" ? "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30" :
        transaction.status === "Recebido" || transaction.status === "Pago" ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" :
        "bg-muted text-muted-foreground"
      }>
        {transaction.status}
      </Badge>
    </TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Detalhes</Button>
    </TableCell>
  </motion.tr>
);

// Versão responsiva em card para telas pequenas
const TransactionCard = ({ transaction, type, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm transition-colors"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-medium text-foreground">
        {type === 'payable' ? transaction.description : transaction.client}
      </h3>
      <Badge className={
        transaction.status === "Pendente" ? "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30" :
        transaction.status === "Recebido" || transaction.status === "Pago" ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" :
        "bg-muted text-muted-foreground"
      }>
        {transaction.status}
      </Badge>
    </div>
    <div className="text-sm text-muted-foreground space-y-1">
      <div className="flex justify-between">
        <span>Vencimento:</span>
        <span>{new Date(transaction.dueDate).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Valor:</span>
        <span className="font-semibold text-foreground">R$ {transaction.amount.toFixed(2)}</span>
      </div>
    </div>
    <div className="mt-3 flex justify-end">
      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver Detalhes</Button>
    </div>
  </motion.div>
);

const FinancialPage = () => {
  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
            <DollarSign className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-primary" /> 
            Gestão Financeira
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Acompanhe suas contas a pagar, a receber e fluxo de caixa.
          </p>
        </div>
        
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Lançamento
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1"
        >
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Atual</CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 15.230,45</div>
              <p className="text-xs text-muted-foreground pt-1">Atualizado em {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">A Receber (30 dias)</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 8.750,00</div>
              <p className="text-xs text-muted-foreground pt-1">12 faturas pendentes</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, delay: 0.3 }}
          className="col-span-1"
        >
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">A Pagar (30 dias)</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 3.300,50</div>
              <p className="text-xs text-muted-foreground pt-1">5 contas a vencer</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl text-foreground">Transações Financeiras</CardTitle>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Buscar transações..."
                  className="pl-9 bg-input border-border text-foreground focus:border-primary w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="receivable" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
              <TabsTrigger value="receivable">A Receber</TabsTrigger>
              <TabsTrigger value="payable">A Pagar</TabsTrigger>
              <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="receivable" className="mt-6">
              {/* Vista em tabela para telas maiores */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Cliente/Descrição</TableHead>
                      <TableHead className="text-muted-foreground">Vencimento</TableHead>
                      <TableHead className="text-muted-foreground">Valor</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsReceivable.map((transaction, index) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        type="receivable"
                        delay={index * 0.05}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Vista em cards para telas menores */}
              <div className="grid gap-4 sm:hidden">
                {accountsReceivable.map((transaction, index) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    type="receivable"
                    delay={index * 0.05}
                  />
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="text-muted-foreground hover:text-foreground">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payable" className="mt-6">
              {/* Vista em tabela para telas maiores */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Descrição</TableHead>
                      <TableHead className="text-muted-foreground">Vencimento</TableHead>
                      <TableHead className="text-muted-foreground">Valor</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsPayable.map((transaction, index) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        type="payable"
                        delay={index * 0.05}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Vista em cards para telas menores */}
              <div className="grid gap-4 sm:hidden">
                {accountsPayable.map((transaction, index) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    type="payable"
                    delay={index * 0.05}
                  />
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="text-muted-foreground hover:text-foreground">
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="cashflow">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Gráfico de Fluxo de Caixa em desenvolvimento...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialPage;