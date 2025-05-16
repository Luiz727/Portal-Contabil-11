import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ClientForm from "@/components/clients/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  
  // Fetch all clients
  const { data: clients, isLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch company groups for filtering
  const { data: companyGroups } = useQuery({
    queryKey: ["/api/company-groups"],
    queryFn: async () => {
      // This is just a placeholder since we don't have the endpoint yet
      return [
        { id: 1, name: "Grupo Aurora" },
        { id: 2, name: "Holding XYZ" }
      ];
    }
  });

  // Filter clients by search query
  const filteredClients = clients?.filter((client: any) => {
    return (
      searchQuery === "" || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.cnpj.includes(searchQuery) ||
      (client.responsible && client.responsible.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Group clients by active status
  const activeClients = filteredClients?.filter((client: any) => client.active === true);
  const inactiveClients = filteredClients?.filter((client: any) => client.active === false);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Clientes</h2>
          <p className="mt-1 text-sm text-neutral-500">Gerencie os clientes do escritório</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">add</span>
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <ClientForm 
                onSuccess={() => setIsClientFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Buscar por nome, CNPJ ou responsável..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-80"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs defaultValue="active" className="w-full">
          <div className="px-6 py-4 border-b border-neutral-200">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="inactive">Inativos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : activeClients?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeClients.map((client: any) => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    companyGroups={companyGroups}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">business</span>
                <p className="mt-2 text-neutral-500">Nenhum cliente ativo encontrado</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : inactiveClients?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveClients.map((client: any) => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    companyGroups={companyGroups}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="material-icons text-neutral-400 text-4xl">business_off</span>
                <p className="mt-2 text-neutral-500">Nenhum cliente inativo encontrado</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ClientCard({ client, companyGroups }: { client: any, companyGroups: any[] }) {
  // Find company group name
  const companyGroup = companyGroups?.find(
    (group) => group.id === client.groupId
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-800">{client.name}</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-neutral-600">
                <span className="material-icons text-sm mr-2">badge</span>
                <span>CNPJ: {client.cnpj}</span>
              </div>
              
              {client.email && (
                <div className="flex items-center text-sm text-neutral-600">
                  <span className="material-icons text-sm mr-2">email</span>
                  <span>{client.email}</span>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center text-sm text-neutral-600">
                  <span className="material-icons text-sm mr-2">phone</span>
                  <span>{client.phone}</span>
                </div>
              )}
              
              {client.responsible && (
                <div className="flex items-center text-sm text-neutral-600">
                  <span className="material-icons text-sm mr-2">person</span>
                  <span>Responsável: {client.responsible}</span>
                </div>
              )}
              
              {companyGroup && (
                <div className="flex items-center text-sm text-neutral-600">
                  <span className="material-icons text-sm mr-2">account_tree</span>
                  <span>Grupo: {companyGroup.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <span className="material-icons">edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
              </DialogHeader>
              <ClientForm 
                clientId={client.id} 
                defaultValues={client}
                isEditing
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Badge variant={client.active ? "default" : "outline"}>
            {client.active ? "Ativo" : "Inativo"}
          </Badge>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <span className="material-icons text-sm mr-1">folder</span>
              Documentos
            </Button>
            <Button size="sm" variant="outline">
              <span className="material-icons text-sm mr-1">assignment</span>
              Tarefas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
