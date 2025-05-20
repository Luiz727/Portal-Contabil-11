import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

/**
 * Componente de formulário para simulação de impostos
 * Permite que o usuário insira os dados necessários para calcular impostos e lucro
 */
const SimulationForm = ({ 
  formData, 
  onInputChange, 
  onProductInputChange, 
  onAddProduct, 
  onRemoveProduct, 
  universalProducts, 
  isEditing,
  calculateTaxes
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');

  const handleAddProduct = () => {
    if (selectedProductId) {
      const productToAdd = universalProducts.find(p => p.id === selectedProductId || p.id === parseInt(selectedProductId));
      if (productToAdd) {
        onAddProduct(productToAdd);
        setSelectedProductId('');
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Nova Simulação de Impostos</CardTitle>
        <CardDescription>
          Informe os produtos, valores e quantidades para cálculo
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="data">Data da Simulação</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => onInputChange('data', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clienteNome">Nome do Cliente</Label>
            <Input
              id="clienteNome"
              placeholder="Cliente para quem a venda será realizada"
              value={formData.clienteNome}
              onChange={(e) => onInputChange('clienteNome', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-md p-4">
            <h3 className="font-medium text-lg mb-4">Produtos</h3>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <Label htmlFor="product-select">Selecionar Produto</Label>
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <SelectTrigger id="product-select" className="w-full">
                    <SelectValue placeholder="Selecione um produto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {universalProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.nome || product.name} - {formatCurrency(product.preco_custo || product.precoCusto || 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="button" 
                  onClick={handleAddProduct}
                  className="w-full"
                  disabled={!selectedProductId}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </div>
            </div>
            
            {formData.produtos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Custo (R$)</TableHead>
                      <TableHead>Quant.</TableHead>
                      <TableHead>Venda Unit. (R$)</TableHead>
                      <TableHead>Total (R$)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.produtos.map((produto, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{produto.nome || produto.name}</TableCell>
                        <TableCell>
                          {formatCurrency(produto.precoCusto || produto.preco_custo || 0)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={produto.quantidade}
                            onChange={(e) => onProductInputChange(index, 'quantidade', e.target.value)}
                            className="w-16 text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={produto.valorVendaUnitario}
                            onChange={(e) => onProductInputChange(index, 'valorVendaUnitario', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          {formatCurrency(produto.valorVendaTotal || 0)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemoveProduct(index)}
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
              <div className="text-center p-6 border border-dashed rounded-md bg-gray-50">
                <p className="text-gray-500">Nenhum produto adicionado à simulação</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valorVendaTotalGlobal">
              Valor Total da Venda (opcional - sobreescreve o somatório dos produtos)
            </Label>
            <Input
              id="valorVendaTotalGlobal"
              type="number"
              min="0"
              step="0.01"
              placeholder="Deixe em branco para usar a soma automática"
              value={formData.valorVendaTotalGlobal}
              onChange={(e) => onInputChange('valorVendaTotalGlobal', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se informado, o sistema distribuirá este valor proporcionalmente entre os produtos.
            </p>
          </div>
          
          <div className="pt-4 flex justify-center">
            <Button 
              type="button" 
              onClick={calculateTaxes}
              className="bg-amber-600 hover:bg-amber-700 text-white w-full md:w-auto"
              disabled={formData.produtos.length === 0}
              size="lg"
            >
              <Calculator className="mr-2 h-5 w-5" /> Calcular Impostos e Lucro
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationForm;