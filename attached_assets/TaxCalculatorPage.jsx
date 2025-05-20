import React, { useState, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { CardFooter } from '@/components/ui/card';
    import { Calculator, Save, Send, AlertTriangle, Settings, Eye } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import { useAuth } from '@/contexts/AuthContext';
    import { useEmpresas } from '@/contexts/EmpresasContext';
    import ProductService from '@/services/ProductService';
    import SimulationForm from '@/components/tax-calculator/SimulationForm';
    import TaxSummaryDisplay from '@/components/tax-calculator/TaxSummaryDisplay';
    import SavedSimulationsList from '@/components/tax-calculator/SavedSimulationsList';
    import { Link } from 'react-router-dom';

    const TaxCalculatorPage = () => {
      const { toast } = useToast();
      const { user, userType } = useAuth();
      const { selectedEmpresa, actingAsEmpresa } = useEmpresas(); 
      const empresaAtual = actingAsEmpresa || selectedEmpresa;

      const [simulations, setSimulations] = useState([]);
      const [currentSimulation, setCurrentSimulation] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      
      const initialFormData = {
        id: null,
        data: new Date().toISOString().split('T')[0],
        clienteNome: '',
        produtos: [], 
        valorVendaTotalGlobal: '', 
        empresaIdContexto: null,
      };

      const [formData, setFormData] = useState(initialFormData);
      const [summary, setSummary] = useState(null);
      const [universalProducts, setUniversalProducts] = useState([]);
      const [userTaxConfig, setUserTaxConfig] = useState(null);

      useEffect(() => {
        const fetchProducts = async () => {
          const products = await ProductService.getUniversalProducts();
          setUniversalProducts(products);
        }
        fetchProducts();
        
        const storedSimulations = localStorage.getItem('nixconTaxSimulations');
        if (storedSimulations) {
          setSimulations(JSON.parse(storedSimulations));
        }

        if (userType === 'UsuarioCalculadora' && user) {
          const storedConfig = localStorage.getItem(`nixconTaxConfig_${user.id}`);
          if (storedConfig) {
            setUserTaxConfig(JSON.parse(storedConfig));
          } else {
            setUserTaxConfig({ icms: '18', ipi: '5', pis: '1.65', cofins: '7.60', iss: '5', simplesNacionalAliquota: '6' }); 
          }
        } else {
          setUserTaxConfig(null); 
        }
      }, [user, userType]);

      useEffect(() => {
        setFormData(prev => ({ ...prev, empresaIdContexto: empresaAtual ? empresaAtual.id : null }));
      }, [empresaAtual]);

      const saveSimulationsToStorage = (updatedSimulations) => {
        localStorage.setItem('nixconTaxSimulations', JSON.stringify(updatedSimulations));
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
        const newProductEntry = {
          ...product, 
          produtoId: product.id, 
          quantidade: 1,
          valorVendaUnitario: precoCustoDoProduto * 1.3, 
          valorVendaTotal: precoCustoDoProduto * 1.3,
          precoCusto: precoCustoDoProduto,
        };
        setFormData(prev => ({ ...prev, produtos: [...prev.produtos, newProductEntry] }));
      };

      const removeProductFromSimulation = (index) => {
        setFormData(prev => ({ ...prev, produtos: prev.produtos.filter((_, i) => i !== index) }));
      };

      const getTaxRateForCalc = (product, taxName) => {
        if (userType === 'UsuarioCalculadora' && userTaxConfig && userTaxConfig[taxName]) {
          return parseFloat(userTaxConfig[taxName]) / 100 || 0;
        }
        
        if (product && product.config_fiscal) { // Changed from product.configFiscal
          const configFiscal = product.config_fiscal;
          if (taxName === 'icms' && configFiscal.icms !== undefined) return parseFloat(configFiscal.icms);
          if (taxName === 'pis' && configFiscal.pis !== undefined) return parseFloat(configFiscal.pis);
          if (taxName === 'cofins' && configFiscal.cofins !== undefined) return parseFloat(configFiscal.cofins);
          if (taxName === 'ipi' && configFiscal.ipi !== undefined) return parseFloat(configFiscal.ipi); 
          if (taxName === 'iss' && configFiscal.iss !== undefined) return parseFloat(configFiscal.iss);
          if (taxName === 'simplesNacionalAliquota' && configFiscal.simplesNacionalAliquota !== undefined) return parseFloat(configFiscal.simplesNacionalAliquota);
        }

        if (empresaAtual && empresaAtual.config_fiscal_padrao && empresaAtual.config_fiscal_padrao[taxName]) { // Changed from configFiscalPadrao
            return parseFloat(empresaAtual.config_fiscal_padrao[taxName]) / 100;
        }
        return 0; 
      };

      const calculateSummary = useCallback((currentProdutos, currentValorVendaTotalGlobal) => {
        if (!currentProdutos || currentProdutos.length === 0) {
          setSummary(null);
          return currentProdutos; 
        }
      
        let faturamentoTotalItens = 0;
        currentProdutos.forEach(p => {
          const qtd = parseFloat(p.quantidade) || 0;
          const vVendaUnitario = parseFloat(p.valorVendaUnitario) || 0;
          faturamentoTotalItens += qtd * vVendaUnitario;
        });
      
        let produtosProcessados = currentProdutos;
        let faturamentoFinalCalculo = faturamentoTotalItens;
      
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
          const pCusto = parseFloat(p.precoCusto || p.preco_custo) || 0; // Added p.preco_custo as fallback
          const itemFaturamento = parseFloat(p.valorVendaTotal) || 0; 
          
          custoTotalProdutos += qtd * pCusto;
      
          let itemImpostosVendas = 0;
          const icmsRate = getTaxRateForCalc(p, 'icms');
          const pisRate = getTaxRateForCalc(p, 'pis');
          const cofinsRate = getTaxRateForCalc(p, 'cofins');
          const ipiRate = getTaxRateForCalc(p, 'ipi'); 
          const issRate = getTaxRateForCalc(p, 'iss');
          const simplesRate = getTaxRateForCalc(p, 'simplesNacionalAliquota');
      
          if ((userType === 'EmpresaUsuaria' || actingAsEmpresa) && empresaAtual && empresaAtual.regime_tributario === 'Simples Nacional' && simplesRate > 0) {
            itemImpostosVendas = itemFaturamento * simplesRate;
          } else {
            itemImpostosVendas = itemFaturamento * (icmsRate + pisRate + cofinsRate + issRate) + ( (qtd * pCusto) * ipiRate );
          }
          totalImpostosVendas += itemImpostosVendas;
        });
      
        const impostosCompras = custoTotalProdutos * 0.05; 
        const difal = faturamentoFinalCalculo * 0.02; 
        const lucroBruto = faturamentoFinalCalculo - custoTotalProdutos - totalImpostosVendas - impostosCompras - difal;
      
        setSummary({
          faturamentoTotal: faturamentoFinalCalculo,
          custoTotalProdutos,
          impostosVendas: totalImpostosVendas,
          impostosCompras,
          difal,
          lucroBruto,
        });
        return produtosProcessados; 
      }, [userType, empresaAtual, userTaxConfig, actingAsEmpresa]);
      

      useEffect(() => {
        const produtosAtualizados = calculateSummary(formData.produtos, formData.valorVendaTotalGlobal);
        if (JSON.stringify(produtosAtualizados) !== JSON.stringify(formData.produtos)) {
             setFormData(prev => ({ ...prev, produtos: produtosAtualizados }));
        }
      }, [formData.produtos, formData.valorVendaTotalGlobal, calculateSummary]);
      

      const handleSaveSimulation = () => {
        if (formData.produtos.length === 0) {
          toast({ variant: "destructive", title: "Erro", description: "Adicione produtos à simulação." });
          return;
        }
        let updatedSimulations;
        const simulationDataToSave = { ...formData, summary, empresaIdContexto: empresaAtual ? empresaAtual.id : null };

        if (isEditing && formData.id) {
          updatedSimulations = simulations.map(sim => sim.id === formData.id ? simulationDataToSave : sim);
          toast({ title: "Simulação Atualizada!", description: "As alterações foram salvas.", className: "bg-blue-500 text-white" });
        } else {
          const newSimulation = { ...simulationDataToSave, id: `sim-${Date.now()}` };
          updatedSimulations = [newSimulation, ...simulations];
          toast({ title: "Simulação Salva!", description: "Sua simulação foi salva com sucesso.", className: "bg-green-500 text-white" });
        }
        setSimulations(updatedSimulations);
        saveSimulationsToStorage(updatedSimulations);
        resetForm();
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      const handleDeleteSimulation = (simulationId) => {
        const updatedSimulations = simulations.filter(sim => sim.id !== simulationId);
        setSimulations(updatedSimulations);
        saveSimulationsToStorage(updatedSimulations);
        toast({ title: "Simulação Excluída", variant: "destructive" });
        if (currentSimulation && currentSimulation.id === simulationId) {
          resetForm();
        }
      };

      const handleSendOrder = () => {
        if (!summary) {
           toast({ variant: "destructive", title: "Erro", description: "Calcule uma simulação antes de enviar." });
           return;
        }
        toast({ title: "Pedido Enviado!", description: `A simulação para ${empresaAtual ? empresaAtual.nome : 'empresa não definida'} foi encaminhada.`, className: "bg-primary text-primary-foreground" });
      };

      const displayedSimulations = simulations.filter(sim => {
        if (userType === 'UsuarioCalculadora') return true; 
        if (actingAsEmpresa) return sim.empresaIdContexto === actingAsEmpresa.id;
        if (userType === 'EmpresaUsuaria' && selectedEmpresa) return sim.empresaIdContexto === selectedEmpresa.id;
        return false; 
      });

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
                {actingAsEmpresa && userType === 'Escritorio' && (
                  <p className="text-sm text-yellow-600 bg-yellow-500/10 p-2 rounded-md mt-2 flex items-center">
                    <Eye className="mr-2 h-4 w-4" /> Você está calculando como: <span className="font-semibold ml-1">{actingAsEmpresa.nome}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <Button onClick={resetForm} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                    Cancelar Edição
                  </Button>
                )}
                {userType === 'UsuarioCalculadora' && (
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Link to="/settings/tax-calculator-config">
                      <Settings className="mr-2 h-4 w-4" /> Configurar Alíquotas
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {(userType === 'EmpresaUsuaria' || actingAsEmpresa) && empresaAtual && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                As alíquotas de impostos para {empresaAtual.nome} são gerenciadas pelo escritório ou configuradas e aplicadas automaticamente.
              </div>
            )}
          </motion.div>

          <SimulationForm 
            formData={formData}
            onInputChange={handleInputChange}
            onProductInputChange={handleProductInputChange}
            onAddProduct={addProductToSimulation}
            onRemoveProduct={removeProductFromSimulation}
            universalProducts={universalProducts}
            isEditing={isEditing}
          />
          
          <CardFooter className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-border mt-6">
            <Button onClick={handleSaveSimulation} className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Atualizar Simulação' : 'Salvar Simulação'}
            </Button>
            <Button onClick={handleSendOrder} variant="outline" className="w-full md:w-auto border-green-500 text-green-500 hover:bg-green-500/10">
              <Send className="mr-2 h-4 w-4" /> Enviar Pedido ao Escritório
            </Button>
          </CardFooter>

          <TaxSummaryDisplay summary={summary} products={formData.produtos} taxConfig={userTaxConfig} selectedEmpresa={empresaAtual} />
          
          <SavedSimulationsList simulations={displayedSimulations} onEdit={handleEditSimulation} onDelete={handleDeleteSimulation} />
        </div>
      );
    };

    export default TaxCalculatorPage;