import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// Configuração padrão dos regimes tributários
const REGIMES_TRIBUTARIOS = {
  SIMPLES_NACIONAL: {
    nome: 'Simples Nacional',
    aliquotas: {
      icms: 0,
      pis: 0,
      cofins: 0,
      ipi: 0,
      simples: 0.04, // 4% por padrão (será ajustado com base no faturamento)
    },
    faixas: [
      { limite: 180000, aliquota: 0.04 }, // Até 180.000 - 4%
      { limite: 360000, aliquota: 0.073 }, // Até 360.000 - 7,3%
      { limite: 720000, aliquota: 0.095 }, // Até 720.000 - 9,5%
      { limite: 1800000, aliquota: 0.107 }, // Até 1.800.000 - 10,7%
      { limite: 3600000, aliquota: 0.143 }, // Até 3.600.000 - 14,3%
      { limite: 4800000, aliquota: 0.19 }, // Até 4.800.000 - 19%
    ],
    calculaAliquota: (faturamentoAnual) => {
      const faixa = REGIMES_TRIBUTARIOS.SIMPLES_NACIONAL.faixas.find(
        f => faturamentoAnual <= f.limite
      ) || REGIMES_TRIBUTARIOS.SIMPLES_NACIONAL.faixas[5];
      return faixa.aliquota;
    }
  },
  LUCRO_PRESUMIDO: {
    nome: 'Lucro Presumido',
    aliquotas: {
      icms: 0.18, // 18%
      pis: 0.0065, // 0,65%
      cofins: 0.03, // 3%
      ipi: 0.05, // 5%
      irpj: 0.048, // 4,8% (base presumida 32% * 15%)
      csll: 0.0288, // 2,88% (base presumida 32% * 9%)
    }
  },
  LUCRO_REAL: {
    nome: 'Lucro Real',
    aliquotas: {
      icms: 0.18, // 18%
      pis: 0.0165, // 1,65% (não-cumulativo)
      cofins: 0.076, // 7,6% (não-cumulativo)
      ipi: 0.05, // 5%
      irpj: 0.15, // 15% (sobre o lucro)
      csll: 0.09, // 9% (sobre o lucro)
    }
  }
};

// Componente de formulário para simulação
const SimulationForm = ({ onSubmit, isLoading }) => {
  const [valorProduto, setValorProduto] = useState('');
  const [regimeTributario, setRegimeTributario] = useState('SIMPLES_NACIONAL');
  const [faturamentoAnual, setFaturamentoAnual] = useState('');
  const [margemLucro, setMargemLucro] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      valorProduto: parseFloat(valorProduto),
      regimeTributario,
      faturamentoAnual: parseFloat(faturamentoAnual),
      margemLucro: parseFloat(margemLucro),
    });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg text-gray-800">
          Simulação de Impostos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="valor-produto" className="block text-sm font-medium text-gray-700 mb-1">
                Valor do Produto (R$)
              </label>
              <input
                id="valor-produto"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={valorProduto}
                onChange={(e) => setValorProduto(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="regime" className="block text-sm font-medium text-gray-700 mb-1">
                Regime Tributário
              </label>
              <select
                id="regime"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={regimeTributario}
                onChange={(e) => setRegimeTributario(e.target.value)}
              >
                <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                <option value="LUCRO_REAL">Lucro Real</option>
              </select>
            </div>
            
            {regimeTributario === 'SIMPLES_NACIONAL' && (
              <div>
                <label htmlFor="faturamento" className="block text-sm font-medium text-gray-700 mb-1">
                  Faturamento Anual (R$)
                </label>
                <input
                  id="faturamento"
                  type="number"
                  step="1000"
                  min="0"
                  required
                  placeholder="0,00"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  value={faturamentoAnual}
                  onChange={(e) => setFaturamentoAnual(e.target.value)}
                />
              </div>
            )}
            
            {regimeTributario === 'LUCRO_REAL' && (
              <div>
                <label htmlFor="margem" className="block text-sm font-medium text-gray-700 mb-1">
                  Margem de Lucro (%)
                </label>
                <input
                  id="margem"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  required
                  placeholder="0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                  value={margemLucro}
                  onChange={(e) => setMargemLucro(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Calculando...' : 'Calcular Impostos'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Componente de exibição dos resultados
const TaxSummaryDisplay = ({ resultados }) => {
  if (!resultados) return null;

  const { regime, impostos, totais } = resultados;
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg text-gray-800">
          Resumo de Impostos - {regime}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Impostos Aplicados</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(impostos).map(([imposto, valor]) => (
                <div key={imposto} className="flex justify-between p-2 border-b">
                  <span className="text-gray-600 uppercase">{imposto}</span>
                  <span className="font-medium">{formatPercent(valor * 100)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-3 border-t">
            <h4 className="font-medium text-gray-700 mb-2">Valores Calculados</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50">
                <span className="text-gray-600">Valor do Produto</span>
                <span className="font-medium">{formatCurrency(totais.valorProduto)}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-gray-600">Total de Impostos</span>
                <span className="font-medium text-red-600">{formatCurrency(totais.totalImpostos)}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50">
                <span className="text-gray-600">Valor Final</span>
                <span className="font-medium text-green-600">{formatCurrency(totais.valorFinal)}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-gray-600">Carga Tributária</span>
                <span className="font-medium">{formatPercent(totais.cargaTributaria * 100)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal da página
const TaxCalculatorPage = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [historico, setHistorico] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Função para calcular os impostos
  const calcularImpostos = (dados) => {
    setIsCalculating(true);
    
    // Simulando um processo assíncrono (API call)
    setTimeout(() => {
      try {
        const { valorProduto, regimeTributario, faturamentoAnual, margemLucro } = dados;
        const regime = REGIMES_TRIBUTARIOS[regimeTributario];
        
        let aliquotas = { ...regime.aliquotas };
        
        // Ajustes específicos por regime
        if (regimeTributario === 'SIMPLES_NACIONAL') {
          aliquotas.simples = regime.calculaAliquota(faturamentoAnual);
        } else if (regimeTributario === 'LUCRO_REAL') {
          const lucro = valorProduto * (margemLucro / 100);
          aliquotas.irpj_valor = lucro * aliquotas.irpj;
          aliquotas.csll_valor = lucro * aliquotas.csll;
        }
        
        // Cálculo do total de impostos
        let totalImpostos = 0;
        Object.entries(aliquotas).forEach(([imposto, aliquota]) => {
          if (!imposto.includes('_valor')) {
            totalImpostos += valorProduto * aliquota;
          }
        });
        
        // Adicionar valores específicos do Lucro Real se existirem
        if (aliquotas.irpj_valor && aliquotas.csll_valor) {
          totalImpostos += aliquotas.irpj_valor + aliquotas.csll_valor;
        }
        
        const valorFinal = valorProduto + totalImpostos;
        const cargaTributaria = totalImpostos / valorProduto;
        
        // Resultados finais
        const resultado = {
          regime: regime.nome,
          impostos: aliquotas,
          totais: {
            valorProduto,
            totalImpostos,
            valorFinal,
            cargaTributaria,
            data: new Date().toISOString(),
          }
        };
        
        setResultados(resultado);
        
        // Adicionar ao histórico
        setHistorico(prev => [resultado, ...prev.slice(0, 4)]); // Mantém os últimos 5 cálculos
        
        // Mostrar notificação de sucesso
        toast({
          title: "Cálculo realizado com sucesso!",
          variant: "success",
        });
      } catch (error) {
        console.error("Erro ao calcular impostos:", error);
        toast({
          title: "Erro ao calcular impostos",
          description: "Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsCalculating(false);
      }
    }, 800); // simula um pouco de tempo para o cálculo (remove em produção)
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Calculadora de Impostos
        </h1>
        <p className="text-gray-600">
          Simule os impostos para diferentes regimes tributários e compare os resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SimulationForm onSubmit={calcularImpostos} isLoading={isCalculating} />
          
          {/* Histórico somente para usuários logados */}
          {user && historico.length > 0 && (
            <Card className="mt-6 shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg text-gray-800">
                  Simulações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {historico.map((item, index) => (
                  <div key={index} className="py-3 px-1 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.regime}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.totais.data).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.totais.valorFinal)}</p>
                      <p className="text-sm text-red-600">
                        Impostos: {formatCurrency(item.totais.totalImpostos)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          {resultados ? (
            <TaxSummaryDisplay resultados={resultados} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-gray-500">
                <p>Preencha o formulário e clique em "Calcular Impostos"</p>
                <p className="text-sm mt-1">Os resultados aparecerão aqui</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorPage;