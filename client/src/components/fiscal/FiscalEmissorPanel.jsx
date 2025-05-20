import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FileBarChart2, 
  PlusCircle, 
  Filter, 
  Download, 
  Upload, 
  Search,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados de exemplo de notas fiscais
const invoiceData = [
  { id: 1, number: "001248", type: "NF-e", client: "Empresa Alpha Ltda.", value: 1500.00, date: "2025-05-10", status: "Autorizada" },
  { id: 2, number: "001249", type: "NF-e", client: "Comércio Beta S.A.", value: 3750.50, date: "2025-05-12", status: "Autorizada" },
  { id: 3, number: "000287", type: "NFS-e", client: "Serviços Gama ME", value: 2300.00, date: "2025-05-15", status: "Rejeitada" },
  { id: 4, number: "001250", type: "NF-e", client: "Distribuidora Delta", value: 4200.75, date: "2025-05-18", status: "Pendente" },
];

// Componente de linha da tabela de notas fiscais para telas maiores
const InvoiceRow = ({ invoice, delay }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="hover:bg-accent/50 transition-colors"
  >
    <TableCell className="font-medium">{invoice.number}</TableCell>
    <TableCell className="hidden sm:table-cell">{invoice.type}</TableCell>
    <TableCell className="hidden md:table-cell">{invoice.client}</TableCell>
    <TableCell>R$ {invoice.value.toFixed(2)}</TableCell>
    <TableCell className="hidden lg:table-cell">{invoice.date}</TableCell>
    <TableCell>
      <Badge className={
        invoice.status === "Autorizada" ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" :
        invoice.status === "Rejeitada" ? "bg-red-500/20 text-red-600 hover:bg-red-500/30" :
        "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
      }>
        {invoice.status}
      </Badge>
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8 px-2 text-xs">
          Visualizar
        </Button>
        <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 h-8 px-2 text-xs">
          DANFE
        </Button>
      </div>
    </TableCell>
  </motion.tr>
);

// Componente de card para notas fiscais em telas pequenas
const InvoiceCard = ({ invoice, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 shadow-sm transition-colors"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <div>
          <span className="font-medium text-foreground">{invoice.number}</span>
          <span className="text-xs text-muted-foreground ml-2">{invoice.type}</span>
        </div>
      </div>
      <Badge className={
        invoice.status === "Autorizada" ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" :
        invoice.status === "Rejeitada" ? "bg-red-500/20 text-red-600 hover:bg-red-500/30" :
        "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
      }>
        {invoice.status}
      </Badge>
    </div>
    <div className="text-xs text-muted-foreground space-y-1">
      <div className="flex justify-between">
        <span>Cliente:</span>
        <span className="text-foreground truncate max-w-[160px]">{invoice.client}</span>
      </div>
      <div className="flex justify-between">
        <span>Valor:</span>
        <span className="text-foreground">R$ {invoice.value.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Data:</span>
        <span className="text-foreground">{invoice.date}</span>
      </div>
    </div>
    <div className="mt-3 flex justify-end gap-2">
      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs h-8 px-2">
        Visualizar
      </Button>
      <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 text-xs h-8 px-2">
        DANFE
      </Button>
    </div>
  </motion.div>
);

const FiscalEmissorPanel = () => {
  const [activeTab, setActiveTab] = useState("nfe");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todos");

  // Filtrar dados de notas fiscais
  const filteredInvoices = invoiceData.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    // Filtro por data seria implementado aqui com lógica real
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto flex flex-col xs:flex-row gap-2">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Emitir Nota
          </Button>
          <Button 
            variant="outline" 
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" /> Importar XML
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl text-foreground">Documentos Fiscais</CardTitle>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Buscar por número ou cliente..."
                  className="pl-9 bg-input border-border text-foreground focus:border-primary w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nfe" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="grid grid-cols-4 sm:inline-flex">
                <TabsTrigger value="nfe">NF-e</TabsTrigger>
                <TabsTrigger value="nfse">NFS-e</TabsTrigger>
                <TabsTrigger value="nfce">NFC-e</TabsTrigger>
                <TabsTrigger value="cte">CT-e</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-input border-border text-foreground focus:border-primary text-xs sm:text-sm w-full sm:w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="autorizada">Autorizadas</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-input border-border text-foreground focus:border-primary text-xs sm:text-sm w-full sm:w-36">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem value="todos">Todos Períodos</SelectItem>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="semana">Esta Semana</SelectItem>
                    <SelectItem value="mes">Este Mês</SelectItem>
                    <SelectItem value="customizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="nfe" className="mt-4">
              {/* Vista em tabela para telas maiores */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Número</TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">Tipo</TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">Cliente</TableHead>
                      <TableHead className="text-muted-foreground">Valor</TableHead>
                      <TableHead className="text-muted-foreground hidden lg:table-cell">Data</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice, index) => (
                      <InvoiceRow 
                        key={invoice.id} 
                        invoice={invoice} 
                        delay={index * 0.05} 
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Vista em cards para telas menores */}
              <div className="grid gap-4 sm:hidden">
                {filteredInvoices.map((invoice, index) => (
                  <InvoiceCard 
                    key={invoice.id} 
                    invoice={invoice} 
                    delay={index * 0.05} 
                  />
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-muted-foreground">
                  Exibindo {filteredInvoices.length} de {invoiceData.length} documentos
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
                  >
                    <Download className="mr-2 h-4 w-4" /> Exportar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
                  >
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nfse">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Conteúdo da aba NFS-e em desenvolvimento...
              </div>
            </TabsContent>
            
            <TabsContent value="nfce">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Conteúdo da aba NFC-e em desenvolvimento...
              </div>
            </TabsContent>
            
            <TabsContent value="cte">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Conteúdo da aba CT-e em desenvolvimento...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiscalEmissorPanel;