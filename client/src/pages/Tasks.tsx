import React from 'react';

const Tasks: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tarefas</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Tarefas Pendentes</h2>
          <ul className="space-y-2">
            <li className="p-3 border border-gray-200 rounded flex justify-between items-center">
              <span>Enviar relatório mensal</span>
              <span className="text-amber-600">Vence hoje</span>
            </li>
            <li className="p-3 border border-gray-200 rounded flex justify-between items-center">
              <span>Reunião com cliente ABC</span>
              <span className="text-green-600">Amanhã</span>
            </li>
            <li className="p-3 border border-gray-200 rounded flex justify-between items-center">
              <span>Atualizar documentação fiscal</span>
              <span className="text-green-600">Em 3 dias</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tasks;