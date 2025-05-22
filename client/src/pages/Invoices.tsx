import React from 'react';

const Invoices: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notas Fiscais</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notas Fiscais Emitidas</h2>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Nova Nota Fiscal
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Número</th>
                <th className="py-3 px-4 text-left">Cliente</th>
                <th className="py-3 px-4 text-left">Data</th>
                <th className="py-3 px-4 text-left">Valor</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">NF-e 123456</td>
                <td className="py-3 px-4">Empresa ABC Ltda</td>
                <td className="py-3 px-4">22/05/2025</td>
                <td className="py-3 px-4">R$ 5.280,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Autorizada</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Visualizar</button>
                  <button className="text-gray-600 hover:text-gray-800">DANFE</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">NF-e 123455</td>
                <td className="py-3 px-4">Comércio XYZ Ltda</td>
                <td className="py-3 px-4">21/05/2025</td>
                <td className="py-3 px-4">R$ 1.750,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Autorizada</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Visualizar</button>
                  <button className="text-gray-600 hover:text-gray-800">DANFE</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">NF-e 123454</td>
                <td className="py-3 px-4">Indústria 123 S/A</td>
                <td className="py-3 px-4">20/05/2025</td>
                <td className="py-3 px-4">R$ 8.320,00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Processando</span></td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Visualizar</button>
                  <button className="text-gray-600 hover:text-gray-800">DANFE</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;