import React from 'react';

const Clients: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Lista de Clientes</h2>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Novo Cliente
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">CNPJ/CPF</th>
                <th className="py-3 px-4 text-left">Contato</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Empresa ABC Ltda</td>
                <td className="py-3 px-4">12.345.678/0001-90</td>
                <td className="py-3 px-4">contato@empresaabc.com.br</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ativo</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Comércio XYZ Ltda</td>
                <td className="py-3 px-4">98.765.432/0001-10</td>
                <td className="py-3 px-4">financeiro@xyz.com.br</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ativo</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Indústria 123 S/A</td>
                <td className="py-3 px-4">45.678.912/0001-34</td>
                <td className="py-3 px-4">contabilidade@industria123.com</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Pendente</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;