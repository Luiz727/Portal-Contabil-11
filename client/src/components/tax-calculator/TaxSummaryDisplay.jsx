import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp, CircleDollarSign, Receipt } from 'lucide-react';

/**
 * Componente para exibir o resumo dos cálculos de impostos
 * Destaca valores de impostos para usuários empresariais
 */
const TaxSummaryDisplay = ({ summary, isVisible }) => {
  const { user } = useAuth();
  const isEmpresaUser = user?.role === 'empresa' || user?.role === 'escritorio';

  if (!summary || !isVisible) return null;

  // Cálculo de margens e percentuais
  const margemBruta = summary.faturamentoTotal > 0 
    ? ((summary.lucroBruto / summary.faturamentoTotal) * 100).toFixed(2)
    : 0;
    
  const percentualImpostos = summary.faturamentoTotal > 0
    ? (((summary.impostosVendas + summary.impostosCompras + summary.difal) / summary.faturamentoTotal) * 100).toFixed(2)
    : 0;

  return (
    <Card className={`w-full mt-8 ${isEmpresaUser ? 'border-amber-500 shadow-lg' : ''}`}>
      <CardHeader className={`${isEmpresaUser ? 'bg-amber-50' : ''}`}>
        <CardTitle className="text-xl flex items-center">
          <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
          Resultado da Simulação
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Faturamento */}
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-blue-700">Faturamento</h3>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(summary.faturamentoTotal)}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Valor total de vendas
            </p>
          </div>

          {/* Impostos - Destacado para usuários de empresa */}
          <div className={`rounded-lg p-4 border ${
            isEmpresaUser 
              ? 'bg-amber-50 border-amber-300 shadow-md' 
              : 'bg-red-50 border-red-100'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-medium ${isEmpresaUser ? 'text-amber-700' : 'text-red-700'}`}>
                Impostos Totais
              </h3>
              <Receipt className={`h-5 w-5 ${isEmpresaUser ? 'text-amber-500' : 'text-red-500'}`} />
            </div>
            <p className={`text-2xl font-bold ${isEmpresaUser ? 'text-amber-800' : 'text-red-800'}`}>
              {formatCurrency(summary.impostosVendas + summary.impostosCompras + summary.difal)}
            </p>
            <p className={`text-sm ${isEmpresaUser ? 'text-amber-600' : 'text-red-600'} mt-1`}>
              {percentualImpostos}% do faturamento
            </p>
          </div>

          {/* Lucro Bruto */}
          <div className="rounded-lg bg-green-50 p-4 border border-green-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-green-700">Lucro Bruto</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-800">
              {formatCurrency(summary.lucroBruto)}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Margem: {margemBruta}%
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Custo dos Produtos */}
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Custo dos Produtos</span>
              <ArrowDownRight className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-lg font-semibold mt-1">
              {formatCurrency(summary.custoTotalProdutos)}
            </p>
          </div>

          {/* Impostos sobre Vendas */}
          <div className={`p-3 rounded border ${isEmpresaUser ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between">
              <span className={isEmpresaUser ? 'text-amber-700 text-sm font-medium' : 'text-gray-600 text-sm'}>
                Impostos sobre Vendas
              </span>
              <ArrowUpRight className={`h-4 w-4 ${isEmpresaUser ? 'text-amber-500' : 'text-gray-500'}`} />
            </div>
            <p className={`text-lg font-semibold mt-1 ${isEmpresaUser ? 'text-amber-800' : ''}`}>
              {formatCurrency(summary.impostosVendas)}
            </p>
          </div>

          {/* Impostos sobre Compras */}
          <div className={`p-3 rounded border ${isEmpresaUser ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between">
              <span className={isEmpresaUser ? 'text-amber-700 text-sm font-medium' : 'text-gray-600 text-sm'}>
                Impostos sobre Compras
              </span>
              <ArrowUpRight className={`h-4 w-4 ${isEmpresaUser ? 'text-amber-500' : 'text-gray-500'}`} />
            </div>
            <p className={`text-lg font-semibold mt-1 ${isEmpresaUser ? 'text-amber-800' : ''}`}>
              {formatCurrency(summary.impostosCompras)}
            </p>
          </div>

          {/* DIFAL */}
          <div className={`p-3 rounded border ${isEmpresaUser ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between">
              <span className={isEmpresaUser ? 'text-amber-700 text-sm font-medium' : 'text-gray-600 text-sm'}>
                DIFAL
              </span>
              <ArrowUpRight className={`h-4 w-4 ${isEmpresaUser ? 'text-amber-500' : 'text-gray-500'}`} />
            </div>
            <p className={`text-lg font-semibold mt-1 ${isEmpresaUser ? 'text-amber-800' : ''}`}>
              {formatCurrency(summary.difal)}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-2">Observações Fiscais</h3>
          <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
            <li>Os valores de ICMS, PIS e COFINS são calculados sobre o valor de venda.</li>
            <li>O valor de IPI é calculado sobre o valor de custo.</li>
            <li>Os impostos de compras são estimados em 5% do custo dos produtos.</li>
            <li>O DIFAL é estimado em 2% do faturamento para operações interestaduais.</li>
            <li>Para empresas do Simples Nacional, é aplicada a alíquota correspondente à faixa de faturamento.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSummaryDisplay;