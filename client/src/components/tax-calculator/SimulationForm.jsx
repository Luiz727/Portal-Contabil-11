import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Package, Search, XCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

const SimulationForm = ({
  formData,
  handleInputChange,
  handleProductInputChange,
  addProductToSimulation,
  removeProductFromSimulation,
  calculateSummary,
  universalProducts,
  isEditing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const filteredProducts = universalProducts.filter(product => 
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ncm?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const { data, clienteNome, produtos, valorVendaTotalGlobal } = formData;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          {isEditing ? 'Editar Simulação' : 'Nova Simulação de Impostos'}
        </CardTitle>
        <CardDescription>
          Simule a tributação e lucro sobre vendas para auxiliar em estratégias de precificação
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data">Data da Simulação</Label>
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="clienteNome">Nome do Cliente</Label>
            <Input
              id="clienteNome"
              value={clienteNome}
              onChange={(e) => handleInputChange('clienteNome', e.target.value)}
              placeholder="Nome do cliente ou identificação"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Produtos</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Selecionar Produto</DialogTitle>
                  <DialogDescription>
                    Busque e adicione produtos à sua simulação de impostos
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4 mb-4 relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                  {searchTerm && (
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchTerm('')}
                    >
                      <XCircle className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
                
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Referência</TableHead>
                        <TableHead>Preço Custo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.nome}</TableCell>
                            <TableCell>{product.referencia || '-'}</TableCell>
                            <TableCell>
                              {product.preco_custo ? 
                                new Intl.NumberFormat('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL' 
                                }).format(product.preco_custo) 
                                : 'R$ 0,00'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  addProductToSimulation(product);
                                  setDialogOpen(false);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" /> Adicionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {produtos.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Nome</TableHead>
                    <TableHead>Qtd.</TableHead>
                    <TableHead>Preço Custo</TableHead>
                    <TableHead>Preço Venda</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={produto.quantidade || ''}
                          onChange={(e) => handleProductInputChange(index, 'quantidade', e.target.value)}
                          className="w-16 h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(produto.precoCusto || 0)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={produto.valorVendaUnitario || ''}
                          onChange={(e) => handleProductInputChange(index, 'valorVendaUnitario', e.target.value)}
                          className="w-28 h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(produto.valorVendaTotal || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProductFromSimulation(index)}
                          className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-8 text-center space-y-4 bg-muted/40">
              <div className="flex justify-center">
                <Package className="h-12 w-12 text-muted-foreground opacity-40" />
              </div>
              <h3 className="text-lg font-medium">Nenhum produto adicionado</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Adicione produtos à sua simulação para calcular os impostos e estimar o lucro da operação.
              </p>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-2" onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Primeiro Produto
                </Button>
              </DialogTrigger>
            </div>
          )}
        </div>
        
        {produtos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 w-full">
                <Label htmlFor="valorVendaTotal" className="flex items-center">
                  Valor Total da Venda (opcional)
                  <Info 
                    className="h-4 w-4 ml-1 text-muted-foreground cursor-help" 
                    title="Se preenchido, a calculadora distribuirá este valor entre os produtos proporcionalmente"
                  />
                </Label>
                <Input
                  id="valorVendaTotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorVendaTotalGlobal || ''}
                  onChange={(e) => handleInputChange('valorVendaTotalGlobal', e.target.value)}
                  placeholder="Valor personalizado para toda a venda"
                  className="mt-1"
                />
              </div>
              
              <Button
                className="mt-5 w-full md:w-auto"
                onClick={() => calculateSummary(produtos, valorVendaTotalGlobal)}
              >
                Calcular Impostos
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationForm;