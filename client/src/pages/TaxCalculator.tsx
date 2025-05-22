import React, { useState } from 'react';
import { Calculator, RefreshCcw } from 'lucide-react';

interface TaxInfo {
  icms: number;
  pis: number;
  cofins: number;
  ipi: number;
  total: number;
}

const TaxCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    valorProduto: '',
    estado: 'SP',
    regimeTributario: 'simples',
    tipoProduto: 'mercadoria'
  });

  const [calculatedTaxes, setCalculatedTaxes] = useState<TaxInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsCalculating(true);
    
    // Simular cálculo de impostos (em um cenário real, isso viria da API)
    setTimeout(() => {
      const valorProduto = parseFloat(formData.valorProduto) || 0;
      
      // Valores simplificados para demonstração
      let icmsRate = 0.18; // 18% ICMS para SP
      let pisRate = 0.0165; // 1.65% PIS
      let cofinsRate = 0.076; // 7.6% COFINS
      let ipiRate = 0.05; // 5% IPI
      
      // Ajustar taxas com base no estado
      switch (formData.estado) {
        case 'RJ':
          icmsRate = 0.20; // 20%
          break;
        case 'MG':
          icmsRate = 0.18; // 18%
          break;
        case 'RS':
          icmsRate = 0.17; // 17%
          break;
        default:
          icmsRate = 0.18; // 18%
      }
      
      // Ajustar taxas com base no regime tributário
      if (formData.regimeTributario === 'simples') {
        // Simplificado para empresas do Simples Nacional
        pisRate = 0;
        cofinsRate = 0;
      }
      
      // Ajustar IPI com base no tipo de produto
      if (formData.tipoProduto === 'servico') {
        ipiRate = 0; // Não há IPI para serviços
      }
      
      const icms = valorProduto * icmsRate;
      const pis = valorProduto * pisRate;
      const cofins = valorProduto * cofinsRate;
      const ipi = valorProduto * ipiRate;
      const total = icms + pis + cofins + ipi;
      
      setCalculatedTaxes({
        icms,
        pis,
        cofins,
        ipi,
        total
      });
      
      setIsCalculating(false);
    }, 800); // Simulação de delay de API
  };

  const handleReset = () => {
    setFormData({
      valorProduto: '',
      estado: 'SP',
      regimeTributario: 'simples',
      tipoProduto: 'mercadoria'
    });
    setCalculatedTaxes(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Calculator className="mr-2 text-brand-gold" />
          Calculadora de Impostos
        </h1>
        <p className="text-gray-600">
          Calcule os impostos aplicáveis a produtos e serviços conforme seu regime tributário.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="valorProduto" className="block text-sm font-medium text-gray-700 mb-1">
                Valor do Produto/Serviço
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">R$</span>
                </div>
                <input
                  type="text"
                  id="valorProduto"
                  name="valorProduto"
                  value={formData.valorProduto}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="SC">Santa Catarina</option>
              </select>
            </div>

            <div>
              <label htmlFor="regimeTributario" className="block text-sm font-medium text-gray-700 mb-1">
                Regime Tributário
              </label>
              <select
                id="regimeTributario"
                name="regimeTributario"
                value={formData.regimeTributario}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="simples">Simples Nacional</option>
                <option value="lucroPresumido">Lucro Presumido</option>
                <option value="lucroReal">Lucro Real</option>
              </select>
            </div>

            <div>
              <label htmlFor="tipoProduto" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Produto
              </label>
              <select
                id="tipoProduto"
                name="tipoProduto"
                value={formData.tipoProduto}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="mercadoria">Mercadoria</option>
                <option value="servico">Serviço</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold flex items-center"
            >
              <RefreshCcw size={16} className="mr-2" />
              Limpar
            </button>
            <button
              type="submit"
              disabled={isCalculating}
              className="px-4 py-2 bg-brand-gold border border-transparent rounded-md text-white hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold flex items-center"
            >
              <Calculator size={16} className="mr-2" />
              {isCalculating ? 'Calculando...' : 'Calcular Impostos'}
            </button>
          </div>
        </form>

        {calculatedTaxes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do Cálculo</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ICMS</p>
                  <p className="text-lg font-medium text-gray-900">{formatCurrency(calculatedTaxes.icms)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PIS</p>
                  <p className="text-lg font-medium text-gray-900">{formatCurrency(calculatedTaxes.pis)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">COFINS</p>
                  <p className="text-lg font-medium text-gray-900">{formatCurrency(calculatedTaxes.cofins)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IPI</p>
                  <p className="text-lg font-medium text-gray-900">{formatCurrency(calculatedTaxes.ipi)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-500">Total de Impostos</p>
                  <p className="text-xl font-bold text-brand-gold">{formatCurrency(calculatedTaxes.total)}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-medium text-gray-500">Valor do Produto</p>
                  <p className="text-lg font-medium text-gray-900">{formatCurrency(parseFloat(formData.valorProduto) || 0)}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-medium text-gray-500">Valor Final (com impostos)</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency((parseFloat(formData.valorProduto) || 0) + calculatedTaxes.total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;