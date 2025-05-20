import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { Calculator, Save, Send, AlertTriangle, Settings, Eye, Plus, Trash2, ArrowRight } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';

/**
 * Página da Calculadora de Impostos e Custos
 * Permite simular o impacto fiscal e o lucro de vendas
 */
const TaxCalculatorPage = () => {
  const { toast } = useToast();
  const [universalProducts, setUniversalProducts] = useState([
    { id: 1, nome: 'Produto 1', preco_custo: 100, categoria: 'Eletrônicos' },
    { id: 2, nome: 'Produto 2', preco_custo: 200, categoria: 'Móveis' },
    { id: 3, nome: 'Produto 3', preco_custo: 50, categoria: 'Decoração' },
    { id: 4, nome: 'Serviço 1', preco_custo: 80, categoria: 'Serviços' },
  ]);
  
  // Simulações salvas
  const [simulations, setSimulations] = useState([]);
  
  // Simulação atual
  const [formData, setFormData] = useState({
    id: null,
    data: new Date().toISOString().split('T')[0],
    clienteNome: '',
    produtos: [],
    valorVendaTotalGlobal: ''
  });
  
  // Resumo fiscal
  const [summary, setSummary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Configuração de impostos
  const [taxConfig] = useState({
    icms: 18,
    ipi: 5,
    pis: 1.65,
    cofins: 7.60,
    iss: 5,
    simplesNacionalAliquota: 6
  });
  
  // Carregar simulações salvas do localStorage
  useEffect(() => {
    const storedSimulations = localStorage.getItem('nixconTaxSimulations');
    if (storedSimulations) {
      setSimulations(JSON.parse(storedSimulations));
    }
  }, []);
  
  // Salvar simulações no localStorage
  const saveSimulationsToStorage = (updatedSimulations) => {
    localStorage.setItem('nixconTaxSimulations', JSON.stringify(updatedSimulations));
  };
  
  // Resetar formulário
  const resetForm = () => {
    setFormData({
      id: null,
      data: new Date().toISOString().split('T')[0],
      clienteNome: '',
      produtos: [],
      valorVendaTotalGlobal: ''
    });
    setSummary(null);
    setIsEditing(false);
  };
  
  // Atualizar campo do formulário
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Atualizar campo de produto
  const handleProductInputChange = (index, field, value) => {
    const newProdutos = [...formData.produtos];
    newProdutos[index][field] = value;
    
    // Recalcular valor total
    if (field === 'quantidade' || field === 'valorVendaUnitario') {
      const qtd = parseFloat(newProdutos[index].quantidade) || 0;
      const vVenda = parseFloat(newProdutos[index].valorVendaUnitario) || 0;
      newProdutos[index].valorVendaTotal = (qtd * vVenda).toFixed(2);
    }
    
    setFormData(prev => ({ ...prev, produtos: newProdutos }));
  };
  
  // Adicionar produto à simulação
  const addProductToSimulation = (product) => {
    const precoCustoDoProduto = product.preco_custo || 0;
    const newProductEntry = {
      ...product,
      produtoId: product.id,
      quantidade: 1,
      valorVendaUnitario: (precoCustoDoProduto * 1.3).toFixed(2),
      valorVendaTotal: (precoCustoDoProduto * 1.3).toFixed(2),
      precoCusto: precoCustoDoProduto,
    };
    setFormData(prev => ({ ...prev, produtos: [...prev.produtos, newProductEntry] }));
  };
  
  // Remover produto da simulação
  const removeProductFromSimulation = (index) => {
    setFormData(prev => ({ ...prev, produtos: prev.produtos.filter((_, i) => i !== index) }));
  };
  
  // Obter alíquota de imposto para cálculo
  const getTaxRateForCalc = (taxName) => {
    if (taxConfig && taxConfig[taxName]) {
      return parseFloat(taxConfig[taxName]) / 100 || 0;
    }
    return 0;
  };
  
  // Calcular resumo fiscal
  const calculateSummary = () => {
    if (!formData.produtos || formData.produtos.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Adicione produtos à simulação para calcular."
      });
      return;
    }
    
    let faturamentoTotalItens = 0;
    formData.produtos.forEach(p => {
      const qtd = parseFloat(p.quantidade) || 0;
      const vVendaUnitario = parseFloat(p.valorVendaUnitario) || 0;
      faturamentoTotalItens += qtd * vVendaUnitario;
    });
    
    let produtosProcessados = [...formData.produtos];
    let faturamentoFinalCalculo = faturamentoTotalItens;
    
    // Ajustar valores se o valor total global for informado
    if (formData.valorVendaTotalGlobal && parseFloat(formData.valorVendaTotalGlobal) > 0 && faturamentoTotalItens > 0) {
      const valorGlobalNumerico = parseFloat(formData.valorVendaTotalGlobal);
      const fatorDistribuicao = valorGlobalNumerico / faturamentoTotalItens;
      faturamentoFinalCalculo = valorGlobalNumerico;
      
      produtosProcessados = formData.produtos.map(p => {
        const itemFaturamentoOriginal = (parseFloat(p.quantidade) || 0) * (parseFloat(p.valorVendaUnitario) || 0);
        const itemFaturamentoRateado = itemFaturamentoOriginal * fatorDistribuicao;
        const quantidadeValida = parseFloat(p.quantidade) || 1;
        return {
          ...p,
          valorVendaUnitario: (itemFaturamentoRateado / quantidadeValida).toFixed(2),
          valorVendaTotal: itemFaturamentoRateado.toFixed(2)
        };
      });
    }
    
    let custoTotalProdutos = 0;
    let totalImpostosVendas = 0;
    
    produtosProcessados.forEach(p => {
      const qtd = parseFloat(p.quantidade) || 0;
      const pCusto = parseFloat(p.precoCusto || p.preco_custo) || 0;
      const itemFaturamento = parseFloat(p.valorVendaTotal) || 0;
      
      custoTotalProdutos += qtd * pCusto;
      
      let itemImpostosVendas = 0;
      
      // Cálculo simplificado de impostos
      const icmsRate = getTaxRateForCalc('icms');
      const pisRate = getTaxRateForCalc('pis');
      const cofinsRate = getTaxRateForCalc('cofins');
      const ipiRate = getTaxRateForCalc('ipi');
      const issRate = getTaxRateForCalc('iss');
      const simplesRate = getTaxRateForCalc('simplesNacionalAliquota');
      
      // Simular cálculo de regime tributário
      const regimeTributario = 'Simples Nacional';
      
      if (regimeTributario === 'Simples Nacional' && simplesRate > 0) {
        itemImpostosVendas = itemFaturamento * simplesRate;
      } else {
        itemImpostosVendas = itemFaturamento * (icmsRate + pisRate + cofinsRate + issRate) + ((qtd * pCusto) * ipiRate);
      }
      
      totalImpostosVendas += itemImpostosVendas;
    });
    
    // Valores adicionais
    const impostosCompras = custoTotalProdutos * 0.05;
    const difal = faturamentoFinalCalculo * 0.02;
    
    // Cálculo do lucro bruto
    const lucroBruto = faturamentoFinalCalculo - custoTotalProdutos - totalImpostosVendas - impostosCompras - difal;
    
    // Atualizar resumo
    setSummary({
      faturamentoTotal: faturamentoFinalCalculo.toFixed(2),
      custoTotalProdutos: custoTotalProdutos.toFixed(2),
      impostosVendas: totalImpostosVendas.toFixed(2),
      impostosCompras: impostosCompras.toFixed(2),
      difal: difal.toFixed(2),
      lucroBruto: lucroBruto.toFixed(2),
      margemLucro: ((lucroBruto / faturamentoFinalCalculo) * 100).toFixed(2)
    });
    
    toast({ 
      title: "Cálculo Realizado", 
      description: "Os valores foram calculados com sucesso.", 
      className: "bg-green-600 text-white" 
    });
  };
  
  // Salvar simulação
  const handleSaveSimulation = () => {
    if (formData.produtos.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Adicione produtos à simulação antes de salvar." 
      });
      return;
    }
    
    if (!summary) {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Calcule os valores antes de salvar a simulação." 
      });
      return;
    }
    
    let updatedSimulations;
    const simulationDataToSave = { ...formData, summary };
    
    if (isEditing && formData.id) {
      updatedSimulations = simulations.map(sim => 
        sim.id === formData.id ? simulationDataToSave : sim
      );
      toast({ 
        title: "Simulação Atualizada", 
        description: "As alterações foram salvas com sucesso.", 
        className: "bg-blue-600 text-white" 
      });
    } else {
      const newSimulation = { 
        ...simulationDataToSave, 
        id: `sim-${Date.now()}` 
      };
      updatedSimulations = [newSimulation, ...simulations];
      toast({ 
        title: "Simulação Salva", 
        description: "Sua simulação foi salva com sucesso.", 
        className: "bg-green-600 text-white" 
      });
    }
    
    setSimulations(updatedSimulations);
    saveSimulationsToStorage(updatedSimulations);
    resetForm();
  };
  
  // Editar simulação
  const handleEditSimulation = (simulation) => {
    setFormData({
      id: simulation.id,
      data: simulation.data,
      clienteNome: simulation.clienteNome,
      produtos: simulation.produtos.map(p => ({...p})),
      valorVendaTotalGlobal: simulation.valorVendaTotalGlobal || ''
    });
    setSummary(simulation.summary);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Excluir simulação
  const handleDeleteSimulation = (simulationId) => {
    const updatedSimulations = simulations.filter(sim => sim.id !== simulationId);
    setSimulations(updatedSimulations);
    saveSimulationsToStorage(updatedSimulations);
    toast({ 
      title: "Simulação Excluída", 
      description: "A simulação foi removida com sucesso.", 
      variant: "destructive" 
    });
    
    if (formData.id === simulationId) {
      resetForm();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calculator className="mr-2 h-8 w-8 text-primary" /> 
            Calculadora de Impostos e Custos
          </h1>
          <p className="text-muted-foreground">
            Simule o impacto fiscal e o lucro de suas vendas.
          </p>
        </div>
        
        {/* Formulário de Simulação */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Editar Simulação" : "Nova Simulação"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clienteNome">Nome do Cliente</Label>
                <Input
                  id="clienteNome"
                  value={formData.clienteNome}
                  onChange={(e) => handleInputChange('clienteNome', e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                />
              </div>
            </div>
            
            {/* Valor de Venda Global */}
            <div>
              <Label htmlFor="valorVendaTotalGlobal">Valor de Venda Total (opcional)</Label>
              <Input
                id="valorVendaTotalGlobal"
                type="number"
                value={formData.valorVendaTotalGlobal}
                onChange={(e) => handleInputChange('valorVendaTotalGlobal', e.target.value)}
                placeholder="Valor total da venda (opcional)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Ao definir este valor, os preços dos produtos serão ajustados proporcionalmente.
              </p>
            </div>
            
            {/* Lista de Produtos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Produtos na Simulação</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={calculateSummary}
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    Calcular
                  </Button>
                </div>
              </div>
              
              {formData.produtos.length > 0 ? (
                <div className="space-y-4">
                  {formData.produtos.map((produto, index) => (
                    <Card key={index} className="p-2">
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="grow">
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-muted-foreground">Custo: R$ {produto.precoCusto || produto.preco_custo}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor={`qtd-${index}`} className="text-xs">Qtd</Label>
                            <Input
                              id={`qtd-${index}`}
                              type="number"
                              value={produto.quantidade}
                              onChange={(e) => handleProductInputChange(index, 'quantidade', e.target.value)}
                              className="h-8"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`unit-${index}`} className="text-xs">Preço Unit.</Label>
                            <Input
                              id={`unit-${index}`}
                              type="number"
                              value={produto.valorVendaUnitario}
                              onChange={(e) => handleProductInputChange(index, 'valorVendaUnitario', e.target.value)}
                              className="h-8"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`total-${index}`} className="text-xs">Total</Label>
                            <div className="flex items-center">
                              <Input
                                id={`total-${index}`}
                                value={produto.valorVendaTotal}
                                readOnly
                                className="h-8 bg-muted"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-1 text-destructive"
                                onClick={() => removeProductFromSimulation(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Nenhum produto adicionado à simulação.</p>
                </div>
              )}
              
              {/* Produtos Disponíveis */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Adicionar Produtos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {universalProducts.map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className="flex justify-between items-center h-auto py-2 px-3"
                      onClick={() => addProductToSimulation(product)}
                    >
                      <div className="text-left">
                        <p className="font-medium text-sm">{product.nome}</p>
                        <p className="text-xs text-muted-foreground">R$ {product.preco_custo}</p>
                      </div>
                      <Plus className="h-4 w-4 ml-2" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Resumo da Simulação */}
            {summary && (
              <Card className="mt-6 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    Resumo da Simulação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Faturamento</p>
                      <p className="text-xl font-bold">R$ {summary.faturamentoTotal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Custo Produtos</p>
                      <p className="text-xl font-bold">R$ {summary.custoTotalProdutos}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Impostos Vendas</p>
                      <p className="text-xl font-bold">R$ {summary.impostosVendas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Impostos Compras</p>
                      <p className="text-xl font-bold">R$ {summary.impostosCompras}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">DIFAL</p>
                        <p className="text-lg font-medium">R$ {summary.difal}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Lucro Bruto</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-primary">
                            R$ {summary.lucroBruto}
                          </p>
                          <p className="text-lg font-medium">
                            ({summary.margemLucro}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isEditing && (
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleSaveSimulation}
              className="bg-primary text-primary-foreground"
              disabled={!summary}
            >
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Atualizar Simulação' : 'Salvar Simulação'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Simulações Salvas */}
        {simulations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Simulações Salvas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulations.map((simulation) => (
                  <Card key={simulation.id} className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-medium">
                          {simulation.clienteNome || 'Simulação sem cliente'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Data: {new Date(simulation.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm">
                          {simulation.produtos.length} produtos | 
                          Faturamento: R$ {simulation.summary.faturamentoTotal} |
                          Lucro: R$ {simulation.summary.lucroBruto}
                        </p>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSimulation(simulation)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSimulation(simulation.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default TaxCalculatorPage;