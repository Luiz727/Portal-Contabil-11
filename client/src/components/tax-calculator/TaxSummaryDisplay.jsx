import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, DollarSign, Percent, TrendingDown, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, color, subtitle, delay, highlight = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={`h-full nixcon-card ${highlight ? 'border-2 border-primary shadow-lg' : ''}`}>
        <CardHeader className={`pb-2 ${highlight ? 'bg-primary/10 rounded-t-xl' : ''}`}>
          <div className="flex justify-between items-start">
            <CardTitle className={`text-sm font-semibold ${highlight ? 'nixcon-gold' : 'nixcon-gray'}`}>
              {title}
            </CardTitle>
            <Icon className={`h-5 w-5 ${highlight ? 'nixcon-gold' : color}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${highlight ? 'nixcon-gold' : ''}`}>
            {typeof value === 'number' ? 
              new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(value) : 
              value}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TaxSummaryDisplay = ({ summary }) => {
  if (!summary) return null;

  const {
    faturamentoTotal,
    custoTotalProdutos,
    impostosVendas,
    impostosCompras,
    difal,
    lucroBruto
  } = summary;

  const margemLucro = (lucroBruto / faturamentoTotal) * 100;
  const totalImpostos = impostosVendas + impostosCompras + difal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      <Card className="nixcon-card border-0 shadow-md bg-gradient-to-r from-white to-primary/5 rounded-xl overflow-hidden">
        <CardHeader className="pb-0 border-b border-gray-100">
          <CardTitle className="text-xl flex items-center nixcon-gray">
            <Calculator className="mr-2 h-5 w-5 nixcon-gold" />
            Resumo da Simulação de Impostos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            <SummaryCard
              title="Faturamento"
              value={faturamentoTotal}
              icon={ShoppingCart}
              color="text-blue-500"
              subtitle="Valor total da venda"
              delay={0.1}
            />
            
            <SummaryCard
              title="Custo dos Produtos"
              value={custoTotalProdutos}
              icon={DollarSign}
              color="text-amber-500"
              subtitle="Valor de aquisição"
              delay={0.2}
            />
            
            <SummaryCard
              title="Impostos (Vendas)"
              value={impostosVendas}
              icon={Percent}
              color="text-red-500"
              subtitle="ICMS, PIS, COFINS, etc."
              delay={0.3}
              highlight={true}
            />
            
            <SummaryCard
              title="Impostos (Compras)"
              value={impostosCompras}
              icon={Percent}
              color="text-indigo-500"
              subtitle="Créditos tributários"
              delay={0.4}
              highlight={true}
            />
            
            <SummaryCard
              title="DIFAL e Outros"
              value={difal}
              icon={TrendingDown}
              color="text-purple-500"
              subtitle="Diferencial de alíquotas"
              delay={0.5}
            />
            
            <SummaryCard
              title="Lucro Bruto"
              value={lucroBruto}
              icon={TrendingUp}
              color={`${lucroBruto >= 0 ? 'text-green-500' : 'text-red-500'}`}
              subtitle={`Margem: ${margemLucro.toFixed(2)}%`}
              delay={0.6}
            />
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            {/* Bloco destacado para total de impostos */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-5 shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <div className="flex items-center font-medium nixcon-gold text-lg">
                  <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                    <Calculator className="h-5 w-5 nixcon-gold" />
                  </div>
                  Total de Impostos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalImpostos)}
                </div>
                
                <div className="flex items-center mt-3 md:mt-0 bg-white shadow-sm px-4 py-2 rounded-full">
                  <Percent className="h-4 w-4 mr-2 nixcon-gold" />
                  <span className="font-bold nixcon-gray">
                    {((totalImpostos / faturamentoTotal) * 100).toFixed(2)}% do faturamento
                  </span>
                </div>
              </div>
            </div>
            
            {/* Lucro líquido estimado */}
            <div className={`flex flex-col sm:flex-row items-center justify-center p-5 rounded-xl shadow-md ${
              lucroBruto >= 0 
                ? 'bg-gradient-to-r from-green-50/80 to-green-50 border border-green-100' 
                : 'bg-gradient-to-r from-red-50/80 to-red-50 border border-red-100'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 ${
                lucroBruto >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`h-6 w-6 ${
                  lucroBruto >= 0 ? 'text-green-600' : 'text-red-600'
                } ${lucroBruto >= 0 ? '' : 'rotate-180'}`} />
              </div>
              <div className="text-center sm:text-left">
                <div className="font-medium text-gray-600 mb-1">Lucro Líquido Estimado:</div>
                <div className={`text-2xl font-bold ${lucroBruto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroBruto)}
                  <span className="text-sm ml-2 font-normal opacity-70">
                    ({margemLucro.toFixed(2)}% de margem)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaxSummaryDisplay;