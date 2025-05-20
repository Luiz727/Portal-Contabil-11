import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, FileText, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    className="hover:bg-slate-800/50 transition-colors"
  >
    {type === 'payable' ? (
      <TableCell className="font-medium text-gray-200">{transaction.description}</TableCell>
    ) : (
      <TableCell className="font-medium text-gray-200">{transaction.client}</TableCell>
    )}
    <TableCell className="text-gray-400">{new Date(transaction.dueDate).toLocaleDateString()}</TableCell>
    <TableCell className="text-gray-400">R$ {transaction.amount.toFixed(2)}</TableCell>
    <TableCell>
      <span className={`px-2 py-1 text-xs rounded-full ${
        transaction.status === "Pendente" || transaction.status === "Atrasado" ? "bg-orange-500/30 text-orange-300" :
        transaction.status === "Pago" || transaction.status === "Recebido" ? "bg-green-500/30 text-green-300" :
        "bg-gray-500/30 text-gray-300"
      }`}>
        {transaction.status}
      </span>
    </TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">Detalhes</Button>
    </TableCell>
  </motion.tr>
);

const FinancialPage = () => {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-4xl font-bold gradient-text">Gestão Financeira</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Lançamento
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo Atual</CardTitle>
              <DollarSign className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">R$ 15.230,45</div>
              <p className="text-xs text-gray-500 pt-1">Atualizado em {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total a Receber (Próx. 30 dias)</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">R$ 8.750,00</div>
              <p className="text-xs text-gray-500 pt-1">Referente a 12 faturas</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total a Pagar (Próx. 30 dias)</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">R$ 3.300,50</div>
              <p className="text-xs text-gray-500 pt-1">Referente a 5 contas</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="receivable" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-slate-800/60 border border-slate-700 p-1 h-auto">
          <TabsTrigger value="receivable" className="data-[state=active]:bg-purple-500/80 data-[state=active]:text-white text-gray-300">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payable" className="data-[state=active]:bg-purple-500/80 data-[state=active]:text-white text-gray-300">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="cashflow" className="data-[state=active]:bg-purple-500/80 data-[state=active]:text-white text-gray-300">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-purple-500/80 data-[state=active]:text-white text-gray-300 hidden md:inline-flex">Boletos</TabsTrigger>
          <TabsTrigger value="reconciliation" className="data-[state=active]:bg-purple-500/80 data-[state=active]:text-white text-gray-300 hidden md:inline-flex">Conciliação</TabsTrigger>
        </TabsList>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <TabsContent value="receivable" className="mt-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Contas a Receber</CardTitle>
                <CardDescription className="text-gray-400">Acompanhe os recebimentos pendentes e realizados.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">Cliente</TableHead>
                      <TableHead className="text-gray-300">Vencimento</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsReceivable.map((item, index) => <TransactionRow key={item.id} transaction={item} type="receivable" delay={index * 0.05} />)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payable" className="mt-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Contas a Pagar</CardTitle>
                <CardDescription className="text-gray-400">Gerencie seus pagamentos e despesas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-gray-300">Descrição</TableHead>
                      <TableHead className="text-gray-300">Vencimento</TableHead>
                      <TableHead className="text-gray-300">Valor</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-right text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsPayable.map((item, index) => <TransactionRow key={item.id} transaction={item} type="payable" delay={index * 0.05} />)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cashflow" className="mt-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Fluxo de Caixa</CardTitle>
                <CardDescription className="text-gray-400">Visualize as entradas e saídas ao longo do tempo.</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Gráfico do Fluxo de Caixa (Em desenvolvimento)</p>
                {/* Aqui entraria um componente de gráfico */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Emissão de Boletos</CardTitle>
                <CardDescription className="text-gray-400">Gere e envie boletos para seus clientes.</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Funcionalidade de Emissão de Boletos (Em desenvolvimento)</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reconciliation" className="mt-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Conciliação Bancária</CardTitle>
                <CardDescription className="text-gray-400">Importe extratos OFX/CSV e concilie com seus lançamentos.</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-gray-400">Funcionalidade de Conciliação Bancária (Em desenvolvimento)</p>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default FinancialPage;