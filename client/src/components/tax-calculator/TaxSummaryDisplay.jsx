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
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-primary" />
            Resumo da Simulação de Impostos
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                <div className="flex items-center font-medium text-primary text-lg">
                  <Calculator className="h-5 w-5 mr-2" />
                  Total de Impostos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalImpostos)}
                </div>
                
                <div className="flex items-center mt-2 md:mt-0 bg-white/60 px-3 py-1 rounded-full text-sm">
                  <Percent className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-bold text-primary">
                    {((totalImpostos / faturamentoTotal) * 100).toFixed(2)}% do faturamento
                  </span>
                </div>
              </div>
            </div>
            
            {/* Lucro líquido estimado */}
            <div className={`flex items-center justify-center p-3 rounded-lg ${lucroBruto >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <TrendingUp className={`h-5 w-5 mr-2 ${lucroBruto >= 0 ? 'text-green-600' : 'text-red-600'} ${lucroBruto >= 0 ? '' : 'rotate-180'}`} />
              <span className="font-medium mr-2">Lucro Líquido Estimado:</span>
              <span className={`text-xl font-bold ${lucroBruto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroBruto)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaxSummaryDisplay;