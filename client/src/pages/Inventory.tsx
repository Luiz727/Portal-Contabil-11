import React from 'react';

const Inventory: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Estoque</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Produtos em Estoque</h2>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Novo Produto
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Código</th>
                <th className="py-3 px-4 text-left">Produto</th>
                <th className="py-3 px-4 text-left">Categoria</th>
                <th className="py-3 px-4 text-left">Quantidade</th>
                <th className="py-3 px-4 text-left">Valor Unitário</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">P001</td>
                <td className="py-3 px-4">Notebook Dell Inspiron</td>
                <td className="py-3 px-4">Informática</td>
                <td className="py-3 px-4">12</td>
                <td className="py-3 px-4">R$ 4.500,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Disponível</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">P002</td>
                <td className="py-3 px-4">Monitor LG 24"</td>
                <td className="py-3 px-4">Informática</td>
                <td className="py-3 px-4">8</td>
                <td className="py-3 px-4">R$ 1.200,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Disponível</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button className="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">P003</td>
                <td className="py-3 px-4">Teclado Mecânico</td>
                <td className="py-3 px-4">Informática</td>
                <td className="py-3 px-4">3</td>
                <td className="py-3 px-4">R$ 350,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Baixo Estoque</span></td>
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

export default Inventory;