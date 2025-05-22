import React from 'react';

const TaxCalculatorPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Calculadora de Impostos</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Cálculo de Impostos para Produtos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Operação</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Venda de Mercadoria</option>
              <option>Transferência</option>
              <option>Devolução</option>
              <option>Remessa</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UF de Origem</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>SP</option>
              <option>RJ</option>
              <option>MG</option>
              <option>PR</option>
              <option>RS</option>
              <option>SC</option>
              <option>...</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UF de Destino</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>SP</option>
              <option>RJ</option>
              <option>MG</option>
              <option>PR</option>
              <option>RS</option>
              <option>SC</option>
              <option>...</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regime Tributário</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Simples Nacional</option>
              <option>Lucro Presumido</option>
              <option>Lucro Real</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Selecione um produto</option>
            <option>Notebook Dell Inspiron</option>
            <option>Monitor LG 24"</option>
            <option>Teclado Mecânico</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Produto</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="R$ 0,00" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded-md" defaultValue="1" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Frete</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="R$ 0,00" />
          </div>
        </div>
        
        <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
          Calcular Impostos
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Resultado do Cálculo</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Imposto</th>
                <th className="py-3 px-4 text-left">Base de Cálculo</th>
                <th className="py-3 px-4 text-left">Alíquota</th>
                <th className="py-3 px-4 text-left">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">ICMS</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4">0%</td>
                <td className="py-3 px-4">R$ 0,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">IPI</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4">0%</td>
                <td className="py-3 px-4">R$ 0,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">PIS</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4">0%</td>
                <td className="py-3 px-4">R$ 0,00</td>
              </tr>
              <tr>
                <td className="py-3 px-4">COFINS</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4">0%</td>
                <td className="py-3 px-4">R$ 0,00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Resumo</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>Valor do Produto:</div>
            <div className="text-right">R$ 0,00</div>
            <div>Valor do Frete:</div>
            <div className="text-right">R$ 0,00</div>
            <div>Total de Impostos:</div>
            <div className="text-right">R$ 0,00</div>
            <div className="font-semibold">Valor Total:</div>
            <div className="text-right font-semibold">R$ 0,00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorPage;