import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Configurações da Conta</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="Administrador NIXCON"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="admin@nixcon.com.br"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue="********"
            />
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Preferências de Notificação</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-notifications"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="email-notifications">Receber notificações por email</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="system-notifications"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="system-notifications">Notificações do sistema</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fiscal-notifications"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="fiscal-notifications">Alertas fiscais</label>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Salvar Preferências
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Aparência</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Claro</option>
              <option>Escuro</option>
              <option>Sistema</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Português</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;