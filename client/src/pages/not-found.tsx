import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">A página que você está procurando não existe ou foi removida.</p>
        <a href="/" className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;