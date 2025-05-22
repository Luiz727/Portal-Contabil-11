import React, { useState } from 'react';

const UserManagement: React.FC = () => {
  const [users] = useState([
    { id: 1, name: 'João Silva', email: 'joao@exemplo.com', role: 'admin', active: true },
    { id: 2, name: 'Maria Souza', email: 'maria@exemplo.com', role: 'user', active: true },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@exemplo.com', role: 'user', active: false },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
          Adicionar Usuário
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-amber-600 hover:text-amber-900 mr-4">Editar</button>
                  <button className="text-red-600 hover:text-red-900">
                    {user.active ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;