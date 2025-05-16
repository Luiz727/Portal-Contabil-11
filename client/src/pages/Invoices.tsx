import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);

  // Fetch all invoices
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["/api/invoices"],
  });

  // Fetch clients for filter
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Filter invoices
  const filteredInvoices = invoices?.filter((invoice: any) => {
    // Text search
    const matchesSearch = 
      searchQuery === "" || 
      invoice.number.includes(searchQuery);
    
    // Client filter
    const matchesClient = clientFilter === "all" || invoice.clientId === parseInt(clientFilter);
    
    // Type filter
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    
    return matchesSearch && matchesClient && matchesType;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Notas Fiscais</h2>
          <p className="mt-1 text-sm text-neutral-500">Gerenciamento de notas fiscais eletrônicas (NF-e e NFS-e)</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isInvoiceFormOpen} onOpenChange={setIsInvoiceFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">add</span>
                Nova Nota Fiscal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Emitir Nova Nota Fiscal</DialogTitle>
              </DialogHeader>
              <InvoiceForm 
                onSuccess={() => setIsInvoiceFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Buscar por número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cliente" />
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="NFe">NF-e</SelectItem>
                <SelectItem value="NFSe">NFS-e</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredInvoices?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice: any) => {
                // Find client name
                const client = clients?.find((c: any) => c.id === invoice.clientId);
                
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {invoice.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{client?.name || "Cliente não encontrado"}</TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.totalValue)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={invoice.status === "active" ? "default" : "destructive"}
                      >
                        {invoice.status === "active" ? "Ativa" : "Cancelada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <span className="material-icons text-sm">visibility</span>
                        </Button>
                        <Button variant="outline" size="sm">
                          <span className="material-icons text-sm">download</span>
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <span className="material-icons text-sm">more_vert</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalhes da Nota Fiscal</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <h3 className="text-lg font-medium">
                                Nota Fiscal {invoice.number}
                              </h3>
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-neutral-500">Tipo</p>
                                    <p>{invoice.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-neutral-500">Status</p>
                                    <p>{invoice.status === "active" ? "Ativa" : "Cancelada"}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-neutral-500">Cliente</p>
                                  <p>{client?.name || "Cliente não encontrado"}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-neutral-500">Data de Emissão</p>
                                    <p>{formatDate(invoice.issueDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-neutral-500">Valor Total</p>
                                    <p className="font-medium">{formatCurrency(invoice.totalValue)}</p>
                                  </div>
                                </div>
                                
                                {invoice.documentId && (
                                  <div>
                                    <p className="text-sm text-neutral-500">Documento XML</p>
                                    <div className="mt-2">
                                      <Button variant="outline" size="sm">
                                        <span className="material-icons text-sm mr-1">download</span>
                                        Download XML
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <Button variant="outline">
                                Duplicar Nota
                              </Button>
                              <Button variant="destructive">
                                {invoice.status === "active" ? "Cancelar Nota" : "Reativar Nota"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <span className="material-icons text-neutral-400 text-4xl">receipt_long</span>
            <p className="mt-2 text-neutral-500">Nenhuma nota fiscal encontrada</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsInvoiceFormOpen(true)}
            >
              <span className="material-icons text-sm mr-1">add</span>
              Emitir Nova Nota
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
