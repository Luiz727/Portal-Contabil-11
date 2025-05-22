import React from 'react';

const TaxCalculatorNIXCONPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">NIXCON Tax Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Cálculo de Impostos Avançado</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Tipo de Operação</label>
              <select className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500">
                <option>Venda de Mercadoria</option>
                <option>Transferência</option>
                <option>Devolução</option>
                <option>Remessa</option>
                <option>Industrialização</option>
                <option>Exportação</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Tipo de Cliente</label>
              <select className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500">
                <option>Contribuinte</option>
                <option>Não Contribuinte</option>
                <option>Consumidor Final</option>
                <option>Estrangeiro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">UF de Origem</label>
              <select className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500">
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
              <label className="block text-sm font-medium text-amber-700 mb-1">UF de Destino</label>
              <select className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500">
                <option>SP</option>
                <option>RJ</option>
                <option>MG</option>
                <option>PR</option>
                <option>RS</option>
                <option>SC</option>
                <option>...</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-amber-700 mb-1">NCM (Nomenclatura Comum do Mercosul)</label>
            <div className="flex space-x-2">
              <input type="text" className="flex-1 p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" placeholder="Ex: 8471.30.19" />
              <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
                Buscar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Informe o código NCM do produto para carregar as alíquotas aplicáveis.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Valor do Produto</label>
              <input type="text" className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" placeholder="R$ 0,00" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Quantidade</label>
              <input type="number" className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" defaultValue="1" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Valor do Frete</label>
              <input type="text" className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" placeholder="R$ 0,00" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Valor do Seguro</label>
              <input type="text" className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" placeholder="R$ 0,00" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Outras Despesas</label>
              <input type="text" className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" placeholder="R$ 0,00" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Desconto</label>
              <input type="text" className="w-full p-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500" placeholder="R$ 0,00" />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
              Calcular Impostos
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
              Limpar
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">ICMS</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Base de Cálculo:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600">Alíquota:</div>
                <div className="text-right font-medium">0%</div>
                <div className="text-gray-600">Valor do ICMS:</div>
                <div className="text-right font-medium">R$ 0,00</div>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">IPI</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Base de Cálculo:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600">Alíquota:</div>
                <div className="text-right font-medium">0%</div>
                <div className="text-gray-600">Valor do IPI:</div>
                <div className="text-right font-medium">R$ 0,00</div>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">PIS/COFINS</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Base de Cálculo:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600">Alíquota PIS:</div>
                <div className="text-right font-medium">0%</div>
                <div className="text-gray-600">Valor do PIS:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600">Alíquota COFINS:</div>
                <div className="text-right font-medium">0%</div>
                <div className="text-gray-600">Valor do COFINS:</div>
                <div className="text-right font-medium">R$ 0,00</div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">Resumo dos Valores</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Valor do Produto:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600">Valor do Frete:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600">Total de Impostos:</div>
                <div className="text-right font-medium">R$ 0,00</div>
                <div className="text-gray-600 font-semibold">Valor Total:</div>
                <div className="text-right font-semibold">R$ 0,00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorNIXCONPage;