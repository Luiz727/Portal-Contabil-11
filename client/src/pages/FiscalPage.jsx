import React from 'react';

const FiscalPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Módulo Fiscal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Emissão de NF-e</h2>
          <p className="text-gray-600 mb-4">Emissão de Nota Fiscal Eletrônica (NF-e) em conformidade com a legislação.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Acessar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Emissão de NFC-e</h2>
          <p className="text-gray-600 mb-4">Emissão de Nota Fiscal de Consumidor Eletrônica para vendas presenciais.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Acessar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Emissão de NFS-e</h2>
          <p className="text-gray-600 mb-4">Emissão de Nota Fiscal de Serviço Eletrônica para prestadores de serviços.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Acessar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Consulta de Notas</h2>
          <p className="text-gray-600 mb-4">Consulta e gerenciamento de todas as notas fiscais emitidas e recebidas.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Acessar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Livros Fiscais</h2>
          <p className="text-gray-600 mb-4">Geração e gerenciamento de livros fiscais de entrada, saída e apuração.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Acessar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">SPED Fiscal</h2>
          <p className="text-gray-600 mb-4">Geração e envio de arquivos SPED Fiscal, EFD ICMS/IPI e Contribuições.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Acessar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiscalPage;