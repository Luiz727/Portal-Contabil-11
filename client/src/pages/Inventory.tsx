import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Fetch inventory items
  const { data: items, isLoading } = useQuery({
    queryKey: ["/api/inventory/items"],
  });

  // Fetch clients for filter
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Filter items
  const filteredItems = items?.filter((item: any) => {
    // Text search
    const matchesSearch = 
      searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sku && item.sku.includes(searchQuery));
    
    // Client filter
    const matchesClient = clientFilter === "all" || item.clientId === parseInt(clientFilter);
    
    // Stock filter
    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = item.quantity <= (item.minQuantity || 0);
    } else if (stockFilter === "out") {
      matchesStock = item.quantity <= 0;
    }
    
    return matchesSearch && matchesClient && matchesStock;
  });

  // Calculate inventory stats
  const calculateStats = () => {
    if (!items) return { totalItems: 0, totalValue: 0, lowStock: 0 };
    
    const totalItems = items.length;
    const totalValue = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * (item.costPrice || 0));
    }, 0);
    const lowStock = items.filter((item: any) => item.quantity <= (item.minQuantity || 0)).length;
    
    return {
      totalItems,
      totalValue,
      lowStock
    };
  };

  const stats = calculateStats();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Controle de Estoque</h2>
          <p className="mt-1 text-sm text-neutral-500">Gerenciamento de produtos, insumos e materiais</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <span className="material-icons text-sm mr-1">add</span>
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Item ao Estoque</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Nome</label>
                    <Input placeholder="Nome do item" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Descrição</label>
                    <Input placeholder="Descrição do item" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">SKU</label>
                      <Input placeholder="Código SKU" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Unidade</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="und">Unidade</SelectItem>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="m">Metro</SelectItem>
                          <SelectItem value="lt">Litro</SelectItem>
                          <SelectItem value="cx">Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Quantidade</label>
                      <Input type="number" placeholder="0" min="0" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Preço de Custo</label>
                      <Input placeholder="0,00" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Preço de Venda</label>
                      <Input placeholder="0,00" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Estoque Mínimo</label>
                      <Input type="number" placeholder="0" min="0" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Cliente</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {!isLoadingClients && clients?.map((client: any) => (
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
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsAddItemOpen(false)}>
                  Salvar Item
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
            <CardTitle className="text-sm font-medium text-neutral-500">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-neutral-800">{stats.totalItems}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Valor Total em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">{formatCurrency(stats.totalValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Itens com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-600">{stats.lowStock}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Buscar por nome, SKU ou descrição..."
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
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estoque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o Estoque</SelectItem>
                <SelectItem value="low">Estoque Baixo</SelectItem>
                <SelectItem value="out">Em Falta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredItems?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preço de Custo</TableHead>
                <TableHead>Preço de Venda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-neutral-500">{item.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.sku || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{item.quantity}</span>
                      <span className="text-neutral-500 ml-1">{item.unit || "un"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.costPrice || 0)}</TableCell>
                  <TableCell>{formatCurrency(item.salePrice || 0)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.quantity <= 0 ? "destructive" : 
                        item.quantity <= (item.minQuantity || 0) ? "warning" : 
                        "success"
                      }
                    >
                      {item.quantity <= 0 ? "Em Falta" : 
                       item.quantity <= (item.minQuantity || 0) ? "Estoque Baixo" : 
                       "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <span className="material-icons text-sm">add</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <span className="material-icons text-sm">remove</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        <span className="material-icons text-sm">edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <span className="material-icons text-neutral-400 text-4xl">inventory</span>
            <p className="mt-2 text-neutral-500">Nenhum item de estoque encontrado</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddItemOpen(true)}
            >
              <span className="material-icons text-sm mr-1">add</span>
              Adicionar Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
