import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientForm from '@/components/clients/ClientForm';
import ClientRow from '@/components/clients/ClientRow';
import ClientViewDialog from '@/components/clients/ClientViewDialog';
import { useEmpresas } from '@/contexts/EmpresasContext';
import { useToast } from '@/components/ui/use-toast';

const ClientsPage = () => {
  const { allEmpresasSistema, addEmpresaToSistema, updateEmpresaDataInSistema } = useEmpresas();
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  useEffect(() => {
    setClients(allEmpresasSistema.filter(emp => emp.tipo === 'EmpresaUsuaria'));
  }, [allEmpresasSistema]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    toast({
      title: "Cliente Excluído",
      description: "O cliente foi removido (simulação, aguardando backend).",
      variant: "destructive"
    });
  };
  
  const handleViewClient = (client) => {
    setViewingClient(client);
  };

  const handleFormSubmit = (clientData) => {
    if (editingClient) {
      updateEmpresaDataInSistema(editingClient.id, {...editingClient, ...clientData});
      toast({ title: "Cliente Atualizado!", description: `${clientData.nome} foi atualizado.`, className: "bg-blue-500 text-white"});
    } else {
      const newId = clientData.codigoDominio || `empresa-${Date.now()}`;
      addEmpresaToSistema({ ...clientData, id: newId, tipo: 'EmpresaUsuaria' });
      toast({ title: "Cliente Adicionado!", description: `${clientData.nome} foi adicionado.`, className: "bg-green-500 text-white"});
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const filteredClients = clients.filter(client =>
    (client.nome && client.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.cnpj && client.cnpj.includes(searchTerm)) ||
    (client.contato && client.contato.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.codigoDominio && client.codigoDominio.includes(searchTerm))
  );

  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Empresas Usuárias</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClient} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Empresa Usuária
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl bg-popover border-border text-popover-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">{editingClient ? "Editar Empresa Usuária" : "Adicionar Nova Empresa Usuária"}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingClient ? "Atualize os dados da empresa usuária." : "Preencha os dados da nova empresa usuária."}
              </DialogDescription>
            </DialogHeader>
            <ClientForm client={editingClient} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar por Nome, CNPJ, Contato ou ID Domínio..."
              className="pl-10 bg-input border-border text-foreground focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">ID Domínio</TableHead>
                <TableHead className="text-muted-foreground">Empresa</TableHead>
                <TableHead className="text-muted-foreground">CNPJ</TableHead>
                <TableHead className="text-muted-foreground">Contato</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <ClientRow 
                    key={client.id} 
                    client={client} 
                    onEdit={handleEditClient} 
                    onDelete={handleDeleteClient}
                    onView={handleViewClient}
                    delay={index * 0.05} 
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhuma empresa usuária encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {viewingClient && (
         <ClientViewDialog client={viewingClient} isOpen={!!viewingClient} onClose={() => setViewingClient(null)} />
      )}

    </div>
  );
};

export default ClientsPage;