import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Relatórios Financeiros</h2>
          <ul className="space-y-2">
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Demonstrativo de Resultados (DRE)
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Fluxo de Caixa
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Balancete Mensal
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Análise de Contas a Receber
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Relatórios Fiscais</h2>
          <ul className="space-y-2">
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Apuração de Impostos
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Livros Fiscais
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              SPED Fiscal
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Análise Tributária
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Dashboards</h2>
          <ul className="space-y-2">
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Visão Geral Financeira
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Análise de Vendas
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Performance por Cliente
            </li>
            <li className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
              Indicadores de Desempenho
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;