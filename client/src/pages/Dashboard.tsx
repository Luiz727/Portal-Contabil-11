import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Tarefas Pendentes</h2>
          <p className="text-3xl font-bold text-amber-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Clientes Ativos</h2>
          <p className="text-3xl font-bold text-amber-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Documentos Recentes</h2>
          <p className="text-3xl font-bold text-amber-600">8</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;