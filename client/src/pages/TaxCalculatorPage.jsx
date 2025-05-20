import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calculator, Save, Send, AlertTriangle, Settings, CalculatorIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import ProductService from '@/services/ProductService';
import SimulationForm from '@/components/tax-calculator/SimulationForm';
import TaxSummaryDisplay from '@/components/tax-calculator/TaxSummaryDisplay';
import SavedSimulationsList from '@/components/tax-calculator/SavedSimulationsList';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaxCalculatorPage = () => {
  const { toast } = useToast();
  
  // Em um cenário real, esses dados viriam de um contexto de autenticação
  const user = { id: 1, name: 'Usuário Demonstração', type: 'EmpresaUsuaria' };
  const empresaAtual = { 
    id: 1, 
    nome: 'Empresa Demo Ltda', 
    regime_tributario: 'Simples Nacional',
    config_fiscal_padrao: {
      icms: 18,
      pis: 1.65,
      cofins: 7.6,
      ipi: 5,
      iss: 5,
      simplesNacionalAliquota: 6
    }
  };
  
  const [activeTab, setActiveTab] = useState('form');
  const [simulations, setSimulations] = useState([]);
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormData = {
    id: null,
    data: new Date().toISOString().split('T')[0],
    clienteNome: '',
    produtos: [], 
    valorVendaTotalGlobal: '', 
    empresaIdContexto: empresaAtual?.id || null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [summary, setSummary] = useState(null);
  const [universalProducts, setUniversalProducts] = useState([]);
  const [userTaxConfig, setUserTaxConfig] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ProductService.getUniversalProducts();
        setUniversalProducts(products);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast({ 
          variant: "destructive", 
          title: "Erro ao carregar produtos", 
          description: "Não foi possível carregar a lista de produtos." 
        });
      }
    }
    fetchProducts();
    
    const storedSimulations = localStorage.getItem('taxSimulations');
    if (storedSimulations) {
      try {
        setSimulations(JSON.parse(storedSimulations));
      } catch (e) {
        console.error('Erro ao carregar simulações salvas:', e);
      }
    }

    if (user && user.type === 'UsuarioCalculadora') {
      const storedConfig = localStorage.getItem(`taxConfig_${user.id}`);
      if (storedConfig) {
        try {
          setUserTaxConfig(JSON.parse(storedConfig));
        } catch (e) {
          console.error('Erro ao carregar configuração fiscal do usuário:', e);
          setUserTaxConfig({ 
            icms: '18', 
            ipi: '5', 
            pis: '1.65', 
            cofins: '7.60', 
            iss: '5', 
            simplesNacionalAliquota: '6' 
          }); 
        }
      } else {
        setUserTaxConfig({ 
          icms: '18', 
          ipi: '5', 
          pis: '1.65', 
          cofins: '7.60', 
          iss: '5', 
          simplesNacionalAliquota: '6' 
        }); 
      }
    } else {
      setUserTaxConfig(null); 
    }
  }, [toast]);

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      empresaIdContexto: empresaAtual ? empresaAtual.id : null 
    }));
  }, [empresaAtual]);

  const saveSimulationsToStorage = (updatedSimulations) => {
    try {
      localStorage.setItem('taxSimulations', JSON.stringify(updatedSimulations));
    } catch (e) {
      console.error('Erro ao salvar simulações:', e);
      toast({ 
        variant: "destructive", 
        title: "Erro ao salvar", 
        description: "Não foi possível salvar as simulações localmente." 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      empresaIdContexto: empresaAtual ? empresaAtual.id : null,
    });
    setCurrentSimulation(null);
    setIsEditing(false);
    setSummary(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductInputChange = (index, field, value) => {
    const newProdutos = [...formData.produtos];
    newProdutos[index][field] = value;
    
    if (field === 'quantidade' || field === 'valorVendaUnitario') {
      const qtd = parseFloat(newProdutos[index].quantidade) || 0;
      const vVenda = parseFloat(newProdutos[index].valorVendaUnitario) || 0;
      newProdutos[index].valorVendaTotal = qtd * vVenda;
    }
    
    setFormData(prev => ({ ...prev, produtos: newProdutos }));
  };

  const addProductToSimulation = (product) => {
    const precoCustoDoProduto = product.preco_custo || 0;
    const markupPadrao = 1.3; // 30% de margem inicial
    
    const newProductEntry = {
      ...product, 
      produtoId: product.id, 
      quantidade: 1,
      valorVendaUnitario: precoCustoDoProduto * markupPadrao, 
      valorVendaTotal: precoCustoDoProduto * markupPadrao,
      precoCusto: precoCustoDoProduto,
    };
    
    setFormData(prev => ({ 
      ...prev, 
      produtos: [...prev.produtos, newProductEntry] 
    }));
  };

  const removeProductFromSimulation = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      produtos: prev.produtos.filter((_, i) => i !== index) 
    }));
  };

  const getTaxRateForCalc = (product, taxName) => {
    if (user.type === 'UsuarioCalculadora' && userTaxConfig && userTaxConfig[taxName]) {
      return parseFloat(userTaxConfig[taxName]) / 100 || 0;
    }
    
    if (product && product.config_fiscal) {
      const configFiscal = product.config_fiscal;
      if (taxName === 'icms' && configFiscal.icms !== undefined) return parseFloat(configFiscal.icms);
      if (taxName === 'pis' && configFiscal.pis !== undefined) return parseFloat(configFiscal.pis);
      if (taxName === 'cofins' && configFiscal.cofins !== undefined) return parseFloat(configFiscal.cofins);
      if (taxName === 'ipi' && configFiscal.ipi !== undefined) return parseFloat(configFiscal.ipi); 
      if (taxName === 'iss' && configFiscal.iss !== undefined) return parseFloat(configFiscal.iss);
      if (taxName === 'simplesNacionalAliquota' && configFiscal.simplesNacionalAliquota !== undefined) 
        return parseFloat(configFiscal.simplesNacionalAliquota);
    }

    if (empresaAtual && empresaAtual.config_fiscal_padrao && empresaAtual.config_fiscal_padrao[taxName]) {
      return parseFloat(empresaAtual.config_fiscal_padrao[taxName]) / 100;
    }
    
    // Valores padrão caso nenhuma configuração seja encontrada
    const defaultValues = {
      icms: 0.18,
      pis: 0.0165,
      cofins: 0.076,
      ipi: 0.05,
      iss: 0.05,
      simplesNacionalAliquota: 0.06
    };
    
    return defaultValues[taxName] || 0;
  };

  // IMPORTANTE: Eliminada função calculateSummary que estava causando atualizações infinitas
  

  // Removemos completamente o useEffect que causava atualização infinita
  
  // Realizamos o cálculo apenas quando o usuário clicar no botão "Calcular Impostos"
  const realizarCalculo = () => {
    if (formData.produtos.length === 0) {
      toast({ 
        variant: "destructive",
        title: "Sem produtos", 
        description: "Adicione produtos para realizar o cálculo.",
        duration: 3000 // Desaparece em 3 segundos
      });
      return;
    }
    
    try {
      // Primeiro, processamos os produtos e suas quantidades/valores
      const produtos = [...formData.produtos];
      let faturamentoTotalItens = 0;
      let custoTotalProdutos = 0;
      
      // Calcular faturamento total dos itens
      produtos.forEach(p => {
        const qtd = parseFloat(p.quantidade) || 0;
        const vVendaUnitario = parseFloat(p.valorVendaUnitario) || 0;
        const pCusto = parseFloat(p.precoCusto || p.preco_custo) || 0;
        
        faturamentoTotalItens += qtd * vVendaUnitario;
        custoTotalProdutos += qtd * pCusto;
      });
      
      // Determinar o faturamento final de cálculo (com possível rateio global)
      const valorGlobalNumerico = formData.valorVendaTotalGlobal ? parseFloat(formData.valorVendaTotalGlobal) : 0;
      let faturamentoFinalCalculo = faturamentoTotalItens;
      
      if (valorGlobalNumerico > 0 && faturamentoTotalItens > 0) {
        faturamentoFinalCalculo = valorGlobalNumerico;
      }
      
      // Calcular impostos
      let totalImpostosVendas = 0;
      
      if (empresaAtual && empresaAtual.regime_tributario === 'Simples Nacional') {
        const aliquota = (empresaAtual.config_fiscal_padrao.simplesNacionalAliquota || 6) / 100;
        totalImpostosVendas = faturamentoFinalCalculo * aliquota;
      } else {
        const icmsRate = 0.18; // 18%
        const pisRate = 0.0165; // 1.65%
        const cofinsRate = 0.076; // 7.6%
        totalImpostosVendas = faturamentoFinalCalculo * (icmsRate + pisRate + cofinsRate);
      }
      
      // Calcular outros valores
      const impostosCompras = custoTotalProdutos * 0.05; // Créditos tributários estimados em 5% do custo
      const difal = faturamentoFinalCalculo * 0.02; // Estimativa de DIFAL em 2% do faturamento
      const lucroBruto = faturamentoFinalCalculo - custoTotalProdutos - totalImpostosVendas - impostosCompras - difal;
      
      // Atualizar o sumário
      setSummary({
        faturamentoTotal: faturamentoFinalCalculo,
        custoTotalProdutos,
        impostosVendas: totalImpostosVendas,
        impostosCompras,
        difal,
        lucroBruto,
      });
      
      // Notificar o usuário apenas quando solicitado explicitamente
      toast({ 
        title: "Cálculos Realizados", 
        description: "Os impostos e margens foram calculados com sucesso.",
        className: "bg-primary text-primary-foreground",
        duration: 3000 // Desaparece em 3 segundos
      });
    } catch (error) {
      console.error('Erro ao calcular impostos:', error);
      toast({ 
        variant: "destructive",
        title: "Erro nos cálculos", 
        description: "Ocorreu um erro ao calcular os impostos. Verifique os valores informados.",
        duration: 3000
      });
    }
  };
  

  const handleSaveSimulation = () => {
    if (formData.produtos.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Adicione produtos à simulação antes de salvar." 
      });
      return;
    }
    
    let updatedSimulations;
    const simulationDataToSave = { 
      ...formData, 
      summary, 
      empresaIdContexto: empresaAtual ? empresaAtual.id : null 
    };

    if (isEditing && formData.id) {
      updatedSimulations = simulations.map(sim => 
        sim.id === formData.id ? simulationDataToSave : sim
      );
      toast({ 
        title: "Simulação Atualizada!", 
        description: "As alterações foram salvas.", 
        className: "bg-blue-500 text-white" 
      });
    } else {
      const newSimulation = { 
        ...simulationDataToSave, 
        id: `sim-${Date.now()}` 
      };
      updatedSimulations = [newSimulation, ...simulations];
      toast({ 
        title: "Simulação Salva!", 
        description: "Sua simulação foi salva com sucesso.", 
        className: "bg-green-500 text-white" 
      });
    }
    
    setSimulations(updatedSimulations);
    saveSimulationsToStorage(updatedSimulations);
    resetForm();
    setActiveTab('saved');
  };

  const handleEditSimulation = (simulation) => {
    setCurrentSimulation(simulation);
    setFormData({
      id: simulation.id,
      data: simulation.data,
      clienteNome: simulation.clienteNome,
      produtos: simulation.produtos.map(p => ({...p})), 
      valorVendaTotalGlobal: simulation.valorVendaTotalGlobal || '',
      empresaIdContexto: simulation.empresaIdContexto || (empresaAtual ? empresaAtual.id : null),
    });
    setSummary(simulation.summary);
    setIsEditing(true);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSimulation = (simulationId) => {
    const updatedSimulations = simulations.filter(sim => sim.id !== simulationId);
    setSimulations(updatedSimulations);
    saveSimulationsToStorage(updatedSimulations);
    toast({ 
      title: "Simulação Excluída", 
      variant: "destructive" 
    });
    
    if (currentSimulation && currentSimulation.id === simulationId) {
      resetForm();
    }
  };

  const handleSendOrder = (simulationId = null) => {
    let simulationToSend;
    
    if (simulationId) {
      simulationToSend = simulations.find(sim => sim.id === simulationId);
    } else if (summary) {
      simulationToSend = { ...formData, summary };
    } else {
      toast({ 
        variant: "destructive", 
        title: "Erro", 
        description: "Calcule uma simulação antes de enviar." 
      });
      return;
    }
    
    // Em um cenário real, enviaria para API
    toast({ 
      title: "Pedido Enviado!", 
      description: `A simulação para ${empresaAtual?.nome || 'sua empresa'} foi encaminhada ao escritório de contabilidade.`, 
      className: "bg-primary text-primary-foreground" 
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
            <CalculatorIcon className="mr-2 h-6 w-6 text-primary" />
            Calculadora de Impostos
          </h1>
          <p className="text-muted-foreground mt-1">
            Simule os impostos e o lucro sobre suas vendas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm bg-primary/5 border-primary/20">
            Empresa: {empresaAtual?.nome || 'Não selecionada'}
          </Badge>
          
          <Badge variant="outline" className="text-sm bg-primary/5 border-primary/20">
            Regime: {empresaAtual?.regime_tributario || 'N/D'}
          </Badge>
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Nova Simulação
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Simulações Salvas {simulations.length > 0 && `(${simulations.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <div className="space-y-6">
              <SimulationForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleProductInputChange={handleProductInputChange}
                addProductToSimulation={addProductToSimulation}
                removeProductFromSimulation={removeProductFromSimulation}
                calculateSummary={realizarCalculo}
                universalProducts={universalProducts}
                isEditing={isEditing}
              />
              
              {summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaxSummaryDisplay summary={summary} />
                  
                  <Card>
                    <CardContent className="pt-6 flex flex-col sm:flex-row gap-3 justify-end">
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto"
                        onClick={resetForm}
                      >
                        Limpar
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto text-primary hover:text-primary-foreground hover:bg-primary"
                        onClick={handleSaveSimulation}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? 'Atualizar Simulação' : 'Salvar Simulação'}
                      </Button>
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() => handleSendOrder()}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Enviar ao Escritório
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {!summary && formData.produtos.length > 0 && (
                <div className="flex justify-center my-8">
                  <Card className="max-w-md w-full bg-accent/50 border-accent">
                    <CardContent className="pt-6 pb-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Simule os impostos e lucro da venda preenchendo os valores e clicando em "Calcular Impostos".
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedSimulationsList
              simulations={simulations}
              handleEditSimulation={handleEditSimulation}
              handleDeleteSimulation={handleDeleteSimulation}
              handleSendOrder={handleSendOrder}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxCalculatorPage;