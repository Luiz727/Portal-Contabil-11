import React from 'react';

const Financial: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Saldo Atual</h2>
          <p className="text-3xl font-bold text-green-600">R$ 42.580,00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Contas a Receber</h2>
          <p className="text-3xl font-bold text-amber-600">R$ 15.320,00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Contas a Pagar</h2>
          <p className="text-3xl font-bold text-red-600">R$ 8.750,00</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Movimentações Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Data</th>
                <th className="py-3 px-4 text-left">Descrição</th>
                <th className="py-3 px-4 text-left">Categoria</th>
                <th className="py-3 px-4 text-left">Valor</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">22/05/2025</td>
                <td className="py-3 px-4">Pagamento de Fornecedor</td>
                <td className="py-3 px-4">Despesas</td>
                <td className="py-3 px-4 text-red-600">- R$ 1.250,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Pago</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">21/05/2025</td>
                <td className="py-3 px-4">Recebimento Cliente XYZ</td>
                <td className="py-3 px-4">Receitas</td>
                <td className="py-3 px-4 text-green-600">+ R$ 3.500,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Recebido</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4">20/05/2025</td>
                <td className="py-3 px-4">Pagamento de Impostos</td>
                <td className="py-3 px-4">Impostos</td>
                <td className="py-3 px-4 text-red-600">- R$ 2.780,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Agendado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financial;