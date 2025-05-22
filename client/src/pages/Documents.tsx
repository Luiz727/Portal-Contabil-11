import React from 'react';

const Documents: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Documentos</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Documentos Recentes</h2>
          <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            Novo Documento
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Tipo</th>
                <th className="py-3 px-4 text-left">Cliente</th>
                <th className="py-3 px-4 text-left">Data</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Contrato de Prestação de Serviços</td>
                <td className="py-3 px-4">PDF</td>
                <td className="py-3 px-4">Empresa ABC Ltda</td>
                <td className="py-3 px-4">22/05/2025</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Visualizar</button>
                  <button className="text-gray-600 hover:text-gray-800">Download</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Nota Fiscal nº 1234</td>
                <td className="py-3 px-4">XML</td>
                <td className="py-3 px-4">Comércio XYZ Ltda</td>
                <td className="py-3 px-4">21/05/2025</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Visualizar</button>
                  <button className="text-gray-600 hover:text-gray-800">Download</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">Relatório Financeiro Trimestral</td>
                <td className="py-3 px-4">XLSX</td>
                <td className="py-3 px-4">Indústria 123 S/A</td>
                <td className="py-3 px-4">18/05/2025</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Visualizar</button>
                  <button className="text-gray-600 hover:text-gray-800">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;