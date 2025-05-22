import React from 'react';

const FiscalPageResponsivo = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Módulo Fiscal Responsivo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-base md:text-lg font-semibold mb-2">Emissão de Notas</h2>
          <div className="space-y-2">
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Emitir NF-e
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Emitir NFC-e
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Emitir NFS-e
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-base md:text-lg font-semibold mb-2">Consultas Rápidas</h2>
          <div className="space-y-2">
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Notas Emitidas
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Notas Recebidas
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Status de Processamento
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-base md:text-lg font-semibold mb-2">Relatórios Fiscais</h2>
          <div className="space-y-2">
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Apuração de Impostos
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Livros Fiscais
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              SPED Fiscal
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-base md:text-lg font-semibold mb-2">Acesso Rápido</h2>
          <div className="space-y-2">
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Configurações Fiscais
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Certificados Digitais
            </button>
            <button className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full text-sm md:text-base">
              Integrações SEFAZ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiscalPageResponsivo;