import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Calculator, Save, Send, AlertTriangle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import SimulationForm from '@/components/tax-calculator/SimulationForm';
import TaxSummaryDisplay from '@/components/tax-calculator/TaxSummaryDisplay';
import SavedSimulationsList from '@/components/tax-calculator/SavedSimulationsList';

/**
 * Página da calculadora de impostos do sistema NIXCON
 * Permite simular cálculos de impostos e lucro para vendas
 * Destaca valores de impostos para usuários empresariais
 */
const TaxCalculatorPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'cliente';

  // Estado para as simulações salvas
  const [simulations, setSimulations] = useState([]);
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Configuração inicial do formulário
  const initialFormData = {
    id: null,
    data: new Date().toISOString().split('T')[0],
    clienteNome: '',
    produtos: [], 
    valorVendaTotalGlobal: '', 
    empresaIdContexto: null,
  };

  // Estados para controle do formulário e resultados
  const [formData, setFormData] = useState(initialFormData);
  const [summary, setSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  
  // Produtos iniciais para teste
  const [universalProducts, setUniversalProducts] = useState([
    { 
      id: 1, 
      nome: 'Notebook Dell XPS', 
      preco_custo: 4500, 
      config_fiscal: { icms: 0.18, pis: 0.0165, cofins: 0.076, ipi: 0.15 } 
    },
    { 
      id: 2, 
      nome: 'Monitor LG 27"', 
      preco_custo: 1200, 
      config_fiscal: { icms: 0.18, pis: 0.0165, cofins: 0.076, ipi: 0.10 } 
    },
    { 
      id: 3, 
      nome: 'Mouse Logitech MX', 
      preco_custo: 250, 
      config_fiscal: { icms: 0.18, pis: 0.0165, cofins: 0.076, ipi: 0.05 } 
    },
    { 
      id: 4, 
      nome: 'Teclado Mecânico Keychron', 
      preco_custo: 450, 
      config_fiscal: { icms: 0.18, pis: 0.0165, cofins: 0.076, ipi: 0.05 } 
    },
    { 
      id: 5, 
      nome: 'Smartphone Samsung S22', 
      preco_custo: 3800, 
      config_fiscal: { icms: 0.18, pis: 0.0165, cofins: 0.076, ipi: 0.15 } 
    },
  ]);

  // Carrega simulações salvas do localStorage quando a página é carregada
  useEffect(() => {
    const storedSimulations = localStorage.getItem('nixcon_tax_simulations');
    if (storedSimulations) {
      setSimulations(JSON.parse(storedSimulations));
    }
  }, []);

  // Salva simulações no localStorage quando mudam
  const saveSimulationsToStorage = (updatedSimulations) => {
    localStorage.setItem('nixcon_tax_simulations', JSON.stringify(updatedSimulations));
  };

  // Função para limpar o formulário
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentSimulation(null);
    setIsEditing(false);
    setSummary(null);
    setShowSummary(false);
  };

  // Manipuladores de mudança nos campos do formulário
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductInputChange = (index, field, value) => {
    const newProdutos = [...formData.produtos];
    newProdutos[index][field] = value;
    
    // Atualiza o valor total automaticamente quando quantidade ou valor unitário mudam
    if (field === 'quantidade' || field === 'valorVendaUnitario') {
      const qtd = parseFloat(newProdutos[index].quantidade) || 0;
      const vVenda = parseFloat(newProdutos[index].valorVendaUnitario) || 0;
      newProdutos[index].valorVendaTotal = qtd * vVenda;
    }
    
    setFormData(prev => ({ ...prev, produtos: newProdutos }));
  };

  // Adiciona um produto à simulação
  const addProductToSimulation = (product) => {
    const precoCustoDoProduto = product.preco_custo || 0;
    const newProductEntry = {
      ...product, 
      produtoId: product.id, 
      quantidade: 1,
      valorVendaUnitario: precoCustoDoProduto * 1.3, // Markup padrão de 30%
      valorVendaTotal: precoCustoDoProduto * 1.3,
      precoCusto: precoCustoDoProduto,
    };
    setFormData(prev => ({ ...prev, produtos: [...prev.produtos, newProductEntry] }));
  };

  // Remove um produto da simulação
  const removeProductFromSimulation = (index) => {
    setFormData(prev => ({ ...prev, produtos: prev.produtos.filter((_, i) => i !== index) }));
  };

  // Obtém a alíquota do imposto para um produto
  const getTaxRateForCalc = (product, taxName) => {
    if (product && product.config_fiscal) {
      const configFiscal = product.config_fiscal;
      switch(taxName) {
        case 'icms': return configFiscal.icms || 0.18;
        case 'pis': return configFiscal.pis || 0.0165;
        case 'cofins': return configFiscal.cofins || 0.076;
        case 'ipi': return configFiscal.ipi || 0.05;
        case 'iss': return configFiscal.iss || 0.05;
        case 'simplesNacionalAliquota': return configFiscal.simplesNacionalAliquota || 0.06;
        default: return 0;
      }
    }
    
    // Valores padrão se não houver configuração
    switch(taxName) {
      case 'icms': return 0.18;
      case 'pis': return 0.0165;
      case 'cofins': return 0.076;
      case 'ipi': return 0.05;
      case 'iss': return 0.05;
      case 'simplesNacionalAliquota': return 0.06;
      default: return 0;
    }
  };

  // Função de cálculo dos impostos e lucro
  const calculateTaxes = useCallback(() => {
    if (!formData.produtos || formData.produtos.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro no cálculo",
        description: "Adicione pelo menos um produto à simulação.",
      });
      return;
    }

    const currentProdutos = [...formData.produtos];
    const currentValorVendaTotalGlobal = formData.valorVendaTotalGlobal;
    
    let faturamentoTotalItens = 0;
    currentProdutos.forEach(p => {
      const qtd = parseFloat(p.quantidade) || 0;
      const vVendaUnitario = parseFloat(p.valorVendaUnitario) || 0;
      faturamentoTotalItens += qtd * vVendaUnitario;
    });
  
    let produtosProcessados = currentProdutos;
    let faturamentoFinalCalculo = faturamentoTotalItens;
  
    // Se o usuário informou um valor total específico, rateamos proporcionalmente
    if (currentValorVendaTotalGlobal && parseFloat(currentValorVendaTotalGlobal) > 0 && faturamentoTotalItens > 0) {
      const valorGlobalNumerico = parseFloat(currentValorVendaTotalGlobal);
      const fatorDistribuicao = valorGlobalNumerico / faturamentoTotalItens;
      faturamentoFinalCalculo = valorGlobalNumerico;
  
      produtosProcessados = currentProdutos.map(p => {
        const itemFaturamentoOriginal = (parseFloat(p.quantidade) || 0) * (parseFloat(p.valorVendaUnitario) || 0);
        const itemFaturamentoRateado = itemFaturamentoOriginal * fatorDistribuicao;
        const quantidadeValida = parseFloat(p.quantidade) || 1; 
        return {
          ...p,
          valorVendaUnitario: itemFaturamentoRateado / quantidadeValida,
          valorVendaTotal: itemFaturamentoRateado
        };
      });
    } else {
      produtosProcessados = currentProdutos.map(p => {
        const qtd = parseFloat(p.quantidade) || 0;
        const vVendaUnitario = parseFloat(p.valorVendaUnitario) || 0;
        return {...p, valorVendaTotal: qtd * vVendaUnitario };
      });
    }
  
    let custoTotalProdutos = 0;
    let totalImpostosVendas = 0;
  
    produtosProcessados.forEach(p => {
      const qtd = parseFloat(p.quantidade) || 0;
      const pCusto = parseFloat(p.precoCusto || p.preco_custo) || 0;
      const itemFaturamento = parseFloat(p.valorVendaTotal) || 0; 
      
      custoTotalProdutos += qtd * pCusto;
  
      // Cálculo dos impostos baseado no regime (simplificado para exemplo)
      let itemImpostosVendas = 0;
      const icmsRate = getTaxRateForCalc(p, 'icms');
      const pisRate = getTaxRateForCalc(p, 'pis');
      const cofinsRate = getTaxRateForCalc(p, 'cofins');
      const ipiRate = getTaxRateForCalc(p, 'ipi'); 
      const issRate = getTaxRateForCalc(p, 'iss');
      const simplesRate = getTaxRateForCalc(p, 'simplesNacionalAliquota');
  
      // Para este exemplo, usamos impostos de regime normal (não-Simples)
      itemImpostosVendas = itemFaturamento * (icmsRate + pisRate + cofinsRate + issRate) + ((qtd * pCusto) * ipiRate);
      
      totalImpostosVendas += itemImpostosVendas;
    });
  
    // Impostos sobre compras (estimativa simples de 5% sobre o custo total)
    const impostosCompras = custoTotalProdutos * 0.05; 
    
    // DIFAL - Diferencial de alíquotas (estimativa de 2% do faturamento)
    const difal = faturamentoFinalCalculo * 0.02; 
    
    // Lucro bruto = faturamento - custos - impostos
    const lucroBruto = faturamentoFinalCalculo - custoTotalProdutos - totalImpostosVendas - impostosCompras - difal;
  
    // Atualiza o estado com o cálculo
    setSummary({
      faturamentoTotal: faturamentoFinalCalculo,
      custoTotalProdutos,
      impostosVendas: totalImpostosVendas,
      impostosCompras,
      difal,
      lucroBruto,
    });
    
    // Mostra o resumo (atendendo à especificação de não mostrar cálculos automaticamente)
    setShowSummary(true);
    
    // Notificação de cálculo concluído
    toast({
      title: "Cálculo realizado!",
      description: "Os valores foram calculados com sucesso.",
      className: "bg-green-600 text-white",
      // A notificação desaparece automaticamente após 3 segundos
      duration: 3000,
    });
    
    return produtosProcessados;
  }, [formData.produtos, formData.valorVendaTotalGlobal, toast]);

  // Função para salvar uma simulação
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
    const simulationDataToSave = { 
      ...formData, 
      summary, 
      id: isEditing ? formData.id : `sim-${Date.now()}`
    };

    if (isEditing && formData.id) {
      updatedSimulations = simulations.map(sim => 
        sim.id === formData.id ? simulationDataToSave : sim
      );
      toast({ 
        title: "Simulação Atualizada!", 
        description: "As alterações foram salvas com sucesso.",
        className: "bg-blue-500 text-white",
        duration: 3000
      });
    } else {
      updatedSimulations = [simulationDataToSave, ...simulations];
      toast({ 
        title: "Simulação Salva!", 
        description: "Sua nova simulação foi salva com sucesso.",
        className: "bg-green-500 text-white",
        duration: 3000
      });
    }
    
    setSimulations(updatedSimulations);
    saveSimulationsToStorage(updatedSimulations);
    resetForm();
  };

  // Função para editar uma simulação existente
  const handleEditSimulation = (simulation) => {
    setCurrentSimulation(simulation);
    setFormData({
      id: simulation.id,
      data: simulation.data,
      clienteNome: simulation.clienteNome,
      produtos: simulation.produtos.map(p => ({...p})), 
      valorVendaTotalGlobal: simulation.valorVendaTotalGlobal || '',
      empresaIdContexto: simulation.empresaIdContexto || null,
    });
    setSummary(simulation.summary);
    setShowSummary(true);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para excluir uma simulação
  const handleDeleteSimulation = (simulationId) => {
    const updatedSimulations = simulations.filter(sim => sim.id !== simulationId);
    setSimulations(updatedSimulations);
    saveSimulationsToStorage(updatedSimulations);
    toast({ 
      title: "Simulação Excluída", 
      description: "A simulação foi removida com sucesso.",
      variant: "destructive",
      duration: 3000
    });
    
    if (currentSimulation && currentSimulation.id === simulationId) {
      resetForm();
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Calculator className="mr-3 h-8 w-8 text-primary" /> Calculadora de Impostos e Custos
            </h1>
            <p className="text-muted-foreground mt-1">Simule o impacto fiscal e o lucro de suas vendas.</p>
          </div>
          
          <div className="flex gap-2">
            {isEditing && (
              <Button 
                onClick={resetForm} 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                Cancelar Edição
              </Button>
            )}
          </div>
        </div>
        
        {userRole === 'empresa' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
            As alíquotas de impostos para esta empresa são configuradas pelo escritório contábil.
          </div>
        )}
      </motion.div>

      {/* Formulário de Simulação */}
      <SimulationForm 
        formData={formData}
        onInputChange={handleInputChange}
        onProductInputChange={handleProductInputChange}
        onAddProduct={addProductToSimulation}
        onRemoveProduct={removeProductFromSimulation}
        universalProducts={universalProducts}
        isEditing={isEditing}
        calculateTaxes={calculateTaxes}
      />
      
      {/* Exibição do Resumo dos Cálculos */}
      <TaxSummaryDisplay 
        summary={summary} 
        isVisible={showSummary} 
      />
      
      {/* Ações do Formulário */}
      {summary && showSummary && (
        <CardFooter className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-border mt-6">
          <Button 
            onClick={handleSaveSimulation} 
            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Atualizar Simulação' : 'Salvar Simulação'}
          </Button>
          
          {userRole === 'escritorio' && (
            <Button 
              className="w-full md:w-auto"
              variant="outline"
            >
              <Send className="mr-2 h-4 w-4" /> Enviar para Cliente
            </Button>
          )}
        </CardFooter>
      )}
      
      {/* Lista de Simulações Salvas */}
      <SavedSimulationsList 
        simulations={simulations}
        onEditSimulation={handleEditSimulation}
        onDeleteSimulation={handleDeleteSimulation}
      />
    </div>
  );
};

export default TaxCalculatorPage;