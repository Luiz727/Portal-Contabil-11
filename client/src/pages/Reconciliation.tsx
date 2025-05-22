import React from 'react';

const Reconciliation: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Conciliação</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Conciliação Bancária</h2>
          <div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors mr-2">
              Importar Extrato
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
              Conciliar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Data</th>
                <th className="py-3 px-4 text-left">Descrição</th>
                <th className="py-3 px-4 text-left">Valor Sistema</th>
                <th className="py-3 px-4 text-left">Valor Extrato</th>
                <th className="py-3 px-4 text-left">Diferença</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">22/05/2025</td>
                <td className="py-3 px-4">Pagamento Fornecedor ABC</td>
                <td className="py-3 px-4">R$ 1.250,00</td>
                <td className="py-3 px-4">R$ 1.250,00</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conciliado</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800">Detalhes</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">21/05/2025</td>
                <td className="py-3 px-4">Recebimento Cliente XYZ</td>
                <td className="py-3 px-4">R$ 3.500,00</td>
                <td className="py-3 px-4">R$ 3.500,00</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Conciliado</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800">Detalhes</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">20/05/2025</td>
                <td className="py-3 px-4">Tarifa Bancária</td>
                <td className="py-3 px-4">R$ 0,00</td>
                <td className="py-3 px-4">R$ 45,00</td>
                <td className="py-3 px-4 text-red-600">R$ 45,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Pendente</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800">Conciliar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reconciliation;