import React from 'react';

const Dashboard: React.FC = () => {
  // Dados de exemplo para exibição no dashboard
  const stats = [
    { id: 1, name: 'Notas Fiscais Emitidas', value: '42', change: '+12%', changeType: 'increase' },
    { id: 2, name: 'Faturamento Mensal', value: 'R$ 85.450,00', change: '+8%', changeType: 'increase' },
    { id: 3, name: 'Clientes Ativos', value: '28', change: '+3', changeType: 'increase' },
    { id: 4, name: 'Impostos a Pagar', value: 'R$ 12.350,00', change: '-5%', changeType: 'decrease' },
  ];

  const recentDocuments = [
    { id: 1, type: 'NF-e', number: '000000123', date: '22/05/2025', client: 'Empresa ABC Ltda', value: 'R$ 1.250,00' },
    { id: 2, type: 'NFS-e', number: '000000124', date: '21/05/2025', client: 'XYZ Tecnologia S.A.', value: 'R$ 3.500,00' },
    { id: 3, type: 'NF-e', number: '000000125', date: '20/05/2025', client: 'Distribuidora 123', value: 'R$ 850,00' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Entregar Relatório Mensal', dueDate: '31/05/2025', priority: 'Alta' },
    { id: 2, title: 'Reunião com Cliente XYZ', dueDate: '25/05/2025', priority: 'Média' },
    { id: 3, title: 'Pagamento de Impostos', dueDate: '20/05/2025', priority: 'Alta' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-medium text-gray-500">{stat.name}</h2>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`text-sm font-medium flex items-center ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{stat.change}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Documentos Recentes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Documentos Fiscais Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Seção inferior dividida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarefas Próximas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Tarefas Próximas</h2>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="border-l-4 border-amber-500 p-4 bg-amber-50 rounded-r-md">
                <h3 className="font-medium">{task.title}</h3>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Vencimento: {task.dueDate}</span>
                  <span className={`font-medium ${
                    task.priority === 'Alta' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Links Rápidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors">
              <h3 className="font-medium">Emitir NF-e</h3>
              <p className="text-sm text-gray-600">Nota Fiscal Eletrônica</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors">
              <h3 className="font-medium">Emitir NFS-e</h3>
              <p className="text-sm text-gray-600">Nota de Serviço</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors">
              <h3 className="font-medium">Cadastrar Cliente</h3>
              <p className="text-sm text-gray-600">Novo cadastro</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-md text-left hover:bg-gray-50 transition-colors">
              <h3 className="font-medium">Relatórios</h3>
              <p className="text-sm text-gray-600">Visualizar relatórios</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;