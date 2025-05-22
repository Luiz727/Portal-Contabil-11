import React from 'react';

const TaxDocumentsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Documentos Fiscais</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Pesquisar documentos..."
              className="p-2 border border-gray-300 rounded-md"
            />
            <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
              Buscar
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors flex items-center">
              <span className="mr-1">+</span> Novo Documento
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
              Importar
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex bg-gray-100 p-3 border-b">
            <div className="w-10 font-semibold">#</div>
            <div className="w-1/5 font-semibold">Tipo</div>
            <div className="w-1/5 font-semibold">Número</div>
            <div className="w-1/5 font-semibold">Data</div>
            <div className="w-1/5 font-semibold">Valor</div>
            <div className="w-1/5 font-semibold">Status</div>
          </div>
          
          <div className="divide-y">
            <div className="flex p-3 hover:bg-gray-50">
              <div className="w-10">1</div>
              <div className="w-1/5">NF-e</div>
              <div className="w-1/5">000000001</div>
              <div className="w-1/5">22/05/2025</div>
              <div className="w-1/5">R$ 1.250,00</div>
              <div className="w-1/5">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Autorizada</span>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-gray-50">
              <div className="w-10">2</div>
              <div className="w-1/5">NFS-e</div>
              <div className="w-1/5">000000002</div>
              <div className="w-1/5">21/05/2025</div>
              <div className="w-1/5">R$ 750,00</div>
              <div className="w-1/5">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Autorizada</span>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-gray-50">
              <div className="w-10">3</div>
              <div className="w-1/5">NF-e</div>
              <div className="w-1/5">000000003</div>
              <div className="w-1/5">20/05/2025</div>
              <div className="w-1/5">R$ 3.500,00</div>
              <div className="w-1/5">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processando</span>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-gray-50">
              <div className="w-10">4</div>
              <div className="w-1/5">NFC-e</div>
              <div className="w-1/5">000000004</div>
              <div className="w-1/5">19/05/2025</div>
              <div className="w-1/5">R$ 125,50</div>
              <div className="w-1/5">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Autorizada</span>
              </div>
            </div>
            
            <div className="flex p-3 hover:bg-gray-50">
              <div className="w-10">5</div>
              <div className="w-1/5">NFS-e</div>
              <div className="w-1/5">000000005</div>
              <div className="w-1/5">18/05/2025</div>
              <div className="w-1/5">R$ 1.800,00</div>
              <div className="w-1/5">
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejeitada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Estatísticas Mensais</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Documentos Emitidos</h3>
              <p className="text-3xl font-bold text-amber-600">42</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Taxa de Sucesso</h3>
              <p className="text-3xl font-bold text-green-600">95%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Valor Total</h3>
              <p className="text-3xl font-bold text-amber-600">R$ 78.350,00</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Documentos Pendentes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
              <div>
                <h3 className="font-medium">NF-e #000000003</h3>
                <p className="text-sm text-gray-600">Aguardando processamento na SEFAZ</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Verificar</button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
              <div>
                <h3 className="font-medium">NFS-e #000000005</h3>
                <p className="text-sm text-gray-600">Rejeitada: Código de serviço inválido</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Corrigir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDocumentsPage;