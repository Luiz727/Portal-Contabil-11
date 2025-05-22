import React from 'react';

const WhatsApp: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Business API</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Configuração da Integração</h2>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conectado</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de WhatsApp</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              defaultValue="+55 11 98765-4321"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              defaultValue="Ativo"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              defaultValue="NIXCON Contabilidade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Serviços Financeiros</option>
              <option>Contabilidade</option>
              <option>Consultoria</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Salvar Configurações
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Desconectar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Mensagens Automáticas</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <h3 className="font-medium">Boas-vindas</h3>
                <p className="text-sm text-gray-600">Enviada quando um cliente envia a primeira mensagem</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Editar</button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <h3 className="font-medium">Fora do Expediente</h3>
                <p className="text-sm text-gray-600">Enviada quando mensagens são recebidas fora do horário comercial</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Editar</button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <h3 className="font-medium">Confirmação de Recebimento</h3>
                <p className="text-sm text-gray-600">Enviada quando um documento é recebido</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Editar</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Estatísticas</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Mensagens Enviadas (Último Mês)</h3>
              <p className="text-3xl font-bold text-amber-600">152</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Mensagens Recebidas (Último Mês)</h3>
              <p className="text-3xl font-bold text-amber-600">89</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Taxa de Resposta</h3>
              <p className="text-3xl font-bold text-green-600">94%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Tempo Médio de Resposta</h3>
              <p className="text-3xl font-bold text-amber-600">45 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;