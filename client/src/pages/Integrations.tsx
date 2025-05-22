import React from 'react';

const Integrations: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Integrações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Google</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conectado</span>
          </div>
          <p className="text-gray-600 mb-4">Integração com o Google Workspace para sincronização de calendário, contatos e documentos.</p>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors w-full">
            Desconectar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Microsoft 365</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconectado</span>
          </div>
          <p className="text-gray-600 mb-4">Integração com o Microsoft 365 para sincronização de email, calendário e documentos.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Conectar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">WhatsApp Business</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conectado</span>
          </div>
          <p className="text-gray-600 mb-4">Integração com WhatsApp Business API para comunicação com clientes.</p>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors w-full">
            Desconectar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Banco do Brasil</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conectado</span>
          </div>
          <p className="text-gray-600 mb-4">Integração com a API do Banco do Brasil para reconciliação bancária.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Configurar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">SEFAZ</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conectado</span>
          </div>
          <p className="text-gray-600 mb-4">Integração com a SEFAZ para emissão e consulta de documentos fiscais.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Configurar
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Integranotas</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconectado</span>
          </div>
          <p className="text-gray-600 mb-4">Integração com o sistema Integranotas para emissão de NFS-e municipal.</p>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full">
            Conectar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;